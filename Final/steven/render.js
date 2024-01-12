export function layout(title, content, user) {
    return `
      <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-zoF5xaUrnT5Vps1ttX2iCP6B6yA1keRdB9Qo1uWEs21F9vRoLybpBm8xD5NngA6gPLFV/hgtfJC8ed8Cq58wuQ==" crossorigin="anonymous" />
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }
  
          header {
            background-color: #4285f4;
            color: #fff;
            text-align: center;
            padding: 1em 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
  
          header a {
            text-decoration: none;
            color: #fff;
            padding: 0.5em 1em;
            transition: background-color 0.3s ease;
          }
  
          header a:hover {
            background-color: #3367d6;
          }
  
          main {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          form {
            text-align: center;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 20px;
          }
  
          form input {
            width: calc(100% - 20px);
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
  
          form input[type=submit], button {
            background-color: #4285f4;
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }
  
          form input[type=submit]:hover, button:hover {
            background-color: #3367d6;
            transform: scale(1.05);
          }
  
          a {
            color: #4285f4;
            text-decoration: none;
          }
  
          a:hover {
            text-decoration: underline;
          }
  
          .add-contact-button {
            background-color: #4caf50;
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            margin-top: 20px; /* Adjust margin as needed */
          }
  
          .add-contact-button:hover {
            background-color: #45a049;
            transform: scale(1.05);
          }
        </style>
      </head>   
      <body>
        <header>
          <div>
            <button onclick="window.location.href='/'">Home</button>
          </div>
          <h1>${title}</h1>
          <div>
            ${user ? `<button onclick="window.location.href='/logout'">Logout</button>` : `<button onclick="window.location.href='/login'">Login</button>`}
          </div>
        </header>
        <main>
          <section id="content">
            ${content}
          </section>
        </main>
      </body>
      </html>
    `;
  }
    
    
    export function loginUi() {
      return layout('Login', `
        <form action="/login" method="post">
          <input type="text" placeholder="Username" name="username">
          <input type="password" placeholder="Password" name="password">
          <input type="submit" value="Login">
        </form>
        <p>New User? <a href="/signup">Create an account</a></p>
      `);
    }
    
    export function signupUi() {
      return layout('Signup', `
        <form action="/signup" method="post">
          <input type="text" placeholder="Username" name="username">
          <input type="password" placeholder="Password" name="password">
          <input type="text" placeholder="E-mail" name="email">
          <input type="submit" value="Signup">
        </form>
      `);
    }
    
    export function success() {
      return layout('Success!', `
        You may <a href="/">view all Contacts</a> / <a href="/login">login</a> again!
      `);
    }
    
    export function fail() {
      return layout('Fail!', `
        You may <a href="/">view all Contacts</a> or <a href="JavaScript:window.history.back()">go back</a>!
      `);
    }
    
    export function userNotFound() {
      return layout('User Not Found!', `
        The provided username does not exist. Please check your username and try again.
        <p>You may <a href="/">view all Contacts</a> or <a href="JavaScript:window.history.back()">go back</a>!
      `);
    }
    
  // ...
  
  export function list(posts, user) {
    let list = posts.map(post => {
      const deleteLink = (user && post.username === user.username)
        ? ` | <a href="/contact/delete/${post.id}"><i class="fas fa-trash-alt"></i> Delete</a>`
        : '';
  
      return `
        <li>
          <h2><a href="/contact/${post.id}">${post.title} -- by ${post.username}</a></h2>
          <p>
            <a href="/contact/${post.id}">View contact</a>
            ${deleteLink}
          </p>
        </li>
      `;
    });
  
    let content = `
      <h1>Contacts</h1>
      <div id="search-bar">
        <form action="/search" method="post">
          <input type="text" placeholder="Search Contacts" name="name" required>
          <input type="submit" value="Search">
        </form>
      </div>
      <p>${(user == null) ? '<a href="/login">Login</a> to Add a Contact!' : `Welcome ${user.username}!`}</p>
      <button onclick="window.location.href='/contact/new'" class="add-contact-button">Add a Contact</button> <!-- Add this line -->
      <p>There are <strong>${posts.length}</strong> Contacts!</p>
      <ul id="posts">
        ${list.join('\n')}
      </ul>
    `;
  
    return layout('Directory', content, user); // Pass user to layout function
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
        <button onclick="window.location.href='/contact/new'" class="add-contact-button">Add a Contact</button>
      `);
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
        <h1>Delete Confirmation</h1>
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