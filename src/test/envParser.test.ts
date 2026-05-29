import * as assert from 'node:assert/strict';
import { encodeEnvValue, parseEnvLine } from '../envParser';

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('parses simple assignment', () => {
  const parsed = parseEnvLine('API_KEY=secret123', 0);
  assert.ok(parsed);
  assert.equal(parsed.key, 'API_KEY');
  assert.equal(parsed.rawValue, 'secret123');
  assert.equal(parsed.decodedValue, 'secret123');
  assert.equal(parsed.valueRange.startCharacter, 8);
  assert.equal(parsed.valueRange.endCharacter, 17);
});

test('parses export prefix', () => {
  const parsed = parseEnvLine('export API_KEY=secret123', 1);
  assert.ok(parsed);
  assert.equal(parsed.key, 'API_KEY');
  assert.equal(parsed.exportPrefix, true);
  assert.equal(parsed.valueRange.startLine, 1);
  assert.equal(parsed.valueRange.startCharacter, 15);
  assert.equal(parsed.valueRange.endCharacter, 24);
});

test('parses double-quoted value', () => {
  const parsed = parseEnvLine('KEY="quoted value"', 0);
  assert.ok(parsed);
  assert.equal(parsed.rawValue, '"quoted value"');
  assert.equal(parsed.decodedValue, 'quoted value');
  assert.equal(parsed.quoteStyle, '"');
});

test('parses single-quoted value', () => {
  const parsed = parseEnvLine("KEY='single quoted'", 0);
  assert.ok(parsed);
  assert.equal(parsed.decodedValue, 'single quoted');
  assert.equal(parsed.quoteStyle, "'");
});

test('skips comments and blank lines', () => {
  assert.equal(parseEnvLine('# comment', 0), null);
  assert.equal(parseEnvLine('', 0), null);
  assert.equal(parseEnvLine('   ', 0), null);
});

test('skips unclosed quoted values', () => {
  assert.equal(parseEnvLine('KEY="multiline', 0), null);
});

test('parses empty value', () => {
  const parsed = parseEnvLine('KEY=', 0);
  assert.ok(parsed);
  assert.equal(parsed.rawValue, '');
  assert.equal(parsed.decodedValue, '');
});

test('encodeEnvValue preserves quoting', () => {
  assert.equal(encodeEnvValue('plain', null), 'plain');
  assert.equal(encodeEnvValue('quoted value', '"'), '"quoted value"');
  assert.equal(encodeEnvValue('single', "'"), "'single'");
});

console.log('All parser tests passed.');
