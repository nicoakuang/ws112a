// Import necessary modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'; // Import render module
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { RateLimiter } from "https://deno.land/x/oak_rate_limit/mod.ts";
import { MapStore } from "https://deno.land/x/oak_rate_limit/mod.ts";

// Create SQLite database and define tables
const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const rateLimit = RateLimiter({
    store: new MapStore(), // Using MapStore by default.
    windowMs: 50000, // Window for the requests that can be made in milliseconds.
    max: 5000, // Max requests within the predefined window.
    headers: true, // Default true, it will add the headers X-RateLimit-Limit, X-RateLimit-Remaining.
    message: "Too many requests, please try again later.", // Default message if rate limit reached.
    statusCode: 429, // Default status code if rate limit reached.
  })

  // Use the rate limit middleware and session middleware
  app.use(await rateLimit);
  app.use(Session.initMiddleware());

// Create an instance of the Oak router
const router = new Router();

// Define routes for the application
router
  .get('/', list)         // Route to list posts
  .get('/signup', signupUi) // Route to display signup UI
  .post('/signup', signup)  // Route to handle signup
  .post('/login', login)    // Route to handle login
  .get('/login', loginUi)   // Route to display login UI
  .get('/logout', logout)   // Route to handle logout
  .get('/post/new', add)    // Route to display new post form
  .get('/post/:id', show)   // Route to display a specific post
  .post('/post', create);   // Route to handle post creation

// Create an instance of the Oak application
const app = new Application()
app.use(await rateLimit);
app.use(Session.initMiddleware()) // Initialize session middleware
app.use(router.routes());          // Use the defined routes
app.use(router.allowedMethods());  // Use allowed methods

// Function to block an IP address
function blockIP(ip) {
  fail2ban.blockIP(ip);
}

// Function to execute SQL commands
function sqlcmd(sql, arg1) {
  console.log('sql:', sql)
  try {
    var results = db.query(sql, arg1)
    console.log('sqlcmd: results=', results)
    return results
  } catch (error) {
    console.log('sqlcmd error: ', error)
    throw error
  }
}

// Function to query posts from the database
function postQuery(sql) {
  let list = []
  for (const [id, username, title, body] of sqlcmd(sql)) {
    list.push({id, username, title, body})
  }
  console.log('postQuery: list=', list)
  return list
}

// Function to query users from the database
function userQuery(sql) {
  let list = []
  for (const [id, username, password] of sqlcmd(sql)) {
    list.push({id, username, password})
  }
  console.log('userQuery: list=', list)
  return list
}

// Function to parse form data
async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

// Route handling functions
async function signupUi(ctx) {
  ctx.response.body = render.signupUi();
}

async function signup(ctx) {
  const body = ctx.request.body();
  const user = await parseFormBody(body);

  if (!user.username || !user.password) {
    ctx.response.body = render.fail("Please fill in all the fields.");
    return;
  }

  if (body.type === "form") {
    const user = await parseFormBody(body);
    // Check if the username already exists in the database
    var dbUsers = userQuery(`SELECT id, username, password FROM users WHERE username='${user.username}'`);
    if (dbUsers.length === 0) {
      // If the username doesn't exist, insert the new user into the database
      sqlcmd("INSERT INTO users (username, password) VALUES (?, ?)", [user.username, user.password]);
      ctx.response.body = render.success();
    } else 
      ctx.response.body = render.fail();
  }
}

async function loginUi(ctx) {
  ctx.response.body = render.loginUi();
}

async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const user = await parseFormBody(body);
    const dbUsers = userQuery(`SELECT id, username, password FROM users WHERE username='${user.username}'`)

    // Periksa kegagalan login dalam sesi
    let userSession = (await ctx.state.session.get('user')) || { loginAttempts: 0 };

    if (dbUser.password === user.password) {
      // Reset jumlah kegagalan login jika berhasil login
      userSession.loginAttempts = 0;
      ctx.state.session.set('user', user);
      console.log('session.user=', await ctx.state.session.get('user'));
      ctx.response.redirect('/');
    } else {
      // Tambahkan kegagalan login dalam sesi
      userSession.loginAttempts += 1;

      if (userSession.loginAttempts >= 3) {
        // Panggil fungsi untuk memblokir IP melalui Fail2Ban
        const clientIP = ctx.request.ip;
        blockIP(clientIP);
      }

      ctx.state.session.set('user', userSession);

      // Hitung sisa percobaan login yang tersisa
      const loginAttemptsLeft = Math.max(0, 3 - userSession.loginAttempts);

      // Tampilkan pesan kegagalan login dengan informasi sisa percobaan
      ctx.response.body = render.fail(loginAttemptsLeft);
    }
  }
}


// Route handling function for user logout
async function logout(ctx) {
  // Clear the 'user' key in the session, effectively logging the user out
  ctx.state.session.set('user', null);
  // Redirect to the home page after logout
  ctx.response.redirect('/');
}

// Route handling function to list posts
async function list(ctx) {
 // Query all posts from the database
 let posts = postQuery("SELECT id, username, title, body FROM posts");
 console.log('list:posts=', posts);
 // Render the list view, passing the posts and user information from the session
 ctx.response.body = render.list(posts, await ctx.state.session.get('user'));
}

// Route handling function to display new post form
async function add(ctx) {
 // Get the user from the session
 var user = await ctx.state.session.get('user');
 // Check if the user is logged in
 if (user != null) {
   // Render the new post form
   ctx.response.body = render.newPost();
 } else {
   // Render a failure message if the user is not logged in
   ctx.response.body = render.fail();
 }
}

// Route handling function to display a specific post
async function show(ctx) {
 // Get the post ID from the route parameters
 const pid = ctx.params.id;
 // Query a specific post from the database based on the ID
 let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`);
 let post = posts[0];
 console.log('show:post=', post);
 // Throw a 404 error if the post is not found
 if (!post) ctx.throw(404, 'invalid post id');
 // Render the view for the specific post
 ctx.response.body = render.show(post);
}

// Route handling function to create a new post
async function create(ctx) {
 // Get the request body
 const body = ctx.request.body();
 // Check if the request type is a form submission
 if (body.type === "form") {
   // Parse form data to get post details
   var post = await parseFormBody(body);
   console.log('create:post=', post);
   // Get the user from the session
   var user = await ctx.state.session.get('user');
   // Check if the user is logged in
   if (user != null) {
     console.log('user=', user);
     // Insert the new post into the database
     sqlcmd("INSERT INTO posts (username, title, body) VALUES (?, ?, ?)", [user.username, post.title, post.body]);
   } else {
     // Throw a 404 error if the user is not logged in
     ctx.throw(404, 'not login yet!');
   }
   // Redirect to the home page after post creation
   ctx.response.redirect('/');
 }
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });
app.use(await rateLimit);