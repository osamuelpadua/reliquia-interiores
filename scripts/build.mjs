import { copyFile, cp, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const destination = resolve('dist');
await mkdir(destination, { recursive: true });
for (const file of ['index.html', 'style.css', 'script.js', 'site.config.js']) {
  await copyFile(file, resolve(destination, file));
}
await cp('assets', resolve(destination, 'assets'), { recursive: true });
async function size(directory) {
  let bytes = 0;
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, item.name);
    bytes += item.isDirectory() ? await size(file) : (await stat(file)).size;
  }
  return bytes;
}
console.log(`Site gerado em dist/ (${((await size(destination)) / 1024 / 1024).toFixed(1)} MB).`);
