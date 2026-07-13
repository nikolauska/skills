defmodule ElixirSkill.Gettext.Missing do
  @moduledoc false
  alias Expo.Message

  def untranslated?(%{__struct__: Message.Singular, msgstr: msgstr}),
    do: IO.iodata_to_binary(msgstr) == ""

  def untranslated?(%{__struct__: Message.Plural, msgstr: msgstr}),
    do: msgstr == %{} or Enum.any?(msgstr, fn {_index, value} -> IO.iodata_to_binary(value) == "" end)
end

case System.argv() do
  [flag] when flag in ["-h", "--help"] ->
    IO.puts("Usage: mix run --no-start find_missing_translations.exs [GETTEXT_ROOT]")

  args when length(args) <= 1 ->
    root = List.first(args, "priv/gettext")

    root
    |> Path.join("**/*.po")
    |> Path.wildcard()
    |> Enum.sort()
    |> Enum.each(fn path ->
      po = Expo.PO.parse_file!(path)
      messages = Enum.filter(po.messages, &ElixirSkill.Gettext.Missing.untranslated?/1)

      if messages != [] do
        IO.puts("=== #{path} ===")
        IO.write(Expo.PO.compose(%{__struct__: Expo.Messages, messages: messages}))
        IO.puts("")
      end
    end)

  _args ->
    IO.puts(:stderr, "Usage: mix run --no-start find_missing_translations.exs [GETTEXT_ROOT]")
    System.halt(2)
end
