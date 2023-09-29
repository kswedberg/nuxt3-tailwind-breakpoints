import {fileURLToPath} from 'url';
import {existsSync} from 'fs';
import {defineNuxtModule, addPlugin, addComponent, createResolver, resolveAlias, requireModule} from '@nuxt/kit';

export interface ModuleOptions {
  breakpoints: any;
  enableInProd: any;
  enabled: boolean;
  colorScheme: string;
  position: string;
  configPath: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-tailwind-breakpoints',
    configKey: 'tailwindBreakpoints',
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0',
    },

  },
  // Default configuration options of the module
  defaults: {
    enabled: true,
    enableInProd: false,
    colorScheme: 'auto',
    position: 'bottomRight',
    configPath: '~~/tailwind.config.js',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (options.enableInProd || (process.env.NODE_ENV === 'development' && options.enabled)) {
      const configPath = resolveAlias(options.configPath);
      let tailwindConfig = {};

      if (!options.breakpoints && existsSync(configPath)) {
        // const clearModule = require('clear-module');

        // clearModule(configPath);
        tailwindConfig = requireModule(configPath);

        // console.log('tailwindConfig', tailwindConfig)
        // logger.info(`Merging Tailwind config from ~/${relative(this.options.srcDir, configPath)}`)
        const resolveConfig = require('tailwindcss/resolveConfig');
        const resolvedConfig = resolveConfig(tailwindConfig);

        options.breakpoints = resolvedConfig.theme.screens || {};
      } else {
        options.breakpoints = options.breakpoints || {};
      }

      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
      nuxt.options.runtimeConfig.public.tailwindBreakpoints = options;

      console.log({configPath});
      // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
      addPlugin(resolver.resolve('./runtime/plugin'));

      addComponent({
        name: 'TailwindBreakpoints',
        filePath: resolver.resolve('./runtime/components/TailwindBreakpoints'),
      });

    }
  },
});
