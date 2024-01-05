//by github.com/nicoakuang

//import the module
import { Application } from "https://deno.land/x/oak/mod.ts";

// Create an instance of the Oak Application
const app = new Application();

// Define middleware to handle requests
app.use((ctx) => {
  // Extract the path from the request URL
  let pathname = ctx.request.url.pathname;

  // Set the response content type to HTML
  ctx.response.type = 'text/html';

  // Handle different paths and provide appropriate responses or redirects
  if (pathname.startsWith("/nqu/csie/")) {
    // Respond with a link to National Quemoy University Department of Computer Science and Information Engineering
    ctx.response.body = `<a href="https://csie.nqu.edu.tw//">National Quemoy University Department of Computer Science and Information Engineering</a>`;
  } else if (pathname.startsWith("/nqu/")) {
    // Respond with a link to National Quemoy University
    ctx.response.body = `<a href="https://www.nqu.edu.tw/">National Quemoy University</a>`;
  } else if (pathname.startsWith("/to/nqu/csie/")) {
    // Redirect to National Quemoy University Department of Computer Science and Information Engineering
    ctx.response.redirect('https://csie.nqu.edu.tw//');
  } else if (pathname.startsWith("/to/nqu/")) {
    // Redirect to National Quemoy University
    ctx.response.redirect('https://www.nqu.edu.tw/');
  } else {
    // For any other path, display information about available routes
    ctx.response.body = `
    <html>
    <body>
      <p>/nqu/ Displays a hyperlink to National Quemoy University Website</p>
      <p>/nqu/csie/ Displays a hyperlink to National Quemoy University Department of Computer Science and Information Engineering Website</p>
      <p>/to/nqu/ Redirects to National Quemoy University website</p>
      <p>/to/nqu/csie/ Redirects to National Quemoy University Department of Computer Science and Information Engineering Website</p>
    </body>
    </html>
    `;
  }
});

// Start the application on port 8000
await app.listen({ port: 8000 });


console.log('Started at: http://127.0.0.1:8000')
await app.listen({ port: 8000 });