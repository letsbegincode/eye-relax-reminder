# Contributing to Eye Relax Reminder

Thank you for your interest in contributing! Here's how you can help make this project better.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/letsbegincode/eye-relax-reminder.git
   cd eye-relax-reminder
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Run** in development mode:
   ```bash
   npm start
   ```

## How to Contribute

### Reporting Bugs
- Open a [GitHub Issue](https://github.com/letsbegincode/eye-relax-reminder/issues)
- Include your OS, Electron version, and steps to reproduce
- Screenshots or screen recordings are very helpful

### Suggesting Features
- Open an issue with the **enhancement** label
- Describe the feature and why it would be useful

### Submitting Code
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test locally with `npm start`
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push and open a Pull Request

## Code Guidelines

- Use `const`/`let` — no `var`
- Add JSDoc comments for functions
- Keep the main process (`index.js`) and renderer code (HTML files) separated
- Use IPC for all main↔renderer communication
- Test on Windows at minimum (macOS/Linux welcome)

## Custom Videos

If you want to contribute new reminder videos:
- Format: **WebM with VP9 alpha** (transparent background)
- Resolution: 1080p preferred
- Duration: 5–15 seconds
- Content: Relaxing, family-friendly animations

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix   | Use for                        |
|----------|--------------------------------|
| `feat:`  | New features                   |
| `fix:`   | Bug fixes                      |
| `docs:`  | Documentation changes          |
| `style:` | Code formatting (no logic)     |
| `refactor:` | Code refactoring            |
| `chore:` | Build/tooling changes          |

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
