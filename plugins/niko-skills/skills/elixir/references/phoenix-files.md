# Phoenix Uploads and Files

Use these rules for LiveView uploads, local persistence, public static serving, and authenticated downloads.

## Choose the Boundary

- Public, cacheable file: store under an approved public directory and serve through `Plug.Static`.
- Private or permissioned file: keep it outside public static paths and serve it through authorized controller logic.
- External object storage: use the project's existing adapter and runtime configuration; never embed credentials.

## LiveView Uploads

1. Read `mount/3`, upload events, template, storage code, and tests together.
2. Default to manual upload and consume entries in the submit handler.
3. Use `auto_upload: true` only with a progress callback that consumes completed entries.
4. Configure `accept`, `max_entries`, and `max_file_size` in `allow_upload/3`.
5. Generate server-side storage names; never trust `entry.client_name` as a path.
6. Render upload-level and entry-level errors, progress, and cancel behavior when exposed.

```elixir
allow_upload(socket, :photos,
  accept: ~w(.jpg .jpeg .png),
  max_entries: 5,
  max_file_size: 10_000_000
)
```

```elixir
consume_uploaded_entries(socket, :photos, fn %{path: path}, entry ->
  ext = Path.extname(entry.client_name)
  filename = "#{Ecto.UUID.generate()}#{ext}"
  destination = Path.join(["priv", "static", "uploads", filename])
  File.mkdir_p!(Path.dirname(destination))
  File.cp!(path, destination)
  {:ok, "/uploads/#{filename}"}
end)
```

Validate the extension independently of the generated name when storage policy requires it. Do not mix auto-upload with submit-time consumption unless the hybrid flow is intentional and tested.

## Static and Private Serving

- Map `/uploads/file.png` to `priv/static/uploads/file.png` only for public files.
- Include the public top-level directory in the application's `static_paths/0` and confirm endpoint `Plug.Static` uses that list.
- Sanitize user-derived names with `Path.basename/1` and constrain joins to the approved base directory.
- Confirm release artifacts include expected static files and production URL/CDN configuration is correct.
- Use authenticated `send_download/3` or `send_file/3` logic for private files.

## Validation

- Verify successful upload and invalid type or size behavior.
- Verify too-many-files and cancel behavior when supported.
- Confirm stored names cannot collide or traverse directories.
- Confirm returned public URLs resolve and private files are not exposed by `Plug.Static`.
- Check production packaging when behavior differs from development.
