# Retro Terminal Component

## Overview

The Retro Terminal is an interactive command-line interface for the Pixel Blog that provides an alternative way to navigate the site. It features a classic terminal aesthetic with retro styling, sound effects, and a comprehensive command system.

## Features

### ✨ Core Features
- **Retro Interface**: Classic terminal design with blinking cursor and CRT effects
- **Command System**: Full command library with navigation, utilities, and easter eggs
- **Auto-completion**: Tab completion for commands and arguments
- **Command History**: Navigate previous commands with arrow keys
- **Sound Effects**: Retro terminal sounds for typing and command execution
- **Mobile Support**: Touch-friendly interface with swipe gestures

### 🎮 Commands

#### Navigation Commands
- `home` - Navigate to homepage
- `about` - View about page
- `blog [post-name]` - List blog posts or view specific post
- `projects [project-name]` - View projects or specific project details
- `contact` - Show contact information

#### System Commands
- `help` - Show all available commands
- `clear` - Clear terminal screen
- `history` - Show command history
- `neofetch` - Display system information
- `theme [theme-name]` - Change terminal theme
- `exit` - Close terminal

#### Easter Eggs & Fun Commands
- `matrix` - Enter the Matrix with falling characters
- `coffee` - ASCII art coffee break
- `konami` - Activate the legendary cheat code
- `easter` - Find hidden commands
- `cowsay [message]` - Make a cow say something
- `ls` - Unix-style directory listing (with a twist)
- `cat [filename]` - Display file contents (try `secret.txt`)
- `sudo` - Superuser command (with humorous response)
- `whoami` - Display current user info

### ⌨️ Keyboard Shortcuts

- **Ctrl+\`** or **Cmd+\`** - Toggle terminal open/close
- **Tab** - Auto-complete current command
- **↑/↓** - Navigate command history
- **Enter** - Execute command
- **Escape** - Close suggestions

### 📱 Mobile Gestures

- **Swipe Right** - Show help
- **Swipe Left** - Clear terminal
- **Tap** - Focus input (auto-opens mobile keyboard)

## Technical Details

### Components

1. **RetroTerminal.tsx** - Main terminal component
2. **useTerminal.ts** - Custom hook for terminal state management
3. **TerminalProvider.tsx** - Context provider for global terminal access

### Integration

The terminal is automatically included in all pages through the `ClientComponents` wrapper in the main layout. It's lazy-loaded for optimal performance.

### Theming

The terminal respects the current site theme and automatically adapts its colors:
- Matrix theme: Classic green on black
- Amber theme: Retro amber terminal
- Cyber theme: Cyberpunk blue aesthetic

### Audio

Terminal includes Web Audio API sound effects:
- Typing sounds (400Hz, short bursts)
- Command execution (800Hz)
- Navigation sounds (600Hz open, 300Hz close)
- Auto-completion (600Hz)

## Usage Examples

### Basic Navigation
```bash
visitor@pixelwisdom:~ $ help
visitor@pixelwisdom:~ $ blog
visitor@pixelwisdom:~ $ projects quality-score-engine
visitor@pixelwisdom:~ $ home
```

### Fun Commands
```bash
visitor@pixelwisdom:~ $ matrix
visitor@pixelwisdom:~ $ cowsay Hello World!
visitor@pixelwisdom:~ $ konami
visitor@pixelwisdom:~ $ cat secret.txt
```

### System Info
```bash
visitor@pixelwisdom:~ $ neofetch
visitor@pixelwisdom:~ $ whoami
visitor@pixelwisdom:~ $ theme matrix
```

## Customization

### Adding New Commands

To add a new command, extend the `commands` object in `RetroTerminal.tsx`:

```typescript
newCommand: {
  name: 'newCommand',
  description: 'Description of the command',
  action: (args) => {
    // Command logic here
    return ['Output line 1', 'Output line 2']
  },
  autocomplete: ['option1', 'option2'] // Optional
}
```

### Theme Integration

Commands can access the current theme through the `useTheme` hook:

```typescript
const { currentTheme } = useTheme()
// Use currentTheme.colors.primary, etc.
```

### Sound Customization

Modify sound effects by changing the `playSound` function parameters:

```typescript
playSound(frequency, duration)
// frequency: Hz (200-2000 typical range)
// duration: seconds (0.05-0.5 typical range)
```

## Accessibility

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling for suggestions and input
- **High Contrast**: Respects user's high contrast preferences
- **Reduced Motion**: Can be configured to respect motion preferences

## Performance

- **Lazy Loading**: Terminal is lazy-loaded to reduce initial bundle size
- **Audio Context**: Created only when needed, properly cleaned up
- **Memory Management**: Command history is limited to prevent memory leaks
- **Efficient Rendering**: Optimized re-renders with React hooks

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Web Audio API**: Gracefully degrades if not supported
- **Touch Events**: Full support for mobile browsers
- **Keyboard Events**: Standard keyboard event handling

## Troubleshooting

### Audio Not Working
- Check browser audio permissions
- Try user interaction first (click somewhere)
- Verify Web Audio API support

### Commands Not Responding
- Check for JavaScript errors in console
- Verify theme context is available
- Ensure router is properly initialized

### Mobile Issues
- Verify touch events are supported
- Check viewport meta tag
- Ensure proper z-index stacking

## Future Enhancements

- [ ] Command aliases and shortcuts
- [ ] Custom user themes
- [ ] Command scripting/macros
- [ ] Multi-user session support
- [ ] Advanced auto-completion with fuzzy matching
- [ ] Terminal multiplexing
- [ ] Plugin system for external commands
- [ ] Voice command support
- [ ] AI-powered command suggestions

## Contributing

When adding new features to the terminal:

1. Follow the existing command structure
2. Add appropriate TypeScript types
3. Include accessibility considerations
4. Test on both desktop and mobile
5. Update this documentation
6. Add unit tests for new commands

## License

Part of the Pixel Wisdom blog project. See main project license for details. 