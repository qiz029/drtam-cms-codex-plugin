# Dr Tam CMS Codex plugin

This skills-only plugin teaches Codex to use the public `drtam-cms-cli` package
as the sole execution boundary for Dr Tam CMS. The plugin never stores a Device
Code, calls the CMS API directly, or reuses an administrator browser session.

The source is public under the Apache License 2.0. Installing the plugin does
not grant CMS access: every computer must receive administrator-approved Device
Access before it can read or edit clinic content.

## Fastest install: ask your Codex agent

Send this message to a Codex agent running on the computer where you want to
use the plugin:

> Read the Dr Tam CMS plugin installation guide at
> https://raw.githubusercontent.com/qiz029/drtam-cms-codex-plugin/main/plugins/drtam-cms/README.md
> and install the plugin on this computer. You may run the documented `codex
> plugin` commands. Verify the installed plugin, then tell me when I should
> restart the Codex app. Do not request CMS Device Access yet.

The agent should:

1. Confirm that the `codex` CLI is available.
2. Run `codex plugin marketplace list` and check for the `drtam` marketplace.
3. If it is missing, run:

   ```bash
   codex plugin marketplace add qiz029/drtam-cms-codex-plugin --ref main
   ```

4. Install or reinstall the plugin:

   ```bash
   codex plugin add drtam-cms@drtam
   ```

5. Run `codex plugin list` and verify that `drtam-cms@drtam` is shown as
   `installed, enabled`.
6. Tell the user to restart the Codex app and begin a new conversation.

Installing the plugin is separate from connecting it to Dr Tam CMS. During
installation, the agent must not ask for, read, or copy API keys, passwords,
Device Codes, or CMS credentials. Device Access begins only when the user later
asks to connect the computer.

## Use in the Codex app

The Codex app and Codex CLI use the same plugin installation on a computer.
After the marketplace and plugin commands above finish:

1. Quit and reopen the Codex app.
2. Open Plugins and select the **Dr Tam** marketplace if you want to inspect the
   installed plugin.
3. Verify that **Dr Tam CMS** is installed and enabled.
4. Start a new conversation before asking Codex to use it.

If the agent in the app cannot run local commands, run the commands below once
in Terminal, then restart the app.

## User flow

1. Install the plugin from the Dr Tam marketplace.
2. Start a new Codex conversation and ask: `Connect this computer to Dr Tam CMS.`
3. Codex installs or updates `drtam-cms-cli`, then creates a Device Access Request.
4. An administrator approves the Request ID at
   <https://drtam-medspa-clinic.com/admin/device-code-request>.
5. Tell Codex the request is approved. Codex redeems it on the same computer and
   verifies the granted scope.

The resulting 30-day `cms:editor` credential is revocable and stored by the CLI
in the operating-system credential store. It can list, read, create, and update
Journal and Treatment drafts; edit Homepage and Business drafts; and manage
Media, treatment categories, and translations. It cannot publish, delete,
approve clinical review, manage channels, or deliver social posts.

## Install manually

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
