---
description: Run the full local check gate (typecheck, then build)
allowed-tools: Bash(npm run lint), Bash(npm run build)
---

Run the project's check gate and report results concisely.

1. `npm run lint` (this is `tsc --noEmit`). If it fails, show the errors and stop —
   do not run the build.
2. If lint passes, run `npm run build` and confirm both the Vite client build and
   the esbuild server bundle succeed.

Report: pass/fail for each step, and the first few errors verbatim if anything fails.
Do not attempt fixes unless I ask.
