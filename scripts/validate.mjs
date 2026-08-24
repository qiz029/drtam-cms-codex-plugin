import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

const manifestPath = "plugins/drtam-cms/.codex-plugin/plugin.json";
const manifest = JSON.parse(await read(manifestPath));
assert.equal(manifest.name, "drtam-cms");
assert.match(manifest.version, /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/);
assert.equal(manifest.license, "Apache-2.0");
assert.equal(manifest.repository, "https://github.com/qiz029/drtam-cms-codex-plugin");
assert.equal(manifest.skills, "./skills/");
assert.equal(manifest.interface.displayName, "Dr Tam CMS");
assert.ok(manifest.interface.privacyPolicyURL.startsWith("https://"));
assert.ok(manifest.interface.termsOfServiceURL.startsWith("https://"));
assert.ok(manifest.interface.defaultPrompt.length > 0);
assert.ok(manifest.interface.defaultPrompt.length <= 3);

for (const asset of [manifest.interface.composerIcon, manifest.interface.logo]) {
  assert.ok(asset.startsWith("./assets/"));
  await access(path.join(root, "plugins/drtam-cms", asset));
}

const marketplace = JSON.parse(await read(".agents/plugins/marketplace.json"));
assert.equal(marketplace.name, "drtam");
const entry = marketplace.plugins.find((candidate) => candidate.name === manifest.name);
assert.ok(entry, "Marketplace must expose drtam-cms");
assert.deepEqual(entry.source, { source: "local", path: "./plugins/drtam-cms" });
assert.equal(entry.policy.installation, "AVAILABLE");
assert.equal(entry.policy.authentication, "ON_USE");

const skill = await read("plugins/drtam-cms/skills/drtam-cms/SKILL.md");
assert.match(skill, /^---\nname: drtam-cms\n/);
assert.doesNotMatch(skill, /\[TODO:/);

for (const required of ["LICENSE", "NOTICE", "README.md", "SUPPORT.md", "TERMS.md"]) {
  await access(path.join(root, required));
}

console.log("Dr Tam CMS public Codex plugin is valid.");
