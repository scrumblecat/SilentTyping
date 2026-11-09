import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const checkout = process.env.UNBOUND_SOURCE;
if (!checkout) {
  throw new Error('Set UNBOUND_SOURCE to the Unbound checkout described in README.md.');
}

const preset = pathToFileURL(resolve(checkout, 'packages/cli/src/rollup/index.ts')).href;
const { unbound } = await import(preset);
export default unbound(import.meta.url, { bytecode: false });
