#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let body;
try {
  body = fs.readFileSync(path.join(__dirname, '..', 'skills', 'ponytail', 'SKILL.md'), 'utf8')
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
} catch (error) {
  if (process.argv[2] === '--self-check') throw error;
  process.exit(0);
}

const context = `PONYTAIL MODE ACTIVE\n\n${body}`;

function render(event, env) {
  if (env.COPILOT_PLUGIN_DATA) return JSON.stringify({ additionalContext: context });
  if (env.PLUGIN_DATA || event === 'SubagentStart') {
    return JSON.stringify({
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    });
  }
  return context;
}

if (process.argv[2] === '--self-check') {
  assert(!body.startsWith('---'));
  assert(context.includes('Favor deletion before addition'));
  assert.equal(JSON.parse(render('SessionStart', { PLUGIN_DATA: 'x' })).hookSpecificOutput.hookEventName, 'SessionStart');
  assert.equal(JSON.parse(render('sessionStart', { COPILOT_PLUGIN_DATA: 'x' })).additionalContext, context);
  assert.equal(JSON.parse(render('SubagentStart', {})).hookSpecificOutput.hookEventName, 'SubagentStart');
} else {
  process.stdout.write(render(process.argv[2] || 'SessionStart', process.env));
}
