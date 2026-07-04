import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXPLAIN_FOUNDATION } from "../js/content/explain-foundation.js";
import { EXPLAIN_LEVELS } from "../js/ui/state.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainJs = readFileSync(path.join(root, "js/main.js"), "utf8");

test("EXPLAIN_FOUNDATION covers eli5 ms hs", () => {
  assert.ok(EXPLAIN_FOUNDATION.eli5.length > 500);
  assert.ok(EXPLAIN_FOUNDATION.ms.length > 500);
  assert.ok(EXPLAIN_FOUNDATION.hs.length > 500);
});

test("foundation levels cite primary sources", () => {
  for (const lvl of ["eli5", "ms", "hs"]) {
    assert.match(EXPLAIN_FOUNDATION[lvl], /sec\.gov|fcc\.gov|businesswire\.com/i, `${lvl} missing primary link`);
  }
});

test("main.js imports EXPLAIN_FOUNDATION", () => {
  assert.match(mainJs, /import \{ EXPLAIN_FOUNDATION \} from "\.\/content\/explain-foundation\.js"/);
  assert.match(mainJs, /\.\.\.EXPLAIN_FOUNDATION/);
});

test("main.js EXPL defines college pro phd inline", () => {
  assert.match(mainJs, /col:\s*`/);
  assert.match(mainJs, /pro:\s*`/);
  assert.match(mainJs, /phd:\s*`/);
});

test("all six explain levels wired in EXPL object", () => {
  assert.equal(Object.keys(EXPLAIN_FOUNDATION).length, 3);
  assert.deepEqual(["eli5", "ms", "hs"], Object.keys(EXPLAIN_FOUNDATION));
  assert.equal(EXPLAIN_LEVELS.length, 6);
  for (const lvl of ["col", "pro", "phd"]) {
    assert.match(mainJs, new RegExp(`${lvl}:\\s*\``));
  }
});

test("PhD level discusses revenue identifiability", () => {
  assert.match(mainJs, /identifiab/i);
  assert.match(mainJs, /wholesale rev-share/i);
});
