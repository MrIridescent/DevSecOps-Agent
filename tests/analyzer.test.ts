import { describe, it, expect } from 'vitest';
import { CodeAnalyzer } from '../src/analyzer.js';

describe('CodeAnalyzer', () => {
  const analyzer = new CodeAnalyzer();

  it('should detect eval() usage', () => {
    const code = 'const x = eval("1 + 1");';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-eval')).toBe(true);
  });

  it('should detect console.log usage', () => {
    const code = 'console.log("hello");';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-console-log')).toBe(true);
  });

  it('should detect var usage', () => {
    const code = 'var x = 1;';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-var')).toBe(true);
  });

  it('should detect any type in TypeScript', () => {
    const code = 'const x: any = 1;';
    const issues = analyzer.analyzeFile(code, 'test.ts');
    expect(issues.some(i => i.ruleId === 'no-any-type')).toBe(true);
  });

  it('should detect empty catch blocks', () => {
    const code = 'try { } catch (e) { }';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-empty-catch')).toBe(true);
  });

  it('should detect hardcoded credentials', () => {
    const code = 'const apiKey = "sk-12345";';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-hardcoded-credentials')).toBe(true);
  });

  it('should detect debugger statements', () => {
    const code = 'debugger;';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'no-debugger')).toBe(true);
  });

  it('should detect insecure random usage', () => {
    const code = 'const r = Math.random();';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'insecure-random')).toBe(true);
  });

  it('should detect hardcoded IP addresses', () => {
    const code = 'const server = "192.168.1.100";';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'hardcoded-ip')).toBe(true);
  });

  it('should detect potential XSS', () => {
    const code = 'element.innerHTML = "<div>" + userInput + "</div>";';
    const issues = analyzer.analyzeFile(code, 'test.js');
    expect(issues.some(i => i.ruleId === 'potential-xss')).toBe(true);
  });
});
