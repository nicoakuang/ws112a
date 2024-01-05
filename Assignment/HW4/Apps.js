  // Apps.js
  import { Application, Router } from "https://deno.land/x/oak/mod.ts";
  import * as render from './Renders.js';

  const users = []; // Array untuk menyimpan data pengguna yang mendaftar
  const router = new Router();

  router
    .get('/', home)
    .get('/signup', showSignUpForm)
    .post('/signup', signUp)
    .get('/signin', showSignInForm)
    .post('/signin', signIn);

  const app = new Application();
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
        // Jika SignIn berhasil, arahkan ke halaman Home dengan notifikasi
        ctx.response.body = render.signInSuccess();
      } else {
        ctx.response.body = render.signInFailure();
      }
    }
  }

  console.log('Server is running at http://127.0.0.1:8000');
  await app.listen({ port: 8000 });