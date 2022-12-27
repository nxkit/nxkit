const fs = require('fs');

function checkLockFiles() {
  const errors = [];
  if (fs.existsSync('package-lock.json')) {
    errors.push(
      'Invalid occurence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }
  if (fs.existsSync('yarn.lock')) {
    errors.push(
      'Invalid occurence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }
  try {
    const content = fs.readFileSync('pnpm-lock.yaml', 'utf-8');
    if (content.match(/localhost:487/)) {
      errors.push(
        'The "pnpm-lock.yaml" has reference to local yarn repository ("localhost:4873"). Please use the NPM registry in "pnpm-lock.yaml"'
      );
    }
  } catch {
    errors.push('The "pnpm-lock.yaml" does not exist or cannot be read');
  }
  try {
    // require('child_process').execSync(
    //   'yarn lockfile-lint -s -n -p yarn.lock -a hosts yarn npm',
    //   { encoding: 'utf-8', stdio: 'pipe' }
    // );
  } catch ({ stderr }) {
    const errorLines = stderr.split('\n').slice(0, -4).join('\n');
    errors.push(errorLines);
  }
  return errors;
}

console.log('🔒🔒🔒 Validating lock files 🔒🔒🔒\n');
const invalid = checkLockFiles();
if (invalid.length > 0) {
  invalid.forEach((e) => console.log(e));
  process.exit(1);
} else {
  console.log('Lock file is valid 👍');
  process.exit(0);
}
