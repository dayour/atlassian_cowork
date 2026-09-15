const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'appPackage/manifest.json'), 'utf8'));
const version = manifest.version;
assert.match(version, /^\d+\.\d+\.\d+$/);
if (process.env.GITHUB_REF_TYPE === 'tag') {
  assert.equal(process.env.GITHUB_REF_NAME, `v${version}`);
}
const output = path.join(root, '.release-output');
const staging = path.join(output, 'template');
fs.rmSync(output, {recursive: true, force: true});
fs.mkdirSync(staging, {recursive: true});
const files = [
  'appPackage/manifest.json',
  'appPackage/color.png',
  'appPackage/outline.png',
  'appPackage/tools/atlassian-rovo-tools.json',
  'appPackage/skills/jira-project-tracking/SKILL.md',
  'appPackage/skills/jira-project-tracking/references/project-tracking-dataset.json',
  'appPackage/skills/jira-project-tracking/references/repro-notes.md',
  'env/.env.dev.example',
  'm365agents.yml',
  'scripts/check-oauth-metadata.ps1',
  '.gitignore',
  'LICENSE'
];
for (const file of files) {
  const destination = path.join(staging, file);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.copyFileSync(path.join(root, file), destination);
}
fs.copyFileSync(path.join(root, 'distribution/README.md'), path.join(staging, 'README.md'));
fs.writeFileSync(path.join(staging, 'package.json'), JSON.stringify({
  name: '@dayour/atlassian-cowork',
  version,
  description: 'Provisioning template for the Atlassian Rovo MCP Cowork DCR reproduction; not a preconfigured installer.',
  license: 'MIT',
  repository: {type: 'git', url: 'git+https://github.com/dayour/atlassian_cowork.git'},
  homepage: 'https://dayour.github.io/atlassian_cowork/',
  publishConfig: {registry: 'https://npm.pkg.github.com'},
  files: ['appPackage/', 'env/.env.dev.example', 'm365agents.yml', 'scripts/', 'README.md', 'LICENSE'],
  engines: {node: '>=20'}
}, null, 2) + '\n');
assert.equal(manifest.id, '${{TEAMS_APP_ID}}');
assert.equal(manifest.agentConnectors[0].toolSource.remoteMcpServer.authorization.referenceId,
  '${{ATLASSIAN_ROVO_DCR_V2_CONFIGURATION_ID}}');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packed = JSON.parse(execFileSync(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', output], {
  cwd: staging, encoding: 'utf8', shell: process.platform === 'win32'
}))[0];
const expected = new Set([...files.filter(file => file !== '.gitignore'), 'README.md', 'package.json']);
assert.deepEqual(new Set(packed.files.map(file => file.path)), expected);
const sourceName = `atlassian-cowork-v${version}-source.zip`;
const tracked = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim().split('\n');
assert.ok(!tracked.some(file => /^(node_modules|build|\.docusaurus)\//.test(file) ||
  /^appPackage\/(build|\.generated)\//.test(file) || /^env\//.test(file) && !file.endsWith('.example')));
execFileSync('git', ['archive', '--format=zip', `--prefix=atlassian-cowork-v${version}/`,
  `--output=${path.join(output, sourceName)}`, 'HEAD'], {cwd: root});
const artifacts = [packed.filename, sourceName];
const checksums = artifacts.map(file => `${crypto.createHash('sha256').update(fs.readFileSync(path.join(output, file))).digest('hex')}  ${file}`);
fs.writeFileSync(path.join(output, 'SHA256SUMS.txt'), checksums.join('\n') + '\n');
console.log(JSON.stringify({version, packageFiles: packed.files.length, artifacts}, null, 2));