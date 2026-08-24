# Dr Tam CMS Codex plugin

This skills-only plugin teaches Codex to use the public `drtam-cms-cli` package
as the sole execution boundary for Dr Tam CMS. The plugin never stores a Device
Code, calls the CMS API directly, or reuses an administrator browser session.

The source is public under the Apache License 2.0. Installing the plugin does
not grant CMS access: every computer must receive administrator-approved Device
Access before it can read or edit clinic content.

## User flow

1. Install the plugin from the Dr Tam marketplace.
2. Start a new Codex conversation and ask: `Connect this computer to Dr Tam CMS.`
3. Codex installs or updates `drtam-cms-cli`, then creates a Device Access Request.
4. An administrator approves the Request ID at
   <https://drtam-medspa-clinic.com/admin/device-code-request>.
5. Tell Codex the request is approved. Codex redeems it on the same computer and
   verifies the granted scope.

The resulting 30-day `cms:editor` credential is revocable and stored by the CLI
in the operating-system credential store. It can manage non-destructive drafts,
Media, treatment categories, and translations. It cannot publish, delete,
approve clinical review, manage channels, or deliver social posts.

## Install in Codex

From a machine with Codex installed:

```bash
codex plugin marketplace add qiz029/drtam-cms-codex-plugin --ref main
codex plugin add drtam-cms@drtam
```

Restart Codex and use a new conversation so the installed skill is discovered.

To refresh the public marketplace and reinstall the current plugin version:

```bash
codex plugin marketplace upgrade drtam
codex plugin add drtam-cms@drtam
```

## Source of truth

The canonical skill is also shipped in the public `drtam-cms-cli` npm package.
The private application repository checks the CLI copy and this public plugin
copy for byte-level drift before release.

## Policies and support

- [Privacy policy](https://drtam-medspa-clinic.com/privacy/)
- [Terms of use](./TERMS.md)
- [Support](./SUPPORT.md)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
