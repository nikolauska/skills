defmodule ElixirSkill.Gettext.ApplyMap do
  @moduledoc false
  alias Expo.Message.Plural
  alias Expo.Message.Singular
  alias Expo.Messages

  def validate_mapping(mapping) when is_map(mapping) do
    Enum.reduce(mapping, %{}, fn {msgid, update}, validated ->
      if not is_binary(msgid) or msgid == "" do
        Mix.raise("Each mapping key must be a non-empty string msgid.")
      end

      cond do
        is_binary(update) ->
          Map.put(validated, msgid, update)

        is_list(update) and update != [] and Enum.all?(update, &is_binary/1) ->
          Map.put(validated, msgid, update)

        true ->
          Mix.raise("Each mapping value must be a string or a non-empty list of strings.")
      end
    end)
  end

  def validate_mapping(_mapping), do: Mix.raise("Mapping JSON must be an object of msgid to msgstr.")

  def apply_mapping(%{__struct__: Messages, messages: messages} = po, mapping) do
    counts = Enum.frequencies_by(messages, &msgid/1)
    ambiguous = Enum.filter(Map.keys(mapping), &(Map.get(counts, &1, 0) > 1))

    if ambiguous != [] do
      Mix.raise("Mapping contains ambiguous msgids: #{inspect(ambiguous)}; edit these entries manually.")
    end

    %{po | messages: Enum.map(messages, &update_message(&1, mapping))}
  end

  defp update_message(message, mapping) do
    case Map.fetch(mapping, msgid(message)) do
      {:ok, update} -> apply_update(message, update)
      :error -> message
    end
  end

  defp apply_update(%{__struct__: Singular} = message, update) when is_binary(update) do
    validate_placeholders(message.msgid, update)
    %{message | msgstr: [update], flags: clear_fuzzy(message.flags)}
  end

  defp apply_update(%{__struct__: Plural} = message, updates) when is_list(updates) do
    if length(updates) != map_size(message.msgstr) do
      Mix.raise("Plural mapping has the wrong number of values for #{inspect(message.msgid)}")
    end

    msgstr =
      Map.new(message.msgstr, fn {index, _value} ->
        case Enum.fetch(updates, index) do
          {:ok, value} ->
            source = if index == 0, do: message.msgid, else: Map.get(message, :msgid_plural, message.msgid)
            validate_placeholders(source, value)
            {index, [value]}

          :error -> Mix.raise("Plural mapping is missing index #{index} for #{inspect(message.msgid)}")
        end
      end)

    %{message | msgstr: msgstr, flags: clear_fuzzy(message.flags)}
  end

  defp apply_update(%{__struct__: Singular}, _update),
    do: Mix.raise("Singular messages require a string mapping value.")

  defp apply_update(%{__struct__: Plural}, _update),
    do: Mix.raise("Plural messages require a list mapping value.")

  defp msgid(message), do: IO.iodata_to_binary(message.msgid)

  defp validate_placeholders(source, translation) do
    if placeholders(source) != placeholders(translation) do
      Mix.raise("Translation placeholders do not match #{inspect(source)}")
    end
  end

  defp placeholders(text) do
    ~r/%\{[^}]+\}/
    |> Regex.scan(IO.iodata_to_binary(text))
    |> List.flatten()
    |> Enum.sort()
  end

  defp clear_fuzzy(flags) do
    flags
    |> Enum.map(&Enum.reject(&1, fn flag -> flag == "fuzzy" end))
    |> Enum.reject(&(&1 == []))
  end
end

case System.argv() do
  [flag] when flag in ["-h", "--help"] ->
    IO.puts("Usage: mix run --no-start apply_translation_map.exs --po PO_FILE --map JSON_FILE")

  argv ->
    {opts, args} = OptionParser.parse!(argv, strict: [po: :string, map: :string])

    if args != [] or is_nil(opts[:po]) or is_nil(opts[:map]) do
      Mix.raise("Usage: mix run --no-start apply_translation_map.exs --po PO_FILE --map JSON_FILE")
    end

    mapping =
      opts[:map]
      |> File.read!()
      |> JSON.decode!()
      |> ElixirSkill.Gettext.ApplyMap.validate_mapping()

    output =
      opts[:po]
      |> Expo.PO.parse_file!()
      |> ElixirSkill.Gettext.ApplyMap.apply_mapping(mapping)
      |> Expo.PO.compose()

    temporary = "#{opts[:po]}.tmp-#{System.unique_integer([:positive])}"

    try do
      File.write!(temporary, output)

      case File.rename(temporary, opts[:po]) do
        :ok -> :ok
        {:error, reason} -> raise File.Error, reason: reason, action: "rename", path: temporary
      end
    after
      File.rm(temporary)
    end
end
