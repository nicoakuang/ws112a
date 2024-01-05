//by github.com/nicoakuang

// Import required modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './Renders.js';

// Array to store registered user data
const users = [];
const router = new Router();

// Define routes and their handlers
router
  .get('/', home)
  .get('/signup', showSignUpForm)
  .post('/signup', signUp)
  .get('/signin', showSignInForm)
  .post('/signin', signIn);

// Create an application instance
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Route Handlers

// Display the home page
async function home(ctx) {
  ctx.response.body = render.home();
}

// Display the sign-up form
async function showSignUpForm(ctx) {
  ctx.response.body = render.signUpForm();
}

// Handle the sign-up process
async function signUp(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const user = {};
    for (const [key, value] of pairs) {
      user[key] = value;
    }

    // Check if the username is already taken
    const isUsernameTaken = users.some(existingUser => existingUser.name === user.name);

    if (isUsernameTaken) {
      // If the username is taken, display an error message
      ctx.response.body = render.signUpFailure();
    } else {
      // If the username is available, add the user to the array and display success message
      users.push(user);
      ctx.response.body = render.signUpSuccess();

      // After successful sign-up, redirect to the sign-in page
      ctx.response.redirect('/signin');
    }
  }
}

// Display the sign-in form
async function showSignInForm(ctx) {
  ctx.response.body = render.signInForm();
}

// Handle the sign-in process
async function signIn(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const inputUser = {};
    for (const [key, value] of pairs) {
      inputUser[key] = value;
    }
    
    // Check if a user with the matching name exists in the database
    const user = users.find(u => u.name === inputUser.name);
    if (user && user.password === inputUser.password) {
      // If sign-in is successful, display success message
      ctx.response.body = render.signInSuccess();
    } else {
      // If sign-in fails, display failure message
      ctx.response.body = render.signInFailure();
    }
  }
}

// Start the application and listen on port 8000
console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
