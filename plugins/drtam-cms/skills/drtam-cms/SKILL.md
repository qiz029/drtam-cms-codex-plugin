---
name: drtam-cms
description: Use the official Dr Tam CMS CLI for administrator-approved access to create and edit CMS drafts, including Gallery Albums, manage Product Brands, upload Media, and manage translation drafts. Use when an agent needs to connect to or edit the Dr Tam CMS. Publishing, review decisions, deletion, channel management, and social delivery remain excluded.
---

# Dr Tam CMS

Use `drtam-cms` as the only CMS execution boundary. Do not call the CMS API
directly, reuse an administrator browser session, inspect the operating-system
credential store, or ask the user to paste a Device Code.

## Start safely

1. Run `drtam-cms version --json`.
2. If missing, install the public package with
   `npm install --global drtam-cms-cli`. Node.js 22 or newer is required.
3. Run `drtam-cms update --check --json`. Update the official CLI before CMS
   work when a newer version is available unless the user declines.
4. Run `drtam-cms auth whoami --json`. Use only the capabilities reported by
   the CLI. New trusted-editor credentials report `cms:editor`; legacy
   `journal:read` credentials remain read-only.
5. Use `--json` for agent-executed commands. Never print Authorization headers,
   pending verifiers, keychain payloads, or raw Device Codes.

## Connect or upgrade this computer

- Run `drtam-cms auth request --json` once when disconnected or when a legacy
  read-only credential must be upgraded. Report the Request ID, expiry, and
  approval URL without claiming access is ready.
- Check after the administrator responds with `drtam-cms auth status --json`.
- When approved, run `drtam-cms auth redeem --json` on the same computer, then
  verify `drtam-cms auth whoami --json`.
- A request may remain pending for up to 72 hours. Do not poll frequently.

The administrator reviews requests at
`https://drtam-medspa-clinic.com/admin/device-code-request`. Approval grants a
revocable 30-day trusted-editor credential; it does not create an administrator
browser session.

## Work with drafts

Use a temporary JSON file for write commands that accept `--input`. The file
contains the bare CMS payload, not a wrapper with a `payload` property. Start
from the latest object returned by the matching `get` command, preserve fields
the user did not ask to change, and let the CLI apply the current revision
precondition.

Journal:

- `drtam-cms journal list --json`
- `drtam-cms journal get <post-id> --json`
- `drtam-cms journal create --input <payload.json> --json`
- `drtam-cms journal update <post-id> --input <payload.json> --json`
- `drtam-cms journal pin <post-id> --json`
- `drtam-cms journal unpin <post-id> --json`

Pinning is a draft edit. The CLI preserves the complete current payload and
sets only its `pinned` flag under the current revision precondition. Multiple
pinned Posts appear first on the Journal page and remain newest-first within
the pinned group. Pinning never bypasses review, publication, Promotion dates,
or the immutable website snapshot; tell the user when administrator review and
website publication are still required.

A Journal may include one optional video in addition to its required cover
image. Upload an approved H.264 MP4 first, then use the returned Media ID and
matching public Media URL in the payload:

```json
{
  "video": {
    "mediaId": "media_example",
    "video": "https://cms-api.drtam-medspa-clinic.com/media/media_example",
    "altText": "Accurate description of the short video",
    "transcript": "Accurate description of visible text and meaningful action",
    "speech": "none"
  }
}
```

The video must be no larger than 25 MB and must use the shared social profile:
4–15 seconds, vertical 9:16, at least 540×960, 23–60 FPS, H.264 Baseline/Main
4:2:0 with square pixels, and AAC-LC when audio is present. Keep the cover
image: it remains the public poster, Journal listing thumbnail, and fallback
when no video is selected. Journal video cannot contain speech that needs
synchronized captions; set `speech` to `none` only after checking the asset.
Include an accurate transcript of visible text and meaningful action; it is
displayed below the public player. A Device Access draft cannot publish the website or
send the video to social channels; an authorized administrator must review and
confirm each delivery in the CMS.

Treatment:

- `drtam-cms treatment list --json`
- `drtam-cms treatment get <item-id> --json`
- `drtam-cms treatment create --input <payload.json> --json`
- `drtam-cms treatment update <item-id> --input <payload.json> --json`

Before creating a Treatment, list categories and Media, then build a complete
Treatment payload with an existing category name, a valid image Media ID and
its matching public Media URL, accurate alternative text, patient-facing copy,
sections, FAQ, cases, and SEO fields. Use an existing Treatment returned by
`treatment get` as the structural reference, but do not copy its claims or
clinical facts into the new Treatment unless the user supplied and approved
them. The CLI generates the new Treatment resource ID and returns it.

Gallery Album:

- `drtam-cms album list --json`
- `drtam-cms album get <album-id> --json`
- `drtam-cms album create --input <payload.json> --json`
- `drtam-cms album update <album-id> --input <payload.json> --json`

