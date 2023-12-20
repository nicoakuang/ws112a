// Import required modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'; // Import local render module
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Initialize the SQLite database
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

// Initialize the router
const router = new Router();
router.get('/', list)          // Route for listing all posts
  .get('/post/new', add)        // Route for adding a new post
  .get('/post/:id', show)       // Route for displaying a specific post
  .post('/post', create);       // Route for creating a new post

// Initialize the application
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Function to execute SQL queries on the database
function query(sql) {
  let list = [];
  for (const [id, title, body] of db.query(sql)) {
    list.push({ id, title, body });
  }
  return list;
}

// Function to list all posts
async function list(ctx) {
  let posts = query("SELECT id, title, body FROM posts");
  console.log('list:posts=', posts);
  ctx.response.body = await render.list(posts);
}

// Function to display the form for adding a new post
async function add(ctx) {
  ctx.response.body = await render.newPost();
}

// Function to display a specific post
async function show(ctx) {
  const pid = ctx.params.id;
  let posts = query(`SELECT id, title, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  console.log('show:post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

// Function to create a new post
async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    console.log('create:post=', post);
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    ctx.response.redirect('/');
  }
}

// Set the port for the server to listen on
let port = parseInt(Deno.args[0]);
console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
