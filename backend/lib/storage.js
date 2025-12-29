import fs from 'fs/promises';
import path from 'path';

async function mkdirp(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (_) {
    // ignore
  }
}

export async function ensureDataFile(filePath) {
  const dir = path.dirname(filePath);
  await mkdirp(dir);
  try {
    await fs.access(filePath);
  } catch (_) {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

export async function readTransactions(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      await ensureDataFile(filePath);
      return [];
    }
    throw err;
  }
}

export async function writeTransactions(filePath, list) {
  const tmp = `${filePath}.tmp`;
  const data = JSON.stringify(list, null, 2);
  await mkdirp(path.dirname(filePath));
  await fs.writeFile(tmp, data, 'utf8');
  await fs.rename(tmp, filePath);
}
