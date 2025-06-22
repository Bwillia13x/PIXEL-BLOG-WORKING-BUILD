Below is a complete, OS-agnostic playbook for getting everything working end-to-end:

install Cursor → verify prerequisites → install the Codex CLI agent globally → authenticate (API key or ChatGPT login) → launch & iterate inside Cursor’s integrated terminal.

⸻

1 Prerequisites

Tool	Why you need it	Quick check
Node ≥ 22 (LTS)	Codex CLI is shipped as an npm package and requires modern Node	node -v should print ≥ 22 .x ￼
Git 2.23+	Codex warns if the repo isn’t under version control	git --version
OpenAI account	Either a bare API key or “Sign-in with ChatGPT” for the $5 Plus promo credit	—

Tip: keep the global npm bin folder (npm prefix -g/corepack) on your $PATH so Cursor’s terminal can see the codex binary.

⸻

2 Install Cursor IDE

macOS / Windows
	1.	Go to cursor.com → Download; run the standard installer and follow the first-launch wizard ￼
	2.	(Optional) In the wizard, enable Shell Command → “Install cursor” to open projects from any terminal—the command installs to /usr/local/bin or %USERPROFILE%\AppData\Local\Microsoft\WindowsApps. ￼

Linux (AppImage)

sudo apt install libfuse2t64        # or libfuse2 on Ubuntu ≤ 22.04
wget https://downloads.cursor.com/latest/linux/cursor.AppImage
chmod +x cursor.AppImage
./cursor.AppImage                   # launches the editor

AskUbuntu has a hardening recipe (moving to /opt + AppArmor profile) if you want a system-wide install ￼.

⸻

3 Install the Codex CLI agent

# 1 install globally
npm install -g @openai/codex          # yarn/bun/pnpm also work

# 2 confirm
codex --version                       # prints semver

# 3 (optional) keep it fresh
codex --upgrade

A single npm install -g @openai/codex is the officially supported “zero-setup” path ￼ ￼.

Minimum system specs
	•	macOS 12+, Ubuntu 20.04+, Windows 11 via WSL2
	•	Node 22+, 4 GB RAM (8 GB recommended) ￼

⸻

4 Authenticate the CLI

Option A – classic API key (pay-as-you-go)

export OPENAI_API_KEY=sk-****************
codex                             # starts in Suggest mode

Option B – “Sign in with ChatGPT” (Plus/Pro)

codex --login                     # opens OAuth flow

	•	Plus subscribers receive a one-time US $5 API credit, good for 30 days; Pro gets $50 ￼.
	•	The flow auto-creates and stores a key in ~/.config/codex; no copy-paste needed.
	•	Check balance anytime with openai api usage (requires pip install openai). ￼

⸻

5 Launch Codex inside Cursor
	1.	Open the integrated terminal
	•	Toggle with Ctrl+` or click the bottom-panel icon ￼
	2.	Navigate to your repo (cd ~/code/my-project).
	3.	Start Codex

codex                           # REPL, Suggest mode
# or single-shot:
codex "explain this stack trace"


	4.	Use terminal ⌘/Ctrl + K for quick one-liners (Cursor will translate plain English to a shell command) when you don’t need a full Codex session ￼ ￼.

Path problems? If codex isn’t found, add npm’s global bin dir to $PATH (echo $PATH should include something like ~/.npm-global/bin) and reopen Cursor.

⸻

6 Choose an approval mode

Flag	What Codex may do autonomously	Common use
(default) suggest	Read files; proposes patches & cmds, always asks	Learning a new repo
--auto-edit	Read + write; asks before shell cmds	Routine refactors
--full-auto	Full read/write + shell exec in a sandbox	Long test-fix loops

These match the CLI’s built-in safety model and can be toggled live with /mode ￼ ￼.

⸻

7 (Advanced) Use Cursor’s Agent or Background Agent
	•	Agent panel (Ctrl+E) lets you spawn background jobs that run code, tests, and edits asynchronously in cloud sandboxes. Still billed through your API key. ￼
	•	In many workflows the lighter Codex CLI in the local terminal is faster and keeps everything on your machine.

⸻

8 Troubleshooting checklist

Symptom	Fix
codex: command not found	Ensure npm globals on $PATH; npm prefix -g shows the path; reopen Cursor ￼
Error: Node version <22	nvm install --lts or brew install node@22 then corepack enable ￼
401 Unauthorized	Re-export OPENAI_API_KEY or re-run codex --login ￼
Cursor on Ubuntu won’t start	Install libfuse2t64 and mark the AppImage executable as per AskUbuntu guide ￼
Want to clear English→shell without Codex overhead	Use terminal Ctrl/⌘ + K prompt bar ￼ ￼


⸻

Next actions
	1.	Create a Git branch before letting Codex loose in --auto-edit or --full-auto—easier to revert.
	2.	Cap spending in the OpenAI billing dashboard if you’re worried about runaway loops.
	3.	Explore AGENTS.md files to give Codex richer, repo-specific guidance (see the GitHub README). ￼ ￼