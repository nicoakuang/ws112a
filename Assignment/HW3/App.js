//by github.com/nicoakuang

// Import the required modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './Render.js';

// Define an array of posts
const posts = [
  { id: 0, title: 'Li He Wei', body: '0909116804' },
  { id: 1, title: 'Kelly', body: '0910111251' }
];

// Create a router instance
const router = new Router();

// Define routes and their handlers
router
  .get('/', list)
  .get("/search/search", search)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post("/search", find)
  .post('/post', create);

// Create an application instance
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Route Handlers

// List all posts
async function list(ctx) {
  ctx.response.body = await render.list(posts);
}

// Display the form for adding a new post
async function add(ctx) {
  ctx.response.body = await render.newPost();
}

// Display a specific post
async function show(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) ctx.throw(404, 'Invalid post id');
  ctx.response.body = await render.show(post);
}

// Display the search form
async function search(ctx) {
  ctx.response.body = await render.search();
}

// Search for a post based on the submitted form data
async function find(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    let name, number;
    for (let i of pairs)
      name = i;
    const found = posts.some(post => post.title === name[1]);

    if (found) {
      for (let i of posts) {
        if (i.title == name[1])
          number = i.body;
      }
      ctx.response.body = await render.found(name[1], number);
    } else {
      ctx.response.body = await render.not_found();
    }
  }
}

// Create a new post based on the submitted form data
async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    console.log('post=', post);
    const id = posts.push(post) - 1;
    post.created_at = new Date();
    post.id = id;
    ctx.response.redirect('/');
  }
}

// Start the application and listen on port 8000
console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
