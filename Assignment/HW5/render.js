// render.js
// github.com/nicoakuang
// Function to generate HTML layout with dynamic title and content
export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      /* Styling for the HTML document */
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }

      h1 {
        font-size: 2em;
      }

      h2 {
        font-size: 1.2em;
      }

      #posts {
        margin: 0;
        padding: 0;
      }

      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }

      #posts li:last-child {
        border-bottom: none;
      }

      textarea {
        width: 500px;
        height: 300px;
      }

      input[type=text],
      textarea {
        /* Styling for text input and textarea */
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }

      input[type=text] {
        width: 500px;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `;
}

// Function to generate HTML for displaying a list of posts
export function list(posts) {
  let list = [];
  for (let post of posts) {
    // Generate HTML for each post in the list
    list.push(`
    <li>
      <h2>${post.title}</h2>
      <p><a href="/post/${post.id}">Read post</a></p>
    </li>
    `);
  }
  // Generate HTML for the entire list of posts
  let content = `
  <h1>Posts</h1>
  <p>You have <strong>${posts.length}</strong> posts!</p>
  <p><a href="/post/new">Create a Post</a></p>
  <p><a href="/search/search">Search post</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `;
  // Return the final HTML layout
  return layout('Posts', content);
}

// Function to generate HTML for creating a new post
export function newPost() {
  // Generate HTML for the form to create a new post
  return layout('New Post', `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><textarea placeholder="Contents" name="body"></textarea></p>
    <p><input type="submit" value="Create"></p>
  </form>
  `);
}

// Function to generate HTML for displaying a single post
export function show(post) {
  // Generate HTML to display a single post
  return layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `);
}

// Function to generate HTML for the search form
export function search() {
  return layout(
    "Search Contacts",
    `
    <h1>Search post</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="Name to search" name="name"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    `
  );
}

// Function to generate HTML for "not found" page
export function not_found() {
  return layout(
    "Contact Not Found",
    `
    <h1>Contact Not Found</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="post to search" name="name"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    <h1>Not Found</h1>
    `
  );
}

// Function to generate HTML for displaying found post
export function found(newPost, postMessage) {
  return layout(
    "Contact Found",
    `
    <h1>Contact Found</h1>
    <form action="/search" method="post">
      <p><input type="text" placeholder="post to search" name="name"></p>
      <p><input type="submit" value="Search"></p>
    </form>
    <h1>Title: ${newPost}</h1>
    <p>Content: ${postMessage}</p>
    `
  );
}