---
name: drtam-cms
description: Use the official Dr Tam CMS CLI for administrator-approved access to create and edit CMS drafts, upload Media, and manage translation drafts. Use when an agent needs to connect to or edit the Dr Tam CMS. Publishing, review decisions, deletion, channel management, and social delivery remain excluded.
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

Use a temporary JSON file for write commands. The file contains the bare CMS
payload, not a wrapper with a `payload` property. Start from the latest object
returned by the matching `get` command, preserve fields the user did not ask to
change, and let the CLI apply the current revision precondition.

Journal:

- `drtam-cms journal list --json`
- `drtam-cms journal get <post-id> --json`
- `drtam-cms journal create --input <payload.json> --json`
- `drtam-cms journal update <post-id> --input <payload.json> --json`

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

Homepage and Business content:

- `drtam-cms content list --json`
- `drtam-cms content get <item-id> --json`
- `drtam-cms content update <item-id> --input <payload.json> --json`

Do not guess existing resource IDs. A create saves only a new draft. An update
creates a new immutable draft revision and may clear a previous approval; none
of these commands changes the live static website until a human publishes.

## Media and taxonomy

- `drtam-cms media list --json`
- `drtam-cms media upload <file> --alt <text> [--folder <folder-id>] --json`
- `drtam-cms media update <media-id> --input <metadata.json> --json`
- `drtam-cms media move <media-id> --input <folder.json> --json`, where the
  input is `{ "folderId": "folder_id" }` or `{ "folderId": null }`.
- `drtam-cms media folder-create --input <folder.json> --json`
- `drtam-cms media folder-update <folder-id> --input <folder.json> --json`
- `drtam-cms category list --json`
- `drtam-cms category create --input <category.json> --json`
- `drtam-cms category update <category-id> --input <category.json> --json`

Uploads require accurate alternative text. Preserve medical-image consent and
content constraints supplied by the user; Device Access does not waive them.

## Translation drafts

Kinds are `homepage`, `treatment`, and `post`; locales are `vi` and `zh`.

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
