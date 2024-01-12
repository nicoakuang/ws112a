export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: url("https://marketplace.canva.com/EAFKADKjVWE/1/0/1600w/canva-light-pink-simple-stay-focused-desktop-wallpaper-ORk-wLelqBg.jpg") center/cover fixed no-repeat;
        color: #ffffff;
        overflow-x: hidden;
        padding: 80px;
      }

      h1 {
        font-size: 3em;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 1.5em;
        margin-bottom: 15px;
      }

      #posts {
        margin: 0;
        padding: 0;
      }

      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        list-style: none;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
      }

      #posts li:last-child {
        border-bottom: none;
      }

      textarea {
        width: 500px;
        height: 300px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
      }

      input[type=text],
      input[type=password],
      textarea {
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        padding: 15px;
        font-size: 1em;
        margin-bottom: 10px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
      }

      input[type=text],
      input[type=password] {
        width: 100%;
      }

      input[type=submit] {
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 1.2em;
        font-weight: bold;
      }

      input[type=submit]:hover {
        background-color: #45a049;
      }

      a {
        color: #007BFF;
        text-decoration: none;
        font-weight: bold;
      }

      a:hover {
        text-decoration: underline;
      }

      /* Style untuk footer */
      footer {
        background-color: #333;
        color: #fff;
        padding: 20px;
        text-align: center;
        font-size: 1.2em;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>

    <!-- Footer section -->
    <footer>
      <p>Project by 鄭石光</p>
    </footer>
  </body>
  </html>
  `;
}

export function loginUi() {
  return layout('Login', `
  <h1>Login</h1>
  <form action="/login" method="post">
    <p><input type="text" placeholder="username" name="username"></p>
    <p><input type="password" placeholder="password" name="password"></p>
    <p><input type="submit" value="Login"></p>
    <p>New user? <a href="/signup">Create an account</p>
  </form>
  `)
}

export function signupUi() {
  return layout('Signup', `
  <h1>Signup</h1>
  <form action="/signup" method="post">
    <p><input type="text" placeholder="username" name="username"></p>
    <p><input type="password" placeholder="password" name="password"></p>
    <p><input type="text" placeholder="email" name="email"></p>
    <p><input type="submit" value="Signup"></p>
  </form>
  `)
}

export function success() {
  return layout('Success', `
  <h1>Success!</h1>
  You may <a href="/">read all Post</a> / <a href="/login">login</a> again !
  `)
}

export function fail(loginAttemptsLeft) {
  return layout('Fail', `
    <h1>Fail!</h1>
    <p>${loginAttemptsLeft} attempts left.</p>
    You may <a href="/">read all Posts</a> or <a href="JavaScript:window.history.back()">go back</a>!
  `);
}

export function list(posts, user) {
  console.log('list: user=', user)
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${ post.title } -- by ${post.username}</h2>
      <p><a href="/post/${post.id}">Read post</a></p>
    </li>
    `)
  }
  let content = `
    <h1>Posts</h1>
    ${(user == null) ? '<p><a href="/login">Login</a> to Create a Post!</p>' :
      `<p>Welcome ${user.username}, You may <a href="/post/new">Create a Post</a> or <a href="/logout">Logout</a>!</p>`}
    <p>You have <strong>${posts.length}</strong> posts!</p>
    ${(user != null) ? '<p><a href="/post/new">Create a Post</a></p>' : ''}
    <p><a href="/search/search">Search post</a></p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
  `;

  return layout('Posts', content);
}

export function newPost() {
  return layout('New Post', `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><textarea placeholder="Contents" name="body"></textarea></p>
    <p><input type="submit" value="Create"></p>
  </form>
  `)
}

export function search() {
  return layout(
    "Search Posts",
    `
    <h1>Search post</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="Post to search" name="title"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    `
  );
}

export function not_found() {
  return layout(
    "Post Not Found",
    `
    <h1>Post Not Found</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="Title to search" name="title"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    <h1>Not Found</h1>
    `
  );
}

export function show(post) {
  return layout(post.title, `
    <h1>${post.title} -- by ${post.username}</h1>
    <p>${post.body}</p>
  `)
}

export function found(newPost, postMessage) {
  return layout(
    "Post Found",
    `
    <h1>Post Found</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="post to search" name="title"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    <h1>Title: ${newPost}</h1>
    <p>Content: ${postMessage}</p>
    `
  );
}