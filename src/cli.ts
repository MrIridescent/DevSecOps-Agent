#!/usr/bin/env node

import { Command } from 'commander';
import { DevOpsAgent } from './agent.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('iridescent-sec-agent')
  .description('Iridescent DevSecOps Platform: Unified AI Security Orchestrator by David Akpoviroro Oke (MrIridescent)')
  .version('2.2.0');

// Review Command
program
  .command('review')
  .description('Perform deep security review using the Iridescent DevSecOps Orchestrator')
  .argument('[path]', 'Path to analyze', '.')
  .option('--ai', 'Use AI for deep semantic security analysis', false)
  .option('-k, --api-key <key>', 'Anthropic API key')
  .option('-m, --mode <mode>', 'Analysis mode: fast, thorough, or hybrid', 'hybrid')
  .option('-a, --architecture', 'Include architectural security analysis', false)
  .option('-o, --output <format>', 'Output format (console, json, markdown)', 'console')
  .option('-f, --file <path>', 'Save security report to file')
  .action(async (targetPath: string, options) => {
    try {
      console.log(chalk.bold.magenta('\n✦ Iridescent DevSecOps Review ✦'));
      console.log(chalk.gray('  Powered by Claude Sonnet & Advanced Security Analysis\n'));
      
      const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
      
      if (options.ai && !apiKey) {
        console.error(chalk.red('\n❌ Error: ANTHROPIC_API_KEY is required for AI security analysis.'));
        console.error('   Set it via environment variable or use --api-key flag\n');
        process.exit(1);
      }

      const agent = new DevOpsAgent({
        targetPath,
        useAI: options.ai,
        aiApiKey: apiKey,
        aiMode: options.mode as any,
        architectureReview: options.architecture,
        outputFormat: options.output as any,
      });

      const report = await agent.reviewCode();
      
      if (options.output === 'console') {
        agent.printReport(report);
      } else {
        const output = await agent.exportReport(report, options.output as any);
        
        if (options.file) {
          await fs.writeFile(options.file, output, 'utf-8');
          console.log(chalk.green(`\n✅ Iridescent Security Report saved to ${options.file}\n`));
        } else {
          console.log(output);
        }
      }

      // Exit with error code if critical or high severity issues found
      if (report.summary.critical > 0 || report.summary.high > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error during Iridescent DevSecOps review:'), error);
      process.exit(1);
    }
  });

// Fix Command
program
  .command('fix')
  .description('Automatically remediate security vulnerabilities using Iridescent AI')
  .argument('[path]', 'Path to fix', '.')
  .option('--ai', 'Use AI for intelligent production-ready security fixes', false)
  .option('-k, --api-key <key>', 'Anthropic API key')
  .option('-d, --dry-run', 'Show what would be fixed without making changes')
  .action(async (targetPath: string, options) => {
    try {
      console.log(chalk.bold.magenta('\n✦ Iridescent DevSecOps Remediation Engine ✦'));
      console.log(chalk.gray('  Generating production-ready security fixes...\n'));

      const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

      if (options.ai && !apiKey) {
        console.error(chalk.red('\n❌ Error: ANTHROPIC_API_KEY is required for AI security fixes.'));
        process.exit(1);
      }

      const agent = new DevOpsAgent({
        targetPath,
        useAI: options.ai,
        aiApiKey: apiKey,
        autoFix: true,
      });

      if (options.dryRun) {
        console.log(chalk.cyan('🔍 Running in dry-run mode...\n'));
        const report = await agent.reviewCode();
        const fixable = report.issues.filter(i => i.autoFixable || (options.ai && (i.severity === 'high' || i.severity === 'critical')));
        
        console.log(chalk.bold(`\n📊 Iridescent would attempt to remediate ${fixable.length} security issue(s):\n`));
        for (const issue of fixable) {
          console.log(`  - Line ${issue.line} in ${path.relative(targetPath, issue.file)}`);
          console.log(`    ${issue.message}`);
          console.log('');
        }
      } else {
        const result = await agent.applyFixes();
        
        console.log('\n' + chalk.bold.magenta('✦'.repeat(40)));
        console.log(chalk.bold.magenta('✅ Iridescent DevSecOps Fix Summary:'));
        console.log(`  Remediated: ${result.fixed} issue(s)`);
        console.log(`  Failed:     ${result.failed} issue(s)`);
        console.log(chalk.bold.magenta('✦'.repeat(40)) + '\n');

        if (result.fixed > 0) {
          console.log(chalk.blue('💡 Review the changes and run tests to verify everything works correctly.\n'));
        }
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error during Iridescent DevSecOps remediation:'), error);
      process.exit(1);
    }
  });

// Explain Command
program
  .command('explain')
  .description('Get deep AI explanation of a code file security logic')
  .argument('<file>', 'File to explain')
  .option('-k, --api-key <key>', 'Anthropic API key')
  .action(async (file: string, options) => {
    try {
      const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        console.error(chalk.red('\n❌ Error: ANTHROPIC_API_KEY is required for explanations.'));
        process.exit(1);
      }

      const agent = new DevOpsAgent({
        targetPath: '.',
        useAI: true,
        aiApiKey: apiKey,
      });

      console.log(chalk.bold.magenta(`\n🧠 Iridescent DevSecOps Brain analyzing ${file}...\n`));
      const explanation = await agent.explainCode(file);
      
      console.log(chalk.bold.cyan('📖 Security Analysis Explanation:\n'));
      console.log(explanation);
      console.log('');
    } catch (error) {
      console.error(chalk.red('\n❌ Error explaining code security with Iridescent:'), error);
      process.exit(1);
    }
  });

// Rules Command
program
  .command('rules')
  .description('List all available static analysis security patterns')
  .action(() => {
    const agent = new DevOpsAgent({ targetPath: '.' });
    const rules = (agent as any).analyzer.getRules();

    console.log(chalk.bold.magenta('\n📋 Iridescent DevSecOps Security Patterns:\n'));
    
    for (const rule of rules) {
      console.log(`  ${chalk.cyan(rule.id)}`);
      console.log(`    Name: ${rule.name}`);
      console.log(`    Category: ${rule.category}`);
      console.log(`    Severity: ${rule.severity}`);
      console.log('');
    }

    console.log(`Total: ${rules.length} security rules\n`);
    console.log(chalk.gray('💡 Use --ai flag with review/fix for deep Iridescent DevSecOps semantic analysis.\n'));
  });

// Doctor Command
program
  .command('doctor')
  .description('Check Iridescent DevSecOps environment and configuration')
  .action(async () => {
    console.log(chalk.bold.magenta('\n🩺 Iridescent DevSecOps Diagnostic:\n'));
    console.log(chalk.gray(`   Maintained by David Akpoviroro Oke (MrIridescent)\n`));

    // Check API Key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      console.log(`${chalk.green('✅')} ANTHROPIC_API_KEY: Configured (${apiKey.slice(0, 5)}...${apiKey.slice(-4)})`);
    } else {
      console.log(`${chalk.yellow('⚠️')}  ANTHROPIC_API_KEY: Missing (AI security features restricted)`);
    }

    // Check Node version
    console.log(`${chalk.green('✅')} Runtime: Node.js ${process.version}`);

    // Check if dist/ exists (meaning build has been run)
    try {
      await fs.access('./dist');
      console.log(`${chalk.green('✅')} Core Status: Compiled (dist/ exists)`);
    } catch {
      console.log(`${chalk.red('❌')} Core Status: Not compiled. Run 'npm run build'`);
    }

    // Check dependencies
    try {
      const pkg = JSON.parse(await fs.readFile('./package.json', 'utf-8'));
      console.log(`${chalk.green('✅')} Platform Name: ${pkg.name}`);
      console.log(`${chalk.green('✅')} Platform Version: ${pkg.version}`);
      console.log(`${chalk.green('✅')} Author: ${pkg.author}`);
    } catch {
      console.log(`${chalk.red('❌')} Platform configuration (package.json) invalid`);
    }

    console.log('\n' + chalk.cyan('🚀 Status: DevSecOps Platform Ready for Operation') + '\n');
  });

program.parse();
