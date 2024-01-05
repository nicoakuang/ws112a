var R = {};

// Event handler for hash changes in the URL
window.onhashchange = async function () {
  var r;
  // Split the hash into tokens based on '/'
  var tokens = window.location.hash.split('/');
  
  // Check the first token in the hash
  switch (tokens[0]) {
    case '#show':
      // Fetch a specific post based on the ID in the hash
      r = await window.fetch('/post/' + tokens[1]);
      // Parse the JSON response and display the post
      let post = await r.json();
      R.show(post);
      break;
    case '#new':
      // Display a form for creating a new post
      R.new();
      break;
    default:
      // Fetch and display the list of all posts
      r = await window.fetch('/list');
      let posts = await r.json();
      R.list(posts);
      break;
  }
};

// Trigger the hash change event on page load
window.onload = function () {
  window.onhashchange();
};

// Function to set the title and content of the page
R.layout = function (title, content) {
  document.querySelector('title').innerText = title;
  document.querySelector('#content').innerHTML = content;
};

// Function to render a list of posts
R.list = function (posts) {
  let list = [];
  // Loop through each post and create HTML for the list
  for (let post of posts) {
    list.push(`
      <li>
        <h2>${post.title}</h2>
        <p><a id="show${post.id}" href="#show/${post.id}">Read post</a></p>
      </li>
    `);
  }
  // Create HTML for the entire page content
  let content = `
    <h1>Posts</h1>
    <p>You have <strong>${posts.length}</strong> posts!</p>
    <p><a id="createPost" href="#new">Create a Post</a></p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
  `;
  // Call the layout function to set the page title and content
  return R.layout('Posts', content);
};

// Function to render a form for creating a new post
R.new = function () {
  return R.layout('New Post', `
    <h1>New Post</h1>
    <p>Create a new post.</p>
    <form>
      <p><input id="title" type="text" placeholder="Title" name="title"></p>
      <p><textarea id="body" placeholder="Contents" name="body"></textarea></p>
      <p><input id="savePost" type="button" onclick="R.savePost()" value="Create"></p>
    </form>
  `);
};

// Function to render a specific post
R.show = function (post) {
  return R.layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `);
};

// Function to save a new post
R.savePost = async function () {
  let title = document.querySelector('#title').value;
  let body = document.querySelector('#body').value;
  // Fetch to create a new post
  let r = await window.fetch('/post', {
    body: JSON.stringify({title: title, body: body}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // Change the URL hash to '#list' after creating a post
  window.location.hash = '#list';
  return r;
};
