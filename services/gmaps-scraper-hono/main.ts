import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { performGoogleMapsSearch } from "./search.ts";

const app = new Hono()

app.get('/static/*', serveStatic({ root: './static' }))

app.post('/search', async (c) => {
  const formData = await c.req.formData()
  const userMessage = formData.get('message')?.toString() || ''

  // Call the function to perform Google Maps search
  const searchResults = await performGoogleMapsSearch(userMessage)

  return c.json(searchResults)
})

Deno.serve(app.fetch)


// import { serveTLS } from "https://deno.land/std@0.224.0/http/server.ts";
// import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts'
// import { performGoogleMapsSearch } from './search.ts'

// config({ export: true })

// const port = Deno.env.get('PORT') || '8080'

// const handler = async (req: Request): Promise<Response> => {
//   if (req.method === 'POST' && req.url === '/search') {
//     const formData = await req.formData()
//     const userMessage = formData.get('message')?.toString() || ''

//     // Call the function to perform Google Maps search
//     const searchResults = await performGoogleMapsSearch(userMessage)

//     return new Response(JSON.stringify(searchResults), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   }

//   return new Response('Not Found', { status: 404 })
// }

// const options = {
//   hostname: "localhost",
//   port,
//   certFile: "./path/to/your/cert.pem",
//   keyFile: "./path/to/your/key.pem",
// };


// console.log(`Server running on http://localhost:${port}/`)
// // await serve(handler, { port })
// await serveTLS(handler, options);
