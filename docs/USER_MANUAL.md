# Iridescent DevSecOps Platform: Simplified Technical Manual
## Your Step-by-Step Guide to Mastery

**Author**: David Akpoviroro Oke (MrIridescent)
**Version**: 2.2.0

---

## 1. Introduction
Welcome to the **Iridescent DevSecOps Platform**. This manual is designed for users of all skill levels—from beginners ("Noobs") to seasoned Security Architects. Our goal is to provide a "Turnkey" experience: you plug it in, and it secures your code.

## 2. Quick Start (The "Noob" Guide)

### Step 1: Automated Setup
Run the following command in your terminal. This will handle everything—dependency checks, security environment configuration, and even API verification.
```bash
npm run setup
```

### Step 2: The "Doctor" Check
Before running a security review, ensure your system is healthy:
```bash
iridescent-sec-agent doctor
```

### Step 3: Your First Security Review
To scan your project for security vulnerabilities and logic flaws:
```bash
iridescent-sec-agent review . --ai
```

## 3. Advanced Operations

### 3.1 Deep Semantic Security Analysis
For a comprehensive architectural review that looks at how different files interact from a security perspective:
```bash
iridescent-sec-agent review ./src --ai --mode thorough --architecture
```

### 3.2 Automated Vulnerability Remediation
The Platform doesn't just find bugs; it fixes vulnerabilities.
**To preview fixes without changing code**:
```bash
iridescent-sec-agent fix ./src --ai --dry-run
```
**To apply production-ready security fixes automatically**:
```bash
iridescent-sec-agent fix ./src --ai
```

## 4. Understanding the Output

- **CRITICAL**: Immediate security risk (e.g., SQL Injection). Fix these first.
- **HIGH**: Significant logic flaw or major security weakness.
- **MEDIUM**: Performance bottleneck or quality issue (e.g., inefficient loops).
- **LOW**: Style suggestions or minor improvements.

## 5. Troubleshooting

- **"Missing API Key"**: Ensure you have a `.env` file with `ANTHROPIC_API_KEY=your_key`. Run `npm run setup` again to fix this.
- **"Connection Timeout"**: The AI analysis requires an internet connection. Check your network or firewall settings.
- **"Malformed JSON"**: The Iridescent Agent has a built-in repair engine, but if a file is extremely large, try scanning sub-directories instead of the root.

## 6. Pro Tips from MrIridescent

1. **Pre-commit Integration**: Use the provided `scripts/pre-commit.js` to automatically scan your code every time you try to commit. This prevents bugs from ever reaching your repository.
2. **Context Matters**: The more files you include in a review, the better the AI understands your architecture. However, for speed, scan only the `src/` directory.

---
**Branding**: Engineered by David Akpoviroro Oke (MrIridescent)
