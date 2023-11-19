export function home() {
  return layout('Welcome to Our Website', `
    <h1>Welcome to Our Website</h1>
    <p>Explore our platform and sign up today!</p>
    <p><a href="/signup">Sign Up</a> | <a href="/signin">Sign In</a></p>
  `);
}

export function signUpForm() {
  return layout('Sign Up', `
    <h1>Sign Up</h1>
    <form action="/signup" method="post">
      <p><input type="text" placeholder="Name" name="name" required></p>
      <p><input type="password" placeholder="Password" name="password" required></p>
      <p><input type="submit" value="Sign Up"></p>
    </form>
  `);
}

export function signInForm() {
  return layout('Sign In', `
    <h1>Sign In</h1>
    <form action="/signin" method="post">
      <p><input type="text" placeholder="Name" name="name" required></p>
      <p><input type="password" placeholder="Password" name "password" required></p>
      <p><input type="submit" value="Sign In"></p>
    </form>
  `);
}

export function signInSuccess(username) {
  return layout(`${username} Sign In Success`, `
    <h1>${username} Sign In Success</h1>
    <p>You have successfully signed in as ${username}.</p>
    <p><a href="/">Go to Home</a></p>
  `);
}

export function signUpFailure() {
  return layout('Sign Up Failure', `
    <h1>Sign Up Failure</h1>
    <p>Username already taken. Please <a href="/signup">try another</a>.</p>
  `);
}

export function signInFailure() {
  return layout('Sign In Failure', `
    <h1>Sign In Failure</h1>
    <p>Invalid username or password. Please <a href="/signin">try again</a>.</p>
  `);
}

export function signUpSuccess() {
  return layout('Sign Up Success', `
    <h1>Sign Up Success</h1>
    <p>Your account has been created successfully. You can now <a href="/signin">Sign In</a>.</p>
  `);
}

function layout(title, content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .container {
          width: 100%;
          max-width: 400px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        input[type="submit"] {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }

        input[type="submit"]:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
      </header>
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
}