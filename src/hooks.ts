import { dev } from '$app/env'

import type { Handle } from '@sveltejs/kit'
import type { ServerResponse } from '@sveltejs/kit/types/hooks'
const rootDomain = import.meta.env.VITE_DOMAIN // or your server IP for dev

const directives = {
	'base-uri': ["'self'"],
	'child-src': ["'self'"],
	'connect-src': dev
		? ["'self'", 'ws://localhost:*', 'ws://*', '*']
		: ["'self'", 'ws://localhost:*'],
	// 'connect-src': ,
	'img-src': [
		"'self'",
		'data:',
		'https://*.ytimg.com',
		'https://*.googleusercontent.com',
		'https://*.ggpht.com',
		'https://www.gstatic.com/'
	],
	'font-src': ["'self'", 'data:'],
	'form-action': ["'self'"],
	'frame-ancestors': ["'self'"],
	'frame-src': ["'self'"],
	'manifest-src': ["'self'"],
	'media-src': [
		"'self'",
		'data:',
		'ws://localhost:*',
		'localhost:*',
		'https://*.googlevideo.com'
	],
	'object-src': ["'none'"],
	'style-src': ["'self'", "'unsafe-inline'"],
	'default-src': [
		"'self'",
		rootDomain,
		`ws://${rootDomain}`,
		'localhost:*',
		'https://*.googlevideo.com/',
		'https://static.cloudflareinsights.com'
	],
	'script-src': [
		"'self'",
		"'unsafe-inline'",
		"'report-sample'",
		'https://static.cloudflareinsights.com'
	],
	'worker-src': ["'self'"]
}

const csp = Object.entries(directives)
	.map(([key, arr]) => key + ' ' + arr.join(' '))
	.join('; ')
interface HooksResponse extends ServerResponse {
	headers: Record<string, string>
}
export const handle = async ({ request, resolve }): Promise<HooksResponse> => {
	request.locals = request.headers
	const response = await resolve(request)

	return {
		...response,
		headers: {
			...response.headers,
			'X-Frame-Options': 'SAMEORIGIN',
			'Referrer-Policy': 'no-referrer',
			'access-control-allow-origin': dev ? '*' : rootDomain,
			'Permissions-Policy':
				'accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()',
			'X-Content-Type-Options': 'nosniff',
			'Content-Security-Policy': csp,
			'Strict-Transport-Security':
				'max-age=31536000; includeSubDomains; preload'
		}
	}
}
