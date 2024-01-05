// github.com/nicoakuang

// Import necessary modules and libraries
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { RateLimiter } from "https://deno.land/x/oak_rate_limit/mod.ts";
import { MapStore } from "https://deno.land/x/oak_rate_limit/mod.ts";

// Create a database instance and define tables if they don't exist
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

// Set up rate limiting middleware
const rateLimit = RateLimiter({
  store: new MapStore, // Using MapStore by default.
  windowMs: 5000, // Window for the requests that can be made in milliseconds.
  max: 100, // Max requests within the predefined window.
  headers: true, // Default true, it will add the headers X-RateLimit-Limit, X-RateLimit-Remaining.
  message: "Too many requests, please try again later.", // Default message if rate limit reached.
  statusCode: 429, // Default status code if rate limit reached.
});

// Create an Oak application instance
const app = new Application();

// Use the rate limit middleware and session middleware
app.use(await rateLimit);
app.use(Session.initMiddleware());

// Set up routes using the Router
const router = new Router();
router
  .get('/', list)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .post('/login', login)
  .get('/login', loginUi)
  .get('/logout', logout)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

// Use the routes defined in the router
app.use(router.routes());
app.use(router.allowedMethods());

// Define functions for executing SQL commands and handling query results
function sqlcmd(sql, arg1) {
  console.log('sql:', sql);
  try {
    var results = db.query(sql, arg1);
    console.log('sqlcmd: results=', results);
    return results;
  } catch (error) {
    console.log('sqlcmd error: ', error);
    throw error;
  }
}

function postQuery(sql) {
  // Convert SQL results into a list of post objects
  let list = [];
  for (const [id, username, title, body] of sqlcmd(sql)) {
    list.push({ id, username, title, body });
  }
  console.log('postQuery: list=', list);
  return list;
}

function userQuery(sql) {
  // Convert SQL results into a list of user objects
  let list = [];
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({ id, username, password, email });
  }
  console.log('userQuery: list=', list);
  return list;
}

// Parse form body into an object
async function parseFormBody(body) {
  const pairs = await body.value;
  const obj = {};
  for (const [key, value] of pairs) {
    obj[key] = value;
  }
  return obj;
}

// Route handler for displaying signup UI
async function signupUi(ctx) {
  ctx.response.body = render.signupUi();
}

// Route handler for processing user signup
async function signup(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    // Check if the username already exists in the database
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    if (dbUsers.length === 0) {
      // If the username doesn't exist, insert the new user into the database
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success();
    } else 
      ctx.response.body = render.fail();
  }
}

// Route handler for displaying login UI
async function loginUi(ctx) {
  ctx.response.body = render.loginUi();
}

// Route handler for processing user login
async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var user = await parseFormBody(body);
    // Retrieve user from the database based on the provided username
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    var dbUser = dbUsers[0];
    if (dbUser.password === user.password) {
      // If the password matches, set the user in the session and redirect to the home page
      ctx.state.session.set('user', user);
      console.log('session.user=', await ctx.state.session.get('user'));
      ctx.response.redirect('/');
    } else {
      ctx.response.body = render.fail();
    }
  }
}

// Route handler for logging out the user
async function logout(ctx) {
  ctx.state.session.set('user', null);
  ctx.response.redirect('/');
}

// Route handler for displaying the list of posts
async function list(ctx) {
  // Retrieve all posts from the database
  let posts = postQuery("SELECT id, username, title, body FROM posts");
  console.log('list:posts=', posts);
  // Render the list of posts along with user information from the session
  ctx.response.body = render.list(posts, await ctx.state.session.get('user'));
}

// Route handler for displaying the form to add a new post
async function add(ctx) {
  var user = await ctx.state.session.get('user');
  if (user != null) {
    // If a user is logged in, render the form to add a new post
    ctx.response.body = render.newPost();
  } else {
    // If no user is logged in, render a failure message
    ctx.response.body = render.fail();
  }
}

// Route handler for displaying a single post
async function show(ctx) {
  const pid = ctx.params.id;
  // Retrieve a specific post from the database based on the provided post ID
  let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`);
  let post = posts[0];
  console.log('show:post=', post);
  // If the post exists, render the post; otherwise, throw a 404 error
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = render.show(post);
}

// Route handler for creating a new post
async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    var post = await parseFormBody(body);
    console.log('create:post=', post);
    var user = await ctx.state.session.get('user');
    if (user != null) {
      // If a user is logged in, insert the new post into the database
      sqlcmd("INSERT INTO posts (username, title, body) VALUES (?, ?, ?)", [user.username, post.title, post.body]);  
    } else {
      // If no user is logged in, throw a 404 error
      ctx.throw(404, 'not login yet!');
    }
    // Redirect to the home page after creating the post
    ctx.response.redirect('/');
  }
}

// Start the server
console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
app.use(await rateLimit);
