// app.js
// github.com/nicoakuang
// Import required modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'; // Import local render module
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Initialize the SQLite database
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

// Initialize the router
const router = new Router();
router
  .get('/', list)          // Route for listing all posts
  .get('/post/new', add)   // Route for adding a new post
  .get('/post/:id', show)  // Route for displaying a specific post
  .post('/post', create)   // Route for creating a new post
  .get("/search/search", search)  // Route for displaying search form
  .post("/search", find);  // Route for handling search

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

async function search(ctx) {
  // Render the search form
  ctx.response.body = await render.search();
}

async function find(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    let name;

    // Extract the value of the "name" field from the form
    for (let pair of pairs) {
      if (pair[0] === "name") {
        name = pair[1];
        break;
      }
    }

    if (name) {
      // Perform a case-insensitive search for posts containing the specified name
      const posts = query(`SELECT id, title, body FROM posts WHERE title LIKE '%${name}%'`);
      const foundPost = posts[0];

      // Render the result of the search
      ctx.response.body = render.found(foundPost.title, foundPost.body);
    } else {
      // Render not found if the "name" field is empty
      ctx.response.body = render.not_found();
    }
  }
}

// Function to list all posts
async function list(ctx) {
  // Fetch all posts from the database and render them
  let posts = query("SELECT id, title, body FROM posts");
  console.log('list:posts=', posts);
  ctx.response.body = render.list(posts);
}

// Function to display the form for adding a new post
async function add(ctx) {
  // Render the form for creating a new post
  ctx.response.body = render.newPost();
}

// Function to display a specific post
async function show(ctx) {
  const pid = ctx.params.id;
  // Fetch the specified post from the database and render it
  let posts = query(`SELECT id, title, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  console.log('show:post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = render.show(post);
}

// Function to create a new post
async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    // Extract form data to create a new post
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    console.log('create:post=', post);
    // Insert the new post into the database
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    // Redirect to the home page after creating the post
    ctx.response.redirect('/');
  }
}

// Set the port for the server to listen on
let port = parseInt(Deno.args[0]) 
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });