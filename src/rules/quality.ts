import { AnalyzerRule, CodeIssue } from '../types.js';

export const qualityRules: AnalyzerRule[] = [
  {
    id: 'no-console-log',
    name: 'Remove console.log statements',
    category: 'Code Quality',
    severity: 'low',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/console\.log\s*\(/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'warning',
            severity: 'low',
            category: 'Code Quality',
            message: 'console.log should be removed in production code',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Remove or replace with proper logging framework',
            autoFixable: true,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'no-todo-comments',
    name: 'Unresolved TODO comments',
    category: 'Code Quality',
    severity: 'low',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/\/\/\s*TODO/i.test(line) || /\/\*\s*TODO/i.test(line)) {
          issues.push({
            type: 'info',
            severity: 'low',
            category: 'Code Quality',
            message: 'Unresolved TODO comment found',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Address the TODO or create a tracking issue',
            autoFixable: false,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'no-debugger',
    name: 'Remove debugger statements',
    category: 'Code Quality',
    severity: 'high',
    check: (content: string, filePath: string) => {
      const issues: CodeIssue[] = [];
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/\bdebugger\b/.test(line) && !line.trim().startsWith('//')) {
          issues.push({
            type: 'error',
            severity: 'high',
            category: 'Code Quality',
            message: 'debugger statement should be removed',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            suggestedFix: 'Remove the debugger statement',
            autoFixable: true,
          });
        }
      });
      return issues;
    },
  },
];
