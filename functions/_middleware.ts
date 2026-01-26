/**
 * Cloudflare Pages Middleware
 * Sets correct MIME types for JavaScript and CSS files
 */
import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next()
  const url = new URL(context.request.url)
  
  // Set correct MIME types for JavaScript files
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
  }
  
  // Set correct MIME type for CSS files
  if (url.pathname.endsWith('.css')) {
    response.headers.set('Content-Type', 'text/css; charset=utf-8')
  }
  
  return response
}
