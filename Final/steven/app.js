import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import * as render from './render.js';

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const router = new Router();

router.get('/', list)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', loginUi)
  .post('/login', login)
  .get('/logout', logout)
  .get('/contact/search', search)
  .get('/contact/new', add)
  .get('/contact/:id', show)
  .post('/contact', create)
  .post('/search', find)
  .get('/contact/delete/:id', deleteConfirmation)
  .post('/contact/delete/:id', deleteContact);

const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

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

function postQuery(sql) {
  let list = []
  for (const [id, username, title, body] of sqlcmd(sql)) {
    list.push({id, username, title, body})
  }
  console.log('postQuery: list=', list)
  return list
}

function userQuery(sql) {
  let list = []
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({id, username, password, email})
  }
  console.log('userQuery: list=', list)
  return list
}

async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

async function signupUi(ctx) {
  ctx.response.body = await render.signupUi();
}

async function signup(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`)
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success()
    } else 
      ctx.response.body = render.fail()
  }
}

async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}

async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const userCredentials = await parseFormBody(body);
    const dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${userCredentials.username}'`);
    
    if (dbUsers.length > 0) {
      const dbUser = dbUsers[0];
      if (dbUser.password === userCredentials.password) {
        await ctx.state.session.set('user', { username: dbUser.username, id: dbUser.id }); // Set the user in the session
        console.log('session.user=', await ctx.state.session.get('user'));
        ctx.response.redirect('/');
      } else {
        ctx.response.body = render.fail();
      }
    } else {
      ctx.response.body = render.userNotFound();
    }
  }
}

async function logout(ctx) {
  await ctx.state.session.set('user', null); // Clear the user in the session
  ctx.response.redirect('/');
}

async function list(ctx) {
  const posts = postQuery("SELECT id, username, title, body FROM posts");
  const user = await ctx.state.session.get('user');

  console.log('list: user=', user);
  console.log('list: posts=', posts);

  ctx.response.body = await render.list(posts, user);
}


async function add(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPost();
  } else {
    ctx.response.body = render.fail()
  }
}

async function search(ctx) {
  ctx.response.body = await render.search();
}

async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`)
  let post = posts[0]
  console.log('show:post=', post)
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var post = await parseFormBody(body)
    console.log('create:post=', post)
    var user = await ctx.state.session.get('user')
    if (user != null) {
      console.log('user=', user)
      sqlcmd("INSERT INTO posts (username, title, body) VALUES (?, ?, ?)", [user.username, post.title, post.body]);  
    } else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');
  }
}

async function find(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const searchTerm = pairs.get('name');
    const results = [];
    let posts = postQuery("SELECT id, username, title, body FROM posts");

    for (const post of posts) {
      if (post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(post);
      }
    }    

    console.log('Search Term:', searchTerm);

    if (results.length > 0) {
      const resultHtml = results.map(post => `<h1>Name：${post.title}</h1><p>Tel：${post.body}</p>`).join('');
      ctx.response.body = await render.found(resultHtml);
    } else {
      ctx.response.body = await render.not_found();
    }
  } 
}

async function deleteConfirmation(ctx) {
  const pid = ctx.params.id;
  const post = postQuery(`SELECT id, username, title, body FROM posts WHERE id=${pid}`)[0];

  if (!post) {
    ctx.throw(404, 'Invalid post id');
  }

  ctx.response.body = await render.deleteConfirmation(post);
}

async function deleteContact(ctx) {
  const pid = ctx.params.id;
  sqlcmd("DELETE FROM posts WHERE id=?", [pid]);

  ctx.response.redirect('/');
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });