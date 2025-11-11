# Hamza Tekin - Personal Website

A lightning-fast, SEO-optimized personal portfolio website built with Astro and TypeScript. This site generates pure static HTML for maximum performance and is optimized for all devices and search engines.

## ✨ Features

- **⚡ Instant Loading**: Pure static HTML generation - no JavaScript required
- **🔍 SEO Optimized**: Complete meta tags, structured data, and semantic HTML
- **📱 Responsive Design**: Perfect on all devices and screen sizes
- **♿ Accessible**: WCAG compliant with screen reader support
- **🎨 Modern Tech Stack**: Astro 5, TypeScript, Tailwind CSS 4
- **🚀 Performance First**: Sub-1s build time, optimized assets
- **📊 Analytics Ready**: Structured data for search engines

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.15.5 (Static Output)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.1.17
- **Icons**: Custom SVG icons
- **Deployment**: Static site (compatible with any static host)

## 📁 Project Structure

```text
/
├── public/                 # Static assets (copied to build)
│   ├── favicon.svg        # Modern scalable favicon
│   ├── favicon.ico        # Legacy fallback
│   ├── favicon-16x16.png  # Small size
│   ├── favicon-32x32.png  # Standard size
│   ├── apple-touch-icon.png # iOS bookmarks
│   ├── android-chrome-*.png # Android PWA icons
│   ├── site.webmanifest   # PWA configuration
│   ├── robots.txt         # SEO crawling instructions
│   └── sitemap.xml        # Site structure for search engines
├── src/
│   ├── layouts/
│   │   └── Layout.astro   # Base layout with SEO meta tags
│   ├── pages/
│   │   └── index.astro    # Homepage content
│   └── styles/
│       └── global.css     # Tailwind CSS import
├── astro.config.mjs       # Astro configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hamzatekin.dev
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## 📜 Available Scripts

| Command | Action |
|---------|--------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start local development server |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## 🏗 Build & Deployment

### Local Build
```bash
npm run build
```
The optimized static site will be generated in the `dist/` folder.

### Deployment Options
This static site can be deployed to any hosting service:

- **Vercel**: Connect repository and deploy automatically
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Cloudflare Pages**: Connect repository and deploy
- **Traditional Hosting**: Upload `dist/` folder contents

## 🔧 Configuration

### Astro Configuration
Located in `astro.config.mjs`:
- Static output mode for maximum performance
- HTML compression enabled
- Tailwind CSS integration
- Optimized build settings

### SEO Configuration
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD schema for better search visibility
- **Favicons**: Complete set for all browsers and devices
- **Sitemap**: Auto-generated for search engine crawling

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Theme**: Professional dark color scheme
- **Responsive**: Mobile-first design approach
- **Accessibility**: High contrast and focus states

## 🎯 Performance Features

- **Static HTML**: No JavaScript means instant loading
- **Optimized Assets**: All images and icons are optimized
- **DNS Prefetch**: External domains pre-resolved
- **Resource Preloading**: Critical resources loaded first
- **Compressed Output**: Minified HTML and CSS
- **Cache Friendly**: Perfect for CDN caching

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest)
- **Mobile**: iOS Safari, Chrome Mobile
- **Legacy**: Graceful degradation with fallbacks

## 🤝 Contributing

This is a personal portfolio site. If you find issues or have suggestions for improvement:

1. Open an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## 📄 License

This project is private and for personal use only.

## 📞 Contact

- **GitHub**: [github.com/hamzatekin](https://github.com/hamzatekin)
- **LinkedIn**: [linkedin.com/in/hamza-tekin](https://www.linkedin.com/in/hamza-tekin-5a003858/)

---

Built with ❤️ using [Astro](https://astro.build/)
