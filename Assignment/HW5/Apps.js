// Apps.js
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Session } from "https://deno.land/x/session/mod.ts";

import * as render from './Renders.js';

const users = []; // Array untuk menyimpan data pengguna yang mendaftar
const router = new Router();
const app = new Application();

// Inisialisasi session
const session = new Session({ framework: "oak" });
await session.init();

// Tambahkan session middleware
await app.use(session.use()(session));

router
  .get('/', home)
  .get('/signup', showSignUpForm)
  .post('/signup', signUp)
  .get('/signin', showSignInForm)
  .post('/signin', signIn);

app.use(router.routes());
app.use(router.allowedMethods());

async function home(ctx) {
  ctx.response.body = await render.home();
}

async function showSignUpForm(ctx) {
  ctx.response.body = await render.signUpForm();
}

async function signUp(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const user = {};
    for (const [key, value] of pairs) {
      user[key] = value;
    }

    // Periksa apakah username telah digunakan sebelumnya
    const isUsernameTaken = users.some(existingUser => existingUser.name === user.name);

    if (isUsernameTaken) {
      // Jika username telah digunakan, kirim pesan kesalahan
      ctx.response.body = await render.signUpFailure();
    } else {
      users.push(user);
      ctx.response.body = await render.signUpSuccess();

      // Setelah SignUp berhasil, arahkan ke halaman SignIn
      ctx.response.redirect('/signin');
    }
  }
}

async function showSignInForm(ctx) {
  ctx.response.body = await render.signInForm();
}

async function signIn(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const inputUser = {};
    for (const [key, value] of pairs) {
      inputUser[key] = value;
    }

    // Periksa apakah pengguna dengan nama yang sesuai ada dalam database
    const user = users.find(u => u.name === inputUser.name);
    if (user && user.password === inputUser.password) {
      // Jika SignIn berhasil, set session dengan username
      ctx.state.session.set("user", inputUser.name);

      // Redirect ke halaman Home dengan notifikasi
      ctx.response.body = await render.signInSuccess(inputUser.name);
    } else {
      ctx.response.body = await render.signInFailure();
    }
  }
}

console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
