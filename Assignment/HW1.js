import { Application } from "https://deno.land/x/oak/mod.ts";
//by github.com/nicoakuang
const app = new Application();

app.use((ctx) => {
  let pathname = ctx.request.url.pathname
  ctx.response.type = 'text/html'
  if (pathname.startsWith("/nqu/csie/")) {
    ctx.response.body = `<a href="https://csie.nqu.edu.tw//">National Quemoy University Department of Computer Science and Information Engineering</a>`;
  } else if (pathname.startsWith("/nqu/")) {
    ctx.response.body = `<a href="https://www.nqu.edu.tw/">National Quemoy University</a>`;
  } else if (pathname.startsWith("/to/nqu/csie/")) {
    ctx.response.redirect('https://csie.nqu.edu.tw//');
  } else if (pathname.startsWith("/to/nqu/")) {
    ctx.response.redirect('https://www.nqu.edu.tw/');
  } else {
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

console.log('Started at: http://127.0.0.1:8000')
await app.listen({ port: 8000 });