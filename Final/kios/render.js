export function layout(title, content) {
    return `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
            margin: 0;
          }
  
          h1 {
            font-size: 2em;
            color: #333;
          }
  
          h2 {
            font-size: 1.5em;
            color: #333;
          }
  
          #posts {
            list-style: none;
            padding: 0;
          }
  
          #posts li {
            margin: 20px 0;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          #posts li:last-child {
            margin-bottom: 0;
          }
  
          textarea, input[type=text], input[type=password] {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
          }
  
          input[type=submit] {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
          }
  
          input[type=submit]:hover {
            background-color: #45a049;
          }
  
          a {
            color: #1e87f0;
            text-decoration: none;
          }
  
          a:hover {
            text-decoration: underline;
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
      You may <a href="/">view all Contacts</a> / <a href="/login">login</a> again !
      `)
    }
    
    export function fail() {
      return layout('Fail', `
      <h1>Fail!</h1>
      You may <a href="/">view all Contacts</a> or <a href="JavaScript:window.history.back()">go back</a> !
      `)
    }
  
    export function userNotFound() {
      return layout('User Not Found', `
        <h1>User Not Found</h1>
        The provided username does not exist. Please check your username and try again.
        You may <a href="/">view all Contacts</a> or <a href="JavaScript:window.history.back()">go back</a> !
      `);
    }  
    
    export function list(posts, user) {
      let list = [];
      for (let post of posts) {
        const deleteLink = (user && post.username === user.username)
          ? ` | <a href="/contact/delete/${post.id}">Delete</a>`
          : '';
    
        list.push(`
          <li>
            <h2>${post.title} -- by ${post.username}</h2>
            <p>
              <a href="/contact/${post.id}">View contact</a>
              ${deleteLink}
            </p>
          </li>
        `);
      }
    
      let content = `
      <h1>Contacts</h1>
      <p>${(user==null)?'<a href="/login">Login</a> to Add a Contact!':'Welcome '+user.username+', You may <a href="/contact/new">Add a Contact</a> or <a href="/logout">Logout</a> !'}</p>
      <p>There are <strong>${posts.length}</strong> Contacts!</p>
      <p><a href="/contact/search">Search Contacts</p>
      <ul id="posts">
        ${list.join('\n')}
      </ul>
      `
    
      return layout('Directory', content)
    }
    
    
    
    export function newPost() {
      return layout('New Contact', `
      <h1>New Contact</h1>
      <p>Add a new contact.</p>
      <form action="/contact" method="post">
        <p><input type="text" placeholder="Name" name="title"></p>
        <p><textarea placeholder="Tel" name="body"></textarea></p>
        <p><input type="submit" value="Create"></p>
      </form>
      `)
    }
  
    export function search() {
      return layout('Query Contact person', `
      <h1>Search Contacts</h1>
      <form action="/search" method="post">
        <p><input type="text" placeholder="Name" name="name" required></p>
        <p><input type="submit" value="Search"></p>
      </form>
      `)
    }
  
    export function found(resultHtml) {
      return layout('Search results', `
        <h1>Search Contacts</h1>
        <form action="/search" method="post">
          <p><input type="text" placeholder="Name" name="name"></p>
          <p><input type="submit" value="Search"></p>
        </form>
        ${resultHtml}
      `);
    }
    
    
    export function not_found() {
      return layout('Search results',
        `
      <h1>Search Contacts</h1>
      <form action="/search" method="post">
        <p><input type="text" placeholder="Name" name="name"></p>
        <p><input type="submit" value="Search"></p>
      </form>
      <h1>Not Found</h1>
      `,
      );
    }
  
    export function deleteConfirmation(post) {
      return layout('Confirm Deletion', `
        <h1>Confirm Deletion</h1>
        <p>Are you sure you want to delete the contact?</p>
        <p><strong>${post.title}</strong> -- by ${post.username}</p>
        <form action="/contact/delete/${post.id}" method="post">
        <p><input type="submit" value="Delete"></p>
        </form>
      `);
    }
  
    
    export function show(post) {
      const deleteLink = `<a href="/contact/delete/${post.id}">Delete</a>`;
      return layout(post.title, `
        <h1>${post.title} -- by ${post.username}</h1>
        <p>${post.body}</p>
        <p>${deleteLink}</p>
      `);
    }
    
    