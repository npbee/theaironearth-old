> This is the info for the next version. It's not live yet!

[![The Air on Earth logo](static/docs-logo.svg)](https://theaironearth.com)

> Source code for my musical alias site

[![Netlify Status](https://api.netlify.com/api/v1/badges/4879131f-d651-4c34-9310-608d99c94974/deploy-status)](https://app.netlify.com/sites/theaironearth/deploys)

Built with:

- [Netlify](https://www.netlify.com)
- [Svelte/Sapper](https://sapper.svelte.dev/)
- [PostCSS](https://github.com/postcss/postcss)
- [Tailwind CSS](https://tailwindcss.com/)

# Setup

1. Install the [Netlify CLI](https://www.netlify.com/docs/cli)
1. Follow the docs to get set up with [Netlify Large Media](https://www.netlify.com/docs/large-media/)
1. Ensure [Yarn](https://yarnpkg.com/lang/en/) is installed
1. Run `yarn install`

# Development

Start the dev server with:

```bash
netlify dev
```

# Deployment

Deployment will happen automatically when pushed to GitHub

# Scripts

## Image Conversion

Jpegs can be conerted to webp with the following command:

```bash
node ./scripts/image.js
```
