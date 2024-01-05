// By github.com/nicoakuang

// Import required modules
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Initialize the SQLite database
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

// Create an Oak application
const app = new Application();

// Create an Oak router
const router = new Router();

// Define routes
router
  .get('/', (ctx) => ctx.response.redirect('/public/index.html'))
  .get('/list', list)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/public/(.*)', pub);

// Use the router in the application
app.use(router.routes());
app.use(router.allowedMethods());

// Middleware to make the database accessible in the context
app.use(async (ctx, next) => {
  ctx.db = db;
  await next();
});

// Function to execute SQL queries on the database
function query(sql) {
  let list = [];
  // Iterate through the result of the database query and push to the list
  for (const [id, title, body] of db.query(sql)) {
    list.push({ id, title, body });
  }
  return list;
}

// Function to serve static files
async function pub(ctx) {
  console.log('path=', ctx.request.url.pathname);
  // Send the requested file from the specified root directory
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  });
}

// Route handler to list all posts
async function list(ctx) {
  // Set the response type to JSON
  ctx.response.type = 'application/json';
  // Fetch all posts from the database and send them in the response body
  let posts = query("SELECT id, title, body FROM posts");
  ctx.response.body = posts;
}

// Route handler to show a specific post
async function show(ctx) {
  const id = ctx.params.id;
  // Fetch the specified post from the database
  let posts = query(`SELECT id, title, body FROM posts WHERE id=${id}`);
  let post = posts[0];
  // If the post doesn't exist, throw a 404 error
  if (!post) ctx.throw(404, 'Invalid post id');
  // Set the response type to JSON and send the post in the response body
  ctx.response.type = 'application/json';
  ctx.response.body = post;
}

// Route handler to create a new post
async function create(ctx) {
  const body = ctx.request.body(); // Automatically detect content type
  // Check if the content type is JSON
  if (body.type === "json") {
    // Parse the JSON body
    let post = await body.value;
    // Set the id to null, allowing the database to auto-increment the id
    post.id = post.length
    // Insert the new post into the database
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    // Send a success response
    ctx.response.body = 'success';
    console.log('create:save=>', post);
  }
}

// Start the server on port 8001
console.log('Server run at http://127.0.0.1:8001');
await app.listen({ port: 8001 });
