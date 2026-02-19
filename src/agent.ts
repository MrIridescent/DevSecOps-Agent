import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import { CodeAnalyzer } from './analyzer.js';
import { AIAnalyzer } from './ai-analyzer.js';
import { AgentConfig, CodeIssue, ReviewReport, FullReviewReport, AIReviewInsights } from './types.js';
import chalk from 'chalk';
import ora from 'ora';

export class DevOpsAgent {
  private analyzer: CodeAnalyzer;
  private aiAnalyzer?: AIAnalyzer;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = {
      filePatterns: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
      excludePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.min.js'],
      autoFix: false,
      aiMode: 'hybrid',
      outputFormat: 'console',
      ...config,
    };
    this.analyzer = new CodeAnalyzer();
    if (this.config.useAI && this.config.aiApiKey) {
      this.aiAnalyzer = new AIAnalyzer(this.config.aiApiKey);
    }
  }

  async reviewCode(): Promise<FullReviewReport> {
    const spinner = ora('Initializing code review...').start();
    
    try {
      const files = await this.findFiles();
      spinner.text = `Found ${files.length} files. Analyzing...`;

      let allIssues: CodeIssue[] = [];
      const aiInsights: AIReviewInsights = {
        fileInsights: [],
      };

      const mode = this.config.aiMode || 'hybrid';

      // 1. Static Analysis
      if (mode === 'fast' || mode === 'hybrid' || !this.aiAnalyzer) {
        spinner.text = 'Running static analysis...';
        const staticIssues = await this.runStaticAnalysis(files);
        allIssues = [...staticIssues];
      }

      // 2. AI Analysis
      if (this.aiAnalyzer && (mode === 'thorough' || mode === 'hybrid')) {
        spinner.text = 'Running AI analysis (this may take a while)...';
        const aiIssues = await this.runAIAnalysis(files, aiInsights);
        allIssues = this.mergeIssues(allIssues, aiIssues);
      }

      // 3. Architectural Review
      if (this.config.architectureReview && this.aiAnalyzer && files.length > 0) {
        spinner.text = 'Running architectural review...';
        aiInsights.architecturalReview = await this.runArchitectureReview(files.slice(0, 10));
      }

      spinner.succeed(`Review complete! Found ${allIssues.length} issues across ${files.length} files.`);

      const report = this.generateReport(allIssues, files.length);
      return {
        ...report,
        aiInsights: aiInsights.architecturalReview || aiInsights.fileInsights!.length > 0 ? aiInsights : undefined,
      };
    } catch (error: any) {
      spinner.fail(`Review failed: ${error.message}`);
      throw error;
    }
  }

  async applyFixes(): Promise<{ fixed: number; failed: number }> {
    if (this.config.useAI && this.aiAnalyzer) {
      return this.applyAIFixes();
    }
    return this.applyStaticFixes();
  }

  private async applyStaticFixes(): Promise<{ fixed: number; failed: number }> {
    const spinner = ora('Applying static pattern-based fixes...').start();
    const files = await this.findFiles();
    let fixed = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const issues = this.analyzer.analyzeFile(content, file);
        const fixableIssues = issues.filter(issue => issue.autoFixable);

        if (fixableIssues.length > 0) {
          const fixedContent = await this.applyStaticFixesToFile(content, fixableIssues);
          await fs.writeFile(file, fixedContent, 'utf-8');
          fixed += fixableIssues.length;
        }
      } catch (error) {
        failed++;
      }
    }

    spinner.succeed(`Applied ${fixed} static fixes.`);
    return { fixed, failed };
  }

  private async applyAIFixes(): Promise<{ fixed: number; failed: number }> {
    const spinner = ora('Applying AI-powered fixes...').start();
    const files = await this.findFiles();
    let fixed = 0;
    let failed = 0;

    for (const file of files) {
      try {
        let content = await fs.readFile(file, 'utf-8');
        const result = await this.aiAnalyzer!.analyzeCode(content, file);
        const fixableIssues = result.issues.filter(issue => 
          issue.severity === 'high' || issue.severity === 'critical'
        );

        if (fixableIssues.length === 0) continue;

        for (const issue of fixableIssues) {
          try {
            const fix = await this.aiAnalyzer!.generateFix(content, issue);
            if (fix.confidence > 70) {
              await fs.writeFile(file, fix.fixedCode, 'utf-8');
              content = fix.fixedCode;
              fixed++;
            } else {
              failed++;
            }
          } catch (error) {
            failed++;
          }
        }
      } catch (error) {
        failed++;
      }
    }

    spinner.succeed(`Applied ${fixed} AI fixes.`);
    return { fixed, failed };
  }

  async explainCode(filePath: string): Promise<string> {
    if (!this.aiAnalyzer) {
      throw new Error('AI explanation requires an API key.');
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return await this.aiAnalyzer.explainCode(content, filePath);
  }

  private async runStaticAnalysis(files: string[]): Promise<CodeIssue[]> {
    const allIssues: CodeIssue[] = [];
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const issues = this.analyzer.analyzeFile(content, file);
        allIssues.push(...issues);
      } catch (error) {
        console.error(chalk.red(`  ❌ Error analyzing ${file}:`), error);
      }
    }
    return allIssues;
  }

  private async runAIAnalysis(files: string[], insights: AIReviewInsights): Promise<CodeIssue[]> {
    const allIssues: CodeIssue[] = [];
    const maxFilesForAI = 20;
    const filesToAnalyze = files.slice(0, maxFilesForAI);

    for (const file of filesToAnalyze) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        if (content.length > 50000) continue;

        const result = await this.aiAnalyzer!.analyzeCode(content, file);
        allIssues.push(...result.issues);

        if (result.architecturalInsights && result.architecturalInsights.length > 0) {
          insights.fileInsights!.push({
            file,
            insights: result.architecturalInsights,
          });
        }
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(chalk.red(`  ❌ AI analysis error for ${file}:`), error);
      }
    }
    return allIssues;
  }

  private async runArchitectureReview(files: Array<{ path: string; content: string } | string>): Promise<any> {
    const fileContents = await Promise.all(
      files.map(async f => {
        const filePath = typeof f === 'string' ? f : f.path;
        return {
          path: filePath,
          content: await fs.readFile(filePath, 'utf-8'),
        };
      })
    );
    return await this.aiAnalyzer!.reviewArchitecture(fileContents);
  }

  private mergeIssues(staticIssues: CodeIssue[], aiIssues: CodeIssue[]): CodeIssue[] {
    const merged = [...staticIssues];
    const seen = new Set(staticIssues.map(i => `${i.file}:${i.line}:${i.message}`));

    for (const issue of aiIssues) {
      const key = `${issue.file}:${issue.line}:${issue.message}`;
      if (!seen.has(key)) {
        merged.push(issue);
        seen.add(key);
      }
    }

    return merged.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      return severityDiff !== 0 ? severityDiff : a.line - b.line;
    });
  }

  private async findFiles(): Promise<string[]> {
    const patterns = this.config.filePatterns!.map(pattern => 
      path.join(this.config.targetPath, pattern)
    );
    const allFiles: string[] = [];
    for (const pattern of patterns) {
      const files = await glob(pattern, {
        ignore: this.config.excludePatterns,
        nodir: true,
        absolute: true,
      });
      allFiles.push(...files);
    }
    return [...new Set(allFiles)];
  }

  private generateReport(issues: CodeIssue[], filesAnalyzed: number): ReviewReport {
    const summary = {
      totalIssues: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      autoFixable: issues.filter(i => i.autoFixable).length,
    };
    return {
      summary,
      issues,
      filesAnalyzed,
      timestamp: new Date().toISOString(),
    };
  }

  private async applyStaticFixesToFile(content: string, issues: CodeIssue[]): Promise<string> {
    let lines = content.split('\n');
    const sortedIssues = [...issues].sort((a, b) => b.line - a.line);

    for (const issue of sortedIssues) {
      const lineIndex = issue.line - 1;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        if (issue.ruleId === 'no-console-log' || issue.ruleId === 'no-debugger') {
          lines.splice(lineIndex, 1);
        } else if (issue.ruleId === 'no-var') {
          lines[lineIndex] = line.replace(/\bvar\b/, 'const');
        }
      }
    }
    return lines.join('\n');
  }

  printReport(report: FullReviewReport): void {
    console.log('\n' + chalk.bold.magenta('✦'.repeat(80)));
    console.log(chalk.bold.magenta('📊 IRIDESCENT DEVSECOPS SECURITY REPORT'));
    console.log(chalk.gray('   Engineered by David Akpoviroro Oke (MrIridescent)'));
    console.log(chalk.bold.magenta('✦'.repeat(80)) + '\n');

    console.log(chalk.bold('Platform Summary:'));
    console.log(`  Total Issues: ${report.summary.totalIssues}`);
    console.log(`  ${chalk.red('🔴 Critical Vulnerabilities:')} ${report.summary.critical}`);
    console.log(`  ${chalk.redBright('🟠 High Risk:')} ${report.summary.high}`);
    console.log(`  ${chalk.yellow('🟡 Medium Risk:')} ${report.summary.medium}`);
    console.log(`  ${chalk.green('🟢 Low Risk:')} ${report.summary.low}`);
    console.log(`  ${chalk.blue('🔧 Auto-remediable:')} ${report.summary.autoFixable}`);
    console.log(`  📁 Files Scanned: ${report.filesAnalyzed}\n`);

    if (report.aiInsights?.architecturalReview) {
      const arch = report.aiInsights.architecturalReview;
      console.log(chalk.bold('🏗️  Iridescent DevSecOps Architecture Review:'));
      console.log(`   Security Quality Score: ${arch.overallQuality}/100\n`);
      
      if (arch.securityConcerns?.length > 0) {
        console.log(chalk.red('   🔒 Critical Security Concerns:'));
        arch.securityConcerns.forEach((c: string) => console.log(`      - ${c}`));
        console.log('');
      }

      if (arch.recommendations?.length > 0) {
        console.log(chalk.blue('   💡 Remediation Recommendations:'));
        arch.recommendations.slice(0, 5).forEach((r: string) => console.log(`      - ${r}`));
        console.log('');
      }
    }

    if (report.issues.length === 0) {
      console.log(chalk.green('✨ No vulnerabilities found! Your code matches Iridescent DevSecOps standards!\n'));
      return;
    }

    const issuesByFile = new Map<string, CodeIssue[]>();
    for (const issue of report.issues) {
      const relativePath = path.relative(this.config.targetPath, issue.file);
      if (!issuesByFile.has(relativePath)) {
        issuesByFile.set(relativePath, []);
      }
      issuesByFile.get(relativePath)!.push(issue);
    }

    console.log(chalk.bold('Vulnerability Map:\n'));
    for (const [file, issues] of issuesByFile) {
      console.log(chalk.underline(`📄 ${file}`));
      for (const issue of issues.slice(0, 15)) {
        const severityColor = this.getSeverityColor(issue.severity);
        console.log(`  ${severityColor('●')} Line ${issue.line}: ${chalk.bold(`[${issue.category}]`)} ${issue.message}`);
        if (issue.suggestedFix) {
          console.log(`     ${chalk.gray('💡 Remediation:')} ${chalk.italic(issue.suggestedFix)}`);
        }
        console.log('');
      }
      if (issues.length > 15) {
        console.log(chalk.gray(`  ... and ${issues.length - 15} more vulnerabilities\n`));
      }
    }

    console.log(chalk.bold.magenta('✦'.repeat(80)));
    console.log(`Generated at: ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`Iridescent DevSecOps Platform v2.2 | MrIridescent`);
    console.log(chalk.bold.magenta('✦'.repeat(80)) + '\n');
  }

  private getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical': return chalk.red;
      case 'high': return chalk.redBright;
      case 'medium': return chalk.yellow;
      case 'low': return chalk.green;
      default: return chalk.white;
    }
  }

  async exportReport(report: FullReviewReport, format: 'json' | 'markdown'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }

    let md = '# Iridescent DevSecOps Security Report\n';
    md += `*Engineered by David Akpoviroro Oke (MrIridescent)*\n\n`;
    md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
    md += '## 📊 Platform Security Summary\n\n';
    md += `- **Total Vulnerabilities:** ${report.summary.totalIssues}\n`;
    md += `- **Critical:** ${report.summary.critical}\n`;
    md += `- **High:** ${report.summary.high}\n`;
    md += `- **Medium:** ${report.summary.medium}\n`;
    md += `- **Low:** ${report.summary.low}\n`;
    md += `- **Auto-remediable:** ${report.summary.autoFixable}\n`;
    md += `- **Files Scanned:** ${report.filesAnalyzed}\n\n`;

    if (report.aiInsights?.architecturalReview) {
      const arch = report.aiInsights.architecturalReview;
      md += '## 🏗️ Architectural Security Review\n\n';
      md += `**Security Quality Score:** ${arch.overallQuality}/100\n\n`;
      if (arch.securityConcerns?.length > 0) {
        md += '### 🔒 Security Concerns\n';
        arch.securityConcerns.forEach((c: string) => md += `- ${c}\n`);
        md += '\n';
      }
      if (arch.recommendations?.length > 0) {
        md += '### 💡 Remediation Recommendations\n';
        arch.recommendations.forEach((r: string) => md += `- ${r}\n`);
        md += '\n';
      }
    }

    if (report.issues.length > 0) {
      md += '## 📄 Vulnerability Details\n\n';
      const issuesByFile = new Map<string, CodeIssue[]>();
      for (const issue of report.issues) {
        const relativePath = path.relative(this.config.targetPath, issue.file);
        if (!issuesByFile.has(relativePath)) {
          issuesByFile.set(relativePath, []);
        }
        issuesByFile.get(relativePath)!.push(issue);
      }

      for (const [file, issues] of issuesByFile) {
        md += `### ${file}\n\n`;
        for (const issue of issues) {
          md += `- **Line ${issue.line}** [${issue.severity.toUpperCase()}] [${issue.category}]\n`;
          md += `  - ${issue.message}\n`;
          if (issue.suggestedFix) md += `  - **Fix:** ${issue.suggestedFix}\n`;
          md += '\n';
        }
      }
    }
    return md;
  }
}
