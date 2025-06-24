# Changelog

All notable changes to Line Shuffler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-03

### Added
- **Core Functionality**
  - Fisher-Yates shuffle algorithm implementation
  - Text input with line counting
  - Fixed position lines support
  - Multiple fixed lines capability
  - Preview mode for shuffle results

- **File Operations**
  - Drag & drop file support
  - .txt file import/export
  - File upload dialog
  - Save output to file functionality

- **Modern UI Features**
  - Dark theme design with 2025 aesthetics
  - Responsive grid layout
  - Smooth animations and transitions
  - Toast notification system
  - Card-based interface design

- **Advanced Features**
  - Smart clipboard integration with auto-paste
  - Clipboard monitoring for multi-line content
  - Undo/redo system with 20-step history
  - Statistics tracking with milestones
  - Smart pattern detection (URLs, social media)

- **Keyboard Shortcuts**
  - `Ctrl+Enter` - Shuffle lines
  - `Ctrl+Shift+A` - Add new fixed line
  - `Ctrl+Shift+C` - Copy output to clipboard
  - `Ctrl+Z` - Undo last action
  - `Ctrl+Shift+Z` - Redo last action
  - `ESC` - Remove focus from input

- **Smart Detection**
  - URL pattern detection (5+ URLs triggers notification)
  - Social media account detection
  - Automatic mode switching based on content

- **User Experience**
  - Allow duplicates option
  - Input validation and error handling
  - Line count display
  - Empty state placeholders
  - Comprehensive help text

### Technical
- **Framework**: Electron.js v28.0.0
- **Architecture**: Clean separation of main and renderer processes
- **Performance**: Optimized for large text files
- **Cross-platform**: Windows, macOS, and Linux support

### Design
- **Color Scheme**: Modern dark theme with purple/blue accents
- **Typography**: Poppins font family
- **Icons**: Font Awesome 6.4.0
- **Layout**: CSS Grid with responsive design
- **Effects**: Smooth transitions, subtle shadows, modern glassmorphism

## [Unreleased]

### Planned Features
- Light theme toggle
- Internationalization support
- Plugin system
- Advanced file format support (CSV, JSON)
- Automated testing suite
- CI/CD pipeline
- Performance optimizations

### Known Issues
- None at this time

---

## Release Notes

### v1.0.0 - "Modern Foundation"
This initial release establishes Line Shuffler as a modern, feature-rich desktop application for text line shuffling. Built with Electron.js, it provides a clean, intuitive interface with powerful functionality.

**Highlights:**
- ✨ Beautiful 2025-inspired dark theme
- 🔀 True randomization with Fisher-Yates algorithm
- 📌 Flexible fixed position line system
- 🚀 Smart clipboard and file handling
- ⚡ Advanced keyboard shortcuts and undo/redo
- 🎯 Pattern detection for URLs and social media

This version sets a solid foundation for future enhancements while providing all essential features users need for text line shuffling tasks.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this changelog and the project.

## Support

For questions or issues, please visit our [GitHub Issues](https://github.com/ibrahimsancar/line-shuffler/issues) page.
