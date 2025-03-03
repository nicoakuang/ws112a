import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";

const app = new Application();

const posts = [
  { id: 0, title: 'Gaby', body: 'hi' },
  { id: 1, title: 'Nico', body: 'hello' }
];

const wss = new WebSocketServer(8080);

wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    var id, post, msg = JSON.parse(message);
    console.log('msg=', msg);
    switch (msg.type) {
      case 'list':
        ws.send(JSON.stringify({ type: 'list', posts }));
        break;
      case 'show':
        id = msg.post.id;
        post = posts.find(p => p.id === id);
        ws.send(JSON.stringify({ type: 'show', post }));
        break;
      case 'create':
        post = msg.post;
        id = posts.push(post) - 1;
        post.created_at = new Date();
        post.id = id;
        ws.send(JSON.stringify({ type: 'create', post }));
        break;
      case 'search':
        const searchTerm = msg.searchTerm.toLowerCase();
        const foundPost = posts.find(p => p.title.toLowerCase().includes(searchTerm));
        ws.send(JSON.stringify({ type: 'found', post: foundPost }));
        break;
    }
  });
});

app.use(async (ctx, next) => {
  await next();
  console.log('path=', ctx.request.url.pathname);
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/public/`,
    index: "index.html",
  });
});

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
