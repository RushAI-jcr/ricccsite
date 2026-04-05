---
status: complete
priority: p3
issue_id: "031"
tags: [code-review, performance, fonts]
dependencies: []
---

# 031: Geist Sans font files bundled but unused

## Problem Statement

The `geist` npm package bundles both Geist Sans and Geist Mono. Only `GeistMono.variable` is used. Geist Sans woff2 files (~200KB) may be included in the build output unnecessarily.

## Findings

- **Performance Oracle**: Verify by inspecting `.next/static/media/` after build.

## Proposed Solutions

Check if tree-shaking excludes Geist Sans files. If not, consider importing only the mono variant or using a lighter font package.

- **Effort**: Small (investigation)
- **Risk**: None
