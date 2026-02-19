#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.cyan('🛡️  Running DevOps Agent Pre-commit Checks...'));

try {
  // 1. Lint
  console.log(chalk.blue('🧵 Linting...'));
  execSync('npm run lint', { stdio: 'inherit' });

  // 2. Tests
  console.log(chalk.blue('🧪 Running tests...'));
  execSync('npm test', { stdio: 'inherit' });

  // 3. Fast Static Review
  console.log(chalk.blue('🔍 Running fast code review...'));
  // Run review on staged files would be better, but for now we run on ./src
  execSync('node dist/cli.js review ./src', { stdio: 'inherit' });

  console.log(chalk.green('\n✅ Pre-commit checks passed!\n'));
} catch (error) {
  console.error(chalk.red('\n❌ Pre-commit checks failed. Please fix issues before committing.\n'));
  process.exit(1);
}
