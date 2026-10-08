# Personal Portfolio Website V5

Personal portfolio website built with Gatsby, React, and styled-components. This site showcases projects, work experience, and blog posts in a professional and modern way.

## 📋 Overview

This is a static website generated with **Gatsby v5**, using React for the user interface and styled-components for styling. Content is managed through Markdown files in the `content/` folder, allowing easy editing and maintenance without the need for a database.

### Key Features

- ✨ Blazing fast static site generated with Gatsby
- 📱 Fully responsive design
- 🎨 Modern interface with smooth animations
- 📝 Blog with Markdown support
- 🖼️ Automatic image optimization
- 🔍 SEO optimized with meta tags and sitemap
- 📊 Google Analytics integration
- 🌙 Custom styling with styled-components
- ♿ Accessible and performance optimized
- 📖 Syntax highlighting for code with PrismJS

## 🏗️ Project Structure

```
v5/
├── content/              # Markdown content
│   ├── featured/         # Featured projects
│   ├── jobs/            # Work experience
│   ├── posts/           # Blog posts
│   └── projects/        # Other projects
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Gatsby pages
│   ├── styles/          # Global styles and themes
│   ├── templates/       # Templates for dynamic content
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── config.js        # Site configuration
├── static/              # Static files
└── gatsby-*.js          # Gatsby configuration files
```

## 🔧 Technologies and Dependencies

### Core Framework

- **Gatsby 5.16** - React-based framework for static sites
- **React 18.3.1** - UI library
- **React DOM 18.3.1** - React rendering

### Styling

- **styled-components 5.3.0** - CSS-in-JS for components
- **babel-plugin-styled-components** - Better debugging and SSR

### Content and Markdown

- **gatsby-transformer-remark** - Processes Markdown files
- **gatsby-remark-images** - Image optimization in Markdown
- **gatsby-remark-prismjs** - Syntax highlighting for code
- **gatsby-remark-external-links** - External links handling
- **gatsby-remark-code-titles** - Code block titles

### Images

- **gatsby-plugin-image** - Optimized image component
- **gatsby-plugin-sharp** - Image processing
- **gatsby-transformer-sharp** - Image transformations

### SEO and Analytics

- **Gatsby Head API** - Page titles and meta tags
- **gatsby-plugin-sitemap** - Automatic sitemap generation
- **gatsby-plugin-robots-txt** - robots.txt file
- **gatsby-plugin-google-analytics** - Google Analytics integration

### PWA and Performance

- **gatsby-plugin-manifest** - Web app manifest
- **gatsby-plugin-offline** - Service worker for offline functionality
- **gatsby-plugin-netlify** - Netlify optimization

### Animations

- **animejs 3.1.0** - Animation library
- **scrollreveal 4.0.5** - Scroll animations
- **react-transition-group 4.3.0** - React transitions

### Utilities

- **lodash 4.17.21** - JavaScript utility functions
- **prop-types 15.7.2** - React props validation

### Development

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Staged files linting

## 🛠 Installation & Set Up

1. Install and use the correct version of Node using [NVM](https://github.com/nvm-sh/nvm)

   ```sh
   nvm install
   ```

2. Install dependencies

   ```sh
   yarn install
   ```

3. Start the development server

   ```sh
   yarn start
   ```

## 🚀 Building and Running for Production

1. Generate a full static production build

   ```sh
   yarn build
   ```

1. Preview the site as it will appear once deployed

   ```sh
   yarn serve
   ```

## 🎨 Color Reference

| Color          | Hex                                                                |
| -------------- | ------------------------------------------------------------------ |
| Navy           | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) `#0a192f` |
| Light Navy     | ![#112240](https://via.placeholder.com/10/0a192f?text=+) `#112240` |
| Lightest Navy  | ![#233554](https://via.placeholder.com/10/303C55?text=+) `#233554` |
| Slate          | ![#8892b0](https://via.placeholder.com/10/8892b0?text=+) `#8892b0` |
| Light Slate    | ![#a8b2d1](https://via.placeholder.com/10/a8b2d1?text=+) `#a8b2d1` |
| Lightest Slate | ![#ccd6f6](https://via.placeholder.com/10/ccd6f6?text=+) `#ccd6f6` |
| White          | ![#e6f1ff](https://via.placeholder.com/10/e6f1ff?text=+) `#e6f1ff` |
| Green          | ![#64ffda](https://via.placeholder.com/10/64ffda?text=+) `#64ffda` |
