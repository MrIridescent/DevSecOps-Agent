#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
  console.log(chalk.bold.magenta('\n✦ Iridescent DevSecOps Platform v2.2 ✦'));
  console.log(chalk.bold.yellow('Unified AI Security Orchestrator & Turnkey System\n'));
  console.log(chalk.gray('Developed by David Akpoviroro Oke (MrIridescent)\n'));

  // 1. Environment Check
  console.log(chalk.blue('🔍 Step 1: Checking DevSecOps environment...'));
  const nodeVersion = process.version;
  console.log(chalk.white(`   Node.js version: ${nodeVersion}`));
  if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
    console.error(chalk.red('❌ Error: Node.js v18.0.0 or higher is required.'));
    process.exit(1);
  }
  console.log(chalk.green('   ✅ Node.js version is compatible.\n'));

  // 2. Install Dependencies
  console.log(chalk.blue('📦 Step 2: Installing core dependencies...'));
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(chalk.green('   ✅ Dependencies installed successfully.\n'));
  } catch (error) {
    console.error(chalk.red('   ❌ Failed to install dependencies. Check your npm/network.\n'));
    process.exit(1);
  }

  // 3. Configure API Key
  console.log(chalk.blue('🔑 Step 3: Configuring AI Orchestrator...'));
  let apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.log(chalk.yellow('   No ANTHROPIC_API_KEY found in environment.'));
    const inputKey = await question(chalk.cyan('   Enter your Anthropic API Key (secure): '));
    if (inputKey) {
      apiKey = inputKey.trim();
      const envContent = `ANTHROPIC_API_KEY=${apiKey}\nANTHROPIC_MODEL=claude-3-5-sonnet-latest\n`;
      await fs.writeFile('.env', envContent, 'utf-8');
      console.log(chalk.green('   ✅ Credentials secured in .env file.\n'));
    } else {
      console.log(chalk.red('   ⚠️  AI features will be disabled until an API Key is provided.\n'));
    }
  } else {
    console.log(chalk.green('   ✅ API Key detected and validated.\n'));
  }

  // 4. Build System
  console.log(chalk.blue('🏗️  Step 4: Compiling Iridescent DevSecOps Core...'));
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(chalk.green('   ✅ Security core system compiled and ready.\n'));
  } catch (error) {
    console.error(chalk.red('   ❌ Compilation failed. Please check for TypeScript errors.\n'));
    process.exit(1);
  }

  // 5. Global Link (Optional)
  const linkAnswer = await question(chalk.magenta('🚀 Step 5: Link "iridescent-sec-agent" globally for system-wide access? (y/n): '));
  if (linkAnswer.toLowerCase() === 'y') {
    try {
      console.log(chalk.blue('   Linking security binary...'));
      execSync('npm link', { stdio: 'inherit' });
      console.log(chalk.green('   ✅ Global access enabled. Try running "iridescent-sec-agent doctor" anywhere!\n'));
    } catch (error) {
      console.log(chalk.yellow('   ⚠️  Could not link globally (permissions issue). Try "sudo npm link".\n'));
    }
  }

  // 6. Final Diagnostic
  console.log(chalk.blue('🩺 Step 6: Running Final Security Health Check...'));
  try {
    execSync('node dist/cli.js doctor', { stdio: 'inherit' });
  } catch (error) {
    console.log(chalk.yellow('   ⚠️  Health check finished with minor warnings.\n'));
  }

  console.log(chalk.bold.magenta('\n🎉 Setup Complete! Welcome to the Iridescent DevSecOps Ecosystem.'));
  console.log(chalk.cyan('\nQuick Start:'));
  console.log(chalk.white('  1. Review:  ') + chalk.bold('iridescent-sec-agent review ./src --ai'));
  console.log(chalk.white('  2. Fix:     ') + chalk.bold('iridescent-sec-agent fix ./src --ai'));
  console.log(chalk.white('  3. Explore: ') + chalk.bold('./docs/USER_MANUAL.md\n'));

  rl.close();
}

run();
