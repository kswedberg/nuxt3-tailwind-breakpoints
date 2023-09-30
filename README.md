# Nuxt Tailwind Breakpoints

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Show Tailwind CSS Breakpoints in your Nuxt 3 app.

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md) -->
- [🏀 Online playground](https://stackblitz.com/github/kswedberg/nuxt3-tailwind-breakpoints?file=playground%2Fapp.vue)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

This module reads the defined breakpoints within your tailwind config and showing the currently active breakpoint based on your browser window width.

It will only be loaded in development mode and does not interfere with your production build (unless you set `enableInProd` to `true`).

**Note**: This project started as a fork of the [nuxt-breaky](https://github.com/teamnovu/nuxt-breaky) module and now is compatible with Nuxt 3. It should look and act pretty much the same as the original. Minor changes include removing the `node-sass` dependency to make the module usable with node.js >= 16 and adding a landmark `aria-role` attribute to the `div.current-breakpoint` element.


## Quick Setup

1. Add `nuxt3-tailwind-breakpoints` dependency to your project

    ```bash
    # Using yarn
    yarn add --dev nuxt3-tailwind-breakpoints

    # Using npm
    npm install --save-dev nuxt3-tailwind-breakpoints

    # Using pnpm
    pnpm add -D nuxt3-tailwind-breakpoints
    ```

2. Add `nuxt3-tailwind-breakpoints` to the `modules` section of `nuxt.config.ts`

    ```js
    export default defineNuxtConfig({
      modules: [
        'nuxt3-tailwind-breakpoints'
      ]
    })
    ```

### Configuration

In `nuxt.config.ts`, you can pass options to `nuxt3-tailwind-breakpoints` by adding a top-level `tailwindBreakpoints` object:

```js
{
  modules: [
    'nuxt3-tailwind-breakpoints',
  ],
  tailwindBreakpoints: {
    /* module options */
  }
}
```

Or, instead of registering the module as a string value, you can use an array with the first argument the name and the second the options:

```js
{
  modules: [
    ['nuxt3-tailwind-breakpoints', { /* module options */ }]
  ],
}
```

### Options

| Option         | Type      | Default                   | Options                                                          | Description                                                                                                                                                                                                                                                          |
| -------------- | --------- | ------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`      | `Boolean` | `true`                    | `true` \| `false`                                                | Enable/Disable the                                                                                                                              module                                                                                                            |
| `enableInProd` | `Boolean` | `false`                   | `true` \| `false`                                                | Enable this module in production (overrides the enabled option; Please be aware this adds ~19.5KB (~3.5KB) to the client bundle size. [More Info](https://github.com/nuxt-community/tailwindcss-module#referencing-in-javascript))                                        |
| `colorScheme`  | `String`  | `auto`                    | `'auto'` \| `'light'` \| `'dark'`                                | Switch between different color schemes                                                                                                                                                                                                                               |
| `position`     | `String`  | `'bottomRight'`           | `'topLeft'` \| `'topRight'` \| `'bottomLeft'` \| `'bottomRight'` | The starting position                                                                                                                                                                                                                                            |
| `parseRaw`     | `Boolean` | `false`                   | `true` \| `false`                                                | (_Experimental_) Enable parsing a screen's `raw` property and use a query's `min-width` pixel value if it specifies the device type as `screen` or doesn't specify device type at all. For example, `lg: {raw: print, (min-width: 1024px)}` would set `lg` to `1024` |
| `configPath`   | `String`  | `'~~/tailwind.config.js'` | any valid path pointing to the file                               | Path to the TailwindCSS config file                                                                                                                                                                                                                                  |
| `breakpoints`  | `Object`  | `undefined`               |                                                                  | An object representing all the breakpoints you'd like to identify in your configuration. If provided, it is used _instead of_ `screens` from tailwind config                                                                                                         |

That's it! You can now use Tailwind Breakpoints in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt3-tailwind-breakpoints/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt3-tailwind-breakpoints

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt3-tailwind-breakpoints.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt3-tailwind-breakpoints

[license-src]: https://img.shields.io/npm/l/nuxt3-tailwind-breakpoints.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/kswedberg/nuxt3-tailwind-breakpoints/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
