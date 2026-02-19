# Iridescent DevSecOps Platform: Environment & Hardware Configuration
## Recommended Specifications for Deployment & Operation

**Author**: David Akpoviroro Oke (MrIridescent)
**Date**: February 19, 2026

---

## 1. Optimal Environment
The Iridescent DevSecOps Platform is designed for **Node.js v18.0.0+**. While it can run in containerized environments (Docker), it is most performant when it has direct access to the filesystem for rapid security scanning.

### 1.1 Operating Systems
- **Linux (Recommended)**: Ubuntu 22.04 LTS, Debian 11/12, or Kali Linux.
- **macOS**: Ventura or Sonoma (Apple Silicon optimized).
- **Windows**: WSL2 (Windows Subsystem for Linux) is required for full CLI functionality.

## 2. Hardware Specifications

### 2.1 Minimum Requirements (Personal Use / Small Projects)
- **CPU**: Dual-core 2.0GHz+.
- **RAM**: 4GB DDR4.
- **Disk**: 1GB available space (beyond project size).
- **Network**: Stable internet connection for Anthropic API calls.

### 2.2 Recommended (Professional / Enterprise Use)
- **CPU**: 8-core 3.0GHz+ (for fast TypeScript compilation and parallel file scanning).
- **RAM**: 16GB+ (to handle large project graphs in memory).
- **Disk**: NVMe SSD (significantly improves I/O performance during file chunking).
- **Network**: Low-latency fiber connection (minimizes AI inference delay).

## 3. Server-Side / CI/CD Specs
If deploying as a centralized service or inside a CI/CD runner:
- **GitHub Actions**: `ubuntu-latest` (Standard runners are sufficient).
- **Self-Hosted Runner**: 4 vCPUs, 8GB RAM minimum.
- **Docker**: `node:18-alpine` or `node:20-slim` images are recommended for minimal footprint.

## 4. Setup Recommendations

### 4.1 "Turnkey" Deployment
1. **API Key Management**: Use a secret manager (AWS Secrets Manager, GitHub Secrets) rather than hardcoding.
2. **Rate Limiting**: Ensure your Anthropic API tier supports at least **100 RPM** (Requests Per Minute) for large codebase analysis.
3. **Storage**: Mount the project directory as a volume if running inside Docker for persistent analysis reports.

### 4.2 Security Hardening
- **Network**: Restrict outbound traffic only to `api.anthropic.com`.
- **Filesystem**: Run the agent with a dedicated, non-privileged user that has read-only access to the source code (except for `fix` mode).

---
**Branding**: David Akpoviroro Oke (MrIridescent)
