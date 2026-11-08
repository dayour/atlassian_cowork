const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const runId = crypto.randomBytes(4).toString('hex');
const output = path.join(root, '.dcr-tests', runId);
const source = JSON.parse(fs.readFileSync(path.join(root, 'appPackage/manifest.json')));
const lifecycle = yaml.load(fs.readFileSync(path.join(root, 'm365agents.yml'), 'utf8'));
const records = [];

for (const variant of ['A', 'B']) {
  const directory = path.join(output, variant);
  const name = `Rovo ${variant} ${runId}`;
  fs.mkdirSync(path.join(directory, 'env'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'appPackage'), { recursive: true });
  for (const entry of ['color.png', 'outline.png', 'tools', 'skills']) {
    fs.cpSync(path.join(root, 'appPackage', entry), path.join(directory, 'appPackage', entry), { recursive: true });
  }
  const manifest = structuredClone(source);
  manifest.name = { short: name, full: name };
  const remote = manifest.agentConnectors[0].toolSource.remoteMcpServer;
  if (variant === 'A') delete remote.authorization;
  const provision = structuredClone(lifecycle.provision).filter(step => variant === 'B' || step.uses !== 'dcr/register');
  provision.find(step => step.uses === 'teamsApp/create').with.name = name;
  provision.find(step => step.uses === 'copilotAgent/publish').with.scope = 'personal';
  const config = { version: lifecycle.version, environmentFolderPath: './env', provision };
  assert.equal(Object.hasOwn(remote, 'authorization'), variant === 'B');
  assert.equal(provision.some(step => step.uses === 'dcr/register'), variant === 'B');
  assert.equal(remote.mcpServerUrl, source.agentConnectors[0].toolSource.remoteMcpServer.mcpServerUrl);
  assert.deepEqual(remote.mcpToolDescription, source.agentConnectors[0].toolSource.remoteMcpServer.mcpToolDescription);
  assert.equal(manifest.id, '${{TEAMS_APP_ID}}');
  fs.writeFileSync(path.join(directory, 'appPackage/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(directory, 'm365agents.yml'), yaml.dump(config, { lineWidth: -1 }));
  fs.writeFileSync(path.join(directory, 'env/.env.dev'), 'TEAMSFX_ENV=dev\n');
  const toolFile = remote.mcpToolDescription.file;
  const toolHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(directory, 'appPackage', toolFile))).digest('hex');
  records.push({ variant, name, directory, toolHash, runtimeResult: 'NOT RUN' });
}
assert.equal(records[0].toolHash, records[1].toolHash);
assert.notEqual(records[0].name, records[1].name);
fs.writeFileSync(path.join(output, 'test-record.json'), JSON.stringify({ runId, createdAt: new Date().toISOString(), records }, null, 2) + '\n');
console.log(JSON.stringify({ runId, records }, null, 2));