An Album payload contains `title`, lowercase `slug`, `summary`, `photos`, and
`seo`. Start by listing or uploading approved image Media. Every photo must use
a stable unique `id`, its CMS `mediaId`, the matching public `/media/<id>` URL,
an accurate `altText`, and clinic-supplied `title` and `description`; preserve
the Media focal point when present. Do not use video Media, external image URLs,
invented treatment claims, or patient imagery without confirmed permission.

Start an update from the complete `payload` returned by `album get`, preserve
photo ordering and every field the user did not ask to change, then send the
bare payload file through `album update`. The CLI binds updates to the current
immutable Album revision. Create and update save drafts only; Device Access
cannot submit, approve, delete, or publish an Album.

Homepage and Business content:

- `drtam-cms content list --json`
- `drtam-cms content get <item-id> --json`
- `drtam-cms content update <item-id> --input <payload.json> --json`

Do not guess existing resource IDs. A create saves only a new draft. An update
creates a new immutable draft revision and may clear a previous approval; none
of these commands changes the live static website until a human publishes.

Product catalog:

- `drtam-cms products list --json`
- `drtam-cms products update --input <brands.json> --json`

The update file is a bare JSON array of complete Product Brand objects. Each
brand is a storefront collection and may contain a `products` array. A product
requires a stable lowercase `id`, clinic-supplied `name`, factual
`description`, catalog-wide unique `sku`, and `active` flag; image fields are
optional. Start from the `brands` array returned by `products list`, preserve
every brand, product, and field the user did not ask to change, and edit only
the requested values or ordering. Set `active` to `false` to hide a collection
or product without destroying its configuration. Never invent an SKU, price,
inventory state, product claim, or availability.

The CLI updates only the Product Brands field and binds the write to the
current immutable Business revision; it does not overwrite address, phone,
hours, or social-profile data. This saves a Business draft revision and does
not change the live Product page until a human publishes the website.

For a brand image, list or upload approved image Media first. Preserve the
Media ID, its matching public `/media/<id>` URL, accurate `imageAlt`, and the
Media focal point in the Product Brand or nested product object. Do not invent
external image URLs, copy vendor imagery without approval, or omit alternative
text. Clearing all image fields deliberately keeps that collection or product
card text-led.

## Media and taxonomy

- `drtam-cms media list --json`
- `drtam-cms media upload <file> --alt <text> [--folder <folder-id>] --json`
- `drtam-cms media upload-batch --input <manifest.json> --json`
- `drtam-cms media update <media-id> --input <metadata.json> --json`
- `drtam-cms media move <media-id> --input <folder.json> --json`, where the
  input is `{ "folderId": "folder_id" }` or `{ "folderId": null }`.
- `drtam-cms media folder-create --input <folder.json> --json`
- `drtam-cms media folder-update <folder-id> --input <folder.json> --json`
- `drtam-cms category list --json`
- `drtam-cms category create --input <category.json> --json`
- `drtam-cms category update <category-id> --input <category.json> --json`

Use a partial metadata object to set a user-facing Media name without changing
the original uploaded filename:

```json
{ "displayName": "Welcome video" }
```

Set `displayName` to `null` to restore the original filename as the displayed
name. Do not claim that this renames or replaces the stored original file.

For multiple files, use a batch manifest with 1–100 items. Relative paths are
resolved from the CLI's current working directory. Every item must have its own
accurate `altText`; a top-level `folderId` is the default, while an item-level
value overrides it and `null` selects the Media Library root:

```json
{
  "folderId": "folder_treatments",
  "items": [
    { "path": "./before.webp", "altText": "Patient before treatment" },
    { "path": "./after.mp4", "altText": "Patient result after treatment", "folderId": null }
  ]
}
```

The CLI validates the entire manifest before uploading, continues after an
ordinary per-file failure, and stops immediately on an authentication failure.
Read the structured `results`, preserve successful Media IDs, and retry only
failed items instead of resubmitting the original manifest. Preserve
medical-image consent and content constraints supplied by the user; Device
Access does not waive them.

## Translation drafts

Kinds are `homepage`, `treatment`, `post`, and `album`; locales are `vi` and `zh`.

- `drtam-cms translation get <kind> <resource-id> --locale <vi|zh> --json`
- `drtam-cms translation generate <kind> <resource-id> --locale <vi|zh> --json`
- `drtam-cms translation update <kind> <resource-id> --locale <vi|zh> --input <payload.json> --json`

Generation can consume a paid model call. Run it only when the user requests a
translation. The CLI binds manual edits to the current English source revision.

## Preserve the human publication boundary

Device Access does not permit review submission or decisions, publishing or
snapshot restore, deletion, user or channel administration, or social delivery.
Do not work around these boundaries with direct HTTP requests or administrator
cookies. Explain that the draft is ready and hand the final action back to the
authorized human.

For expired, revoked, or invalid credentials, follow the CLI recovery and
create a new Device Access Request. `drtam-cms auth logout --json` removes only
the local credential; immediate server invalidation requires administrator
revocation in the CMS.
