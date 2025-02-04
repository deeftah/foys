// /* eslint-disable no-undef */

import node from '@sveltejs/adapter-node'

import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'

const check = process.env.NODE_ENV
const dev = check === 'development'
import worker from '@snuffydev/adapter-cloudflare-cache'
/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src'],
			prependData: `@import 'src/global/scss/utility/_mixins.scss';`
		},
		defaults: {
			style: 'postcss',
			script: 'typescript'
		},
		postcss: {
			plugins: [cssnano({ preset: 'default' }), autoprefixer({})]
		},
		typescript: { tsconfigFile: './tsconfig.json' }
	}),
	kit: {
		adapter: dev ? node() : worker(),
		target: '#app',
		files: {
			assets: 'static',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			template: 'src/app.html',
			hooks: 'src/hooks'
		},
		vite: {
			resolve: {
				alias: {
					$stores: path.resolve('./src/lib/stores'),
					$components: path.resolve('./src/lib/components')
				}
			},
			cleanCssOptions: {
				level: {
					2: {
						all: true,
						removeDuplicateRules: true
					}
				}
			}
		}
	}
}
