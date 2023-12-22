import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

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
  
const app = new Application()
app.use(Session.initMiddleware())
app.use(router.routes());
app.use(router.allowedMethods());

function blockIP(ip) {
  fail2ban.blockIP(ip);
}

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
  ctx.response.body = render.signupUi();
}

async function signup(ctx) {
  const body = ctx.request.body();
  const user = await parseFormBody(body);

  if (!user.username || !user.password || !user.email) {
    ctx.response.body = render.fail("Please fill in all the fields.");
    return;
  }

  if (body.type === "form") {
    const dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);

    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
      ctx.response.body = render.success();
    } else {
      ctx.response.body = render.fail();
    }
  }
}

async function loginUi(ctx) {
  ctx.response.body = render.loginUi();
}

async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const user = await parseFormBody(body);
    const dbUsers = userQuery(`SELECT id, username, password, email FROM users WHERE username='${user.username}'`);
    const dbUser = dbUsers[0];

    // Periksa kegagalan login dalam sesi
    let userSession = (await ctx.state.session.get('user')) || { loginAttempts: 0 };

    if (dbUser && dbUser.password === user.password) {
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


async function logout(ctx) {
   ctx.state.session.set('user', null)
   ctx.response.redirect('/')
}

async function list(ctx) {
  let posts = postQuery("SELECT id, username, title, body FROM posts")
  console.log('list:posts=', posts)
  ctx.response.body = await render.list(posts, await ctx.state.session.get('user'));
}

async function add(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPost();
  } else {
    ctx.response.body = render.fail()
  }
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

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });