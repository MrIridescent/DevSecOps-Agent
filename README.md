# Iridescent DevSecOps Platform v2.2
## Unified AI Orchestrator & Turnkey DevSecOps System

<p>
  <img src="https://img.shields.io/badge/Creator-David%20Akpoviroro%20Oke-9C27B0?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Brand-MrIridescent-FFD700?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-547696?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Anthropic%20Claude-C7B35D?style=flat-square&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Tests-Vitest-6E9073?style=flat-square&logo=vitest&logoColor=white" />
</p>

**Iridescent DevSecOps Platform** is a production-ready, AI-powered system designed for deep code analysis, automated vulnerability remediation, and architectural security optimization. Engineered by **David Akpoviroro Oke (MrIridescent)**, this framework merges the precision of static analysis with the creative reasoning of **Claude Sonnet 3.7/4.5** to deliver a "Turnkey" experience for developers and security teams.

---

## 🌟 Vision & Branding
Developed by **MrIridescent (The Creative Renaissance Man)**, this project embodies the philosophy of *Functional Perfection*. It is not just a tool, but a sophisticated security orchestrator that transforms messy codebases into streamlined, secure, and high-performance systems.

---

## 🚀 Key Features

- **Unified Intelligence**: A single, hardened agent orchestrating both pattern-based and AI-driven semantic security analysis.
- **Deep Security Review**: Detects and fixes SQL Injection, XSS, CSRF, insecure cryptography, and complex authorization flaws.
- **Automated Repair Engine**: AI generates context-aware, production-ready fixes with confidence scoring and sequential application.
- **Architectural Insights**: Evaluates system design, SOLID principles, and security posture across the entire repository.
- **Turnkey Setup**: Interactive setup wizard and diagnostic suite for instant deployment.
- **Resilient Core**: Built-in JSON state-machine repair and intelligent file chunking for massive file analysis.

---

## 🛠️ Turnkey Installation

Getting started is as simple as:

```bash
git clone https://github.com/MrIridescent/DevSecOps-Agent.git
cd iridescent-devsecops-agent
npm run setup
```

The **Setup Wizard** will automatically configure your environment, check for dependencies, and verify your API credentials.

---

## ⚙️ Configuration

Configure your environment via the interactive wizard or manually in `.env`:

```bash
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

---

## 📖 Operational Commands

### System Health
```bash
iridescent-sec-agent doctor
```

### Intelligent Analysis
```bash
# hybrid mode: static + deep AI security review
iridescent-sec-agent review ./src --ai

# Architectural mode: system-wide design and security review
iridescent-sec-agent review ./src --ai --mode thorough --architecture
```

### Automated Remediation
```bash
# Preview AI-generated security fixes
iridescent-sec-agent fix ./src --ai --dry-run

# Apply production-ready security fixes
iridescent-sec-agent fix ./src --ai
```

---

## 📂 Documentation Suite

- **[Technical Specification](./docs/TECHNICAL_SPEC.md)**: Deep dive into the architecture and security logic.
- **[User Manual](./docs/USER_MANUAL.md)**: Step-by-step technical guide for all skill levels.
- **[Research & Citations](./docs/RESEARCH_REF.md)**: Scientific references, OWASP mapping, and operational research.
- **[Use Cases](./docs/USE_CASES.md)**: Real-world scenarios and fictional abstract events.
- **[Environment Setup](./docs/ENVIRONMENT.md)**: Recommended hardware and server specifications.
- **[Visual Infographic](./docs/INFOGRAPHIC.html)**: Nuanced architectural map.

---

## 🛡️ Security & Reliability

The Iridescent DevSecOps Platform maps its detection capabilities to industry standards:

- **OWASP Top 10 Mapping**: Full coverage for A01:2021 through A10:2021.
- **CWE Integration**: Automated identification of Common Weakness Enumeration patterns.
- **Confidence Scoring**: Each AI-generated fix includes a reliability assessment.
- **State-Machine Logic**: The remediation engine ensures consistent state across multiple file edits.

---

## 💎 Creator Attribution
**Creator**: David Akpoviroro Oke  
**Pseudonym**: MrIridescent (The Creative Renaissance Man)  
**Heritage**: Built on the foundations of digital craftsmanship since August 2004.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
