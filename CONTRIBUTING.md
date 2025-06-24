# Contributing to Line Shuffler

We love your input! We want to make contributing to Line Shuffler as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** on multiple platforms if possible
4. **Update documentation** if you've added functionality
5. **Ensure your code** follows the existing style
6. **Submit your pull request**

## Coding Standards

### JavaScript
- Use ES6+ features when appropriate
- Follow existing naming conventions:
  - `camelCase` for variables and functions
  - `PascalCase` for classes
  - `UPPER_CASE` for constants
- Add comments for complex logic
- Keep functions small and focused

### CSS
- Use BEM methodology for class naming
- Follow the existing color scheme and variables
- Maintain responsive design principles
- Use modern CSS features (Grid, Flexbox, Custom Properties)

### HTML
- Use semantic HTML5 elements
- Maintain accessibility standards
- Keep structure clean and organized

## Bug Reports

Great bug reports tend to have:

- **Clear summary** of the issue
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Environment details** (OS, Electron version, etc.)
- **Screenshots** if relevant

**Example Bug Report:**

```
**Summary:** Copy button doesn't work with large text

**Steps to reproduce:**
1. Paste text with 1000+ lines
2. Click shuffle
3. Click copy button

**Expected:** Text copied to clipboard
**Actual:** Nothing happens, no error message

**Environment:**
- OS: Windows 11
- Line Shuffler: v1.0
- Electron: 28.0.0
```

## Feature Requests

We welcome feature requests! Please provide:

- **Clear description** of the feature
- **Use case** and motivation
- **Examples** of how it would work
- **Mockups** if it involves UI changes

## Development Setup

### Prerequisites
- Node.js v16+
- npm v8+
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/line-shuffler.git
cd line-shuffler

# Install dependencies
npm install

# Start development mode
npm start

# Run tests (when available)
npm test

# Build for testing
npm run build:dev
```

### File Structure
```
line-shuffler/
├── src/
│   ├── main.js              # Electron main process
│   └── renderer/           # Renderer process
│       ├── index.html      # Main UI
│       ├── style.css       # Styling
│       └── script.js       # Application logic
├── assets/
│   ├── logo.png            # Project logo
│   ├── icon.png            # Application icon
│   ├── icon.ico            # Windows icon
│   └── icon.icns           # macOS icon
├── README.md               # Project documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT License
├── .gitignore             # Git ignore rules
└── package.json           # Project configuration
```

## Testing

While we don't have automated tests yet, please manually test:

### Core Features
- [ ] Text input and line counting
- [ ] Basic shuffling functionality
- [ ] Fixed position lines
- [ ] File upload/download
- [ ] Clipboard operations
- [ ] Undo/redo functionality

### UI/UX
- [ ] Responsive design on different screen sizes
- [ ] Dark theme consistency
- [ ] Button states and animations
- [ ] Toast notifications
- [ ] Keyboard shortcuts

### Cross-Platform
- [ ] Windows compatibility
- [ ] macOS compatibility (if available)
- [ ] Linux compatibility (if available)

## Code Review Process

1. **Automated checks** will run on your PR
2. **Maintainer review** for code quality and design
3. **Testing** on multiple platforms when possible
4. **Merge** after approval

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to be maintainers for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Community

### Be Respectful
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Get Help
- Check existing issues and discussions
- Ask questions in new issues
- Join community discussions

## Quick Contribution Ideas

### Easy (Good First Issues)
- Fix typos in documentation
- Add tooltips to buttons
- Improve error messages
- Add keyboard shortcuts
- Small UI improvements

### Medium
- Add new file format support
- Implement dark/light theme toggle
- Add more smart detection patterns
- Improve accessibility
- Add configuration options

### Advanced
- Implement automated testing
- Add plugin system
- Create CI/CD pipeline
- Add internationalization
- Performance optimizations

## Getting Started

1. **Look for issues** labeled `good first issue`
2. **Comment on the issue** to let us know you're working on it
3. **Ask questions** if anything is unclear
4. **Have fun** building something awesome!

---

Thank you for contributing to Line Shuffler! 🎉 