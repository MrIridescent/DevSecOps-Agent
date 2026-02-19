import { AnalyzerRule, CodeIssue } from './types.js';
import { securityRules } from './rules/security.js';
import { qualityRules } from './rules/quality.js';
import { practiceRules } from './rules/practices.js';

export class CodeAnalyzer {
  private rules: AnalyzerRule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules = [
      ...securityRules,
      ...qualityRules,
      ...practiceRules,
    ];
  }

  analyzeFile(content: string, filePath: string): CodeIssue[] {
    const allIssues: CodeIssue[] = [];
    
    for (const rule of this.rules) {
      try {
        const issues = rule.check(content, filePath);
        // Attach ruleId to each issue for tracking
        issues.forEach(issue => {
          issue.ruleId = rule.id;
        });
        allIssues.push(...issues);
      } catch (error) {
        console.error(`Error running rule ${rule.id} on ${filePath}:`, error);
      }
    }

    // Sort by severity and line number
    return allIssues.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      return severityDiff !== 0 ? severityDiff : a.line - b.line;
    });
  }

  getRules(): AnalyzerRule[] {
    return this.rules;
  }
}
