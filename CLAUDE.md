# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal resume website project for 徐智昊 (Xu Zhihao), an AI Product Expert applying for ByteDance TRAE AI Coding Product Manager position. The website showcases AI product management experience, technical expertise, and professional achievements using a futuristic AI-native design theme.

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks)
- **Design**: AI-native futuristic theme with particle effects and neon aesthetics
- **Server**: Python HTTP server for local development
- **Styling**: CSS Grid, Flexbox, custom animations, and responsive design
- **Features**: Particle background, typewriter effects, smooth scrolling, form validation

## Development Workflow

### Local Development
```bash
# Start the development server (primary command)
python3 server.py [port]
# Default: python3 server.py (port 8000)
# Custom port: python3 server.py 3000


# Access the website
# Local: http://localhost:8000
# Network: http://[your-ip]:8000
```

### Server Features
The `server.py` provides:
- **CORS Support**: Cross-origin requests enabled for development
- **Cache Control**: No-cache headers for HTML/CSS/JS during development
- **File Validation**: Automatically checks for required files (index.html, styles.css, script.js)
- **Auto-browser Launch**: Opens browser automatically on startup
- **Network Access**: Available on local network for mobile testing
- **Colored Logging**: Status-coded console output for request monitoring

### File Structure
```
/
├── index.html          # Main HTML structure with semantic markup
├── styles.css          # Complete CSS styling with AI theme
├── script.js           # All JavaScript functionality (modular classes)
├── server.py           # Python development server with CORS & validation
├── docs/               # Source documents for content reference
│   ├── self-introduction.md  # Resume content source (Chinese)
│   └── jd.md           # ByteDance TRAE job requirements
├── backup-ai-future/   # Development backup directory
└── CLAUDE.md           # This documentation file
```

### Content Synchronization
**IMPORTANT**: The `docs/self-introduction.md` contains the source resume data in Chinese, which has been manually integrated into `index.html`. When updating content:
1. Modify source data in `docs/self-introduction.md`
2. Manually update corresponding HTML sections
3. Update JavaScript counters and metrics to match
4. Verify all animations and interactions work with new content

## Key Features and Implementation

### AI-Native Design Elements
- **Particle System**: Canvas-based animated background with mouse interaction
- **Neon Color Scheme**: Green (#00ff88) and purple (#8b5cf6) accents on dark theme
- **Typography**: Orbitron for headings (futuristic), Inter for body text, JetBrains Mono for code
- **Animations**: Typewriter effect, counter animations, skill bar progress, fade-in transitions

### Core JavaScript Classes
- `ParticleSystem`: Manages animated background particles and connections
- `NavigationHandler`: Smooth scrolling, mobile menu, active nav states
- `AnimationController`: Intersection Observer animations, counters, typewriter effect
- `FormHandler`: Contact form validation and submission
- `AccessibilityEnhancer`: Keyboard navigation, focus management, reduced motion support

### CSS Architecture
- **Custom Properties**: CSS variables for theming and consistency
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Animation Performance**: GPU-accelerated transforms and opacity changes
- **Accessibility**: Focus indicators, reduced motion support, semantic color usage

## Content Management

### Resume Data Integration
The content is directly integrated from `docs/self-introduction.md` into the HTML structure. Key sections:
- **Hero**: Name, title, key metrics (90% usage improvement, 300+ students, 5 systems integrated)
- **Experience**: Timeline format with achievements from 3 companies (2019-present)
- **AI Projects**: 3 main projects (Synapse MCP, Software-planning-mcp, MCP-Artisan)
- **Skills**: Product management, AI product design, technical stack
- **Contact**: Email, GitHub, location (Hangzhou)

### Job Requirements Alignment
Content emphasizes alignment with ByteDance TRAE position requirements:
- AI Coding product management experience
- Understanding of developer pain points
- Technical communication abilities
- Innovation in AI-assisted programming
- User-centric product approach

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Images and non-critical animations load on intersection
- **Debounced Events**: Scroll and resize events use throttling
- **Resource Preloading**: Critical fonts are preloaded
- **Animation Performance**: Hardware acceleration for smooth 60fps

### Browser Compatibility
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Fallbacks**: Graceful degradation for older browsers
- **Mobile Support**: Touch-friendly interactions, responsive design

## Maintenance Guidelines

### Code Style
- **HTML**: Semantic structure, proper accessibility attributes
- **CSS**: BEM-inspired naming, logical property grouping, consistent spacing
- **JavaScript**: ES6+ features, modular class structure, comprehensive error handling

### Content Updates
To update resume content:
1. Modify `docs/self-introduction.md` source file
2. Update corresponding HTML sections in `index.html`
3. Ensure metrics and achievements are reflected in JavaScript counters
4. Test all animations and interactions

### Deployment Preparation
For production deployment:
1. Minify CSS and JavaScript files
2. Optimize images and add appropriate formats (WebP, AVIF)
3. Configure proper caching headers
4. Add service worker for offline support
5. Test on various devices and screen sizes

## Common Development Tasks

### Adding New Sections
1. Create HTML structure following existing patterns
2. Add corresponding CSS with proper theming
3. Implement JavaScript functionality if needed
4. Update navigation links
5. Test responsive behavior

### Modifying Animations
1. Update CSS keyframes or JavaScript animation logic
2. Test performance impact
3. Ensure accessibility compliance (respect prefers-reduced-motion)
4. Verify smooth operation across devices

### Color Theme Updates
1. Modify CSS custom properties in `:root`
2. Update particle system colors in JavaScript
3. Test contrast ratios for accessibility
4. Verify visual hierarchy consistency

This website demonstrates advanced front-end development skills while effectively presenting AI product management expertise for the target position at ByteDance TRAE.