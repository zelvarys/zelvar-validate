import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const name = packageJson.name;
const version = packageJson.version;
const gitTag = `v${version}`;
const prerelease = version.includes('-');

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid package version: ${version}`);
}

const tagExists =
  execFileSync('git', ['tag', '--list', gitTag], {
    cwd: root,
    encoding: 'utf8'
  }).trim() === gitTag;

function getDistTag(value) {
  if (!value.includes('-')) {
    return 'latest';
  }

  const identifier = value.split('-')[1].split('.')[0].toLowerCase();

  if (identifier === 'beta') {
    return 'beta';
  }

  if (identifier === 'rc') {
    return 'rc';
  }

  return 'next';
}

async function isPublished() {
  const registry = (process.env.NPM_REGISTRY_URL || 'https://registry.npmjs.org').replace(
    /\/$/,
    ''
  );
  const url = `${registry}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json'
    }
  });

  if (response.status === 200) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  throw new Error(
    `Unexpected registry response ${response.status} while checking ${name}@${version}`
  );
}

const published = await isPublished();

const output = {
  version,
  git_tag: gitTag,
  dist_tag: getDistTag(version),
  is_prerelease: String(prerelease),
  tag_exists: String(tagExists),
  published: String(published),
  needs_tag: String(!tagExists),
  needs_publish: String(!published)
};

for (const [key, value] of Object.entries(output)) {
  console.log(`${key}=${value}`);
}
