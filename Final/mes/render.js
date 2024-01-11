export function layout(title, content) {
    return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
            padding: 40px 400px;
            font: 16px 'Helvetica Neue', sans-serif;
            text-align: center; /* 將文本置中 */
            background: #E6E6F2
        }
        
        h1 {
            font-size: 2.5em; /* 增大標題字體大小 */
            color: #333; /* 修改字體顏色 */
        }
        
        h2 {
            font-size: 1.5em; /* 增大副標題字體大小 */
            color: #555; /* 修改字體顏色 */
        }

        #posts {
          margin: 100px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        
        #posts li {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        #posts li:last-child {
          border-bottom: none;
        }        
        
        textarea {
            width: 100%;
            max-width: 400px; /* 使 textarea 充滿容器並限制最大寬度 */
            height: 150px; /* 減少 textarea 的高度 */
            resize: vertical; /* 垂直方向可調整大小 */
        }
        
        input[type=text],
        input[type=password],
        textarea {
            width: 100%;
            border: 1px solid black;
            border-radius: 10px;
            background: transparent;
            backdrop-filter: blur(8px);
            padding: 10px;
            font-size: 1em;
            margin-bottom: 10px;
            box-sizing: border-box; /* 防止元素寬度超出容器 */
            margin: 0 auto 10px; 
        }
        
        input[type=text],
        input[type=password] {
            max-width: 400px; /* 限制文字輸入框的最大寬度 */
        }
        
        /* 按鈕樣式 */
        input[type=submit] {
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            margin-bottom: 0;
        }
        
        input[type=submit]:hover {
            background-color: #2980b9;
        }
        
      </style>
    </head>
    <body>
      <section id="content">
        ${content}
      </section>
    </body>
    </html>
    `
  }
  
  export function loginUi() {
    return layout('登入', `
    <h1>登入</h1>
    <form action="/login" method="post">
      <p><input type="text" placeholder="使用者名稱" name="username"></p>
      <p><input type="password" placeholder="密碼" name="password"></p>
      <p><a href="/signup">建立新用戶</p>
      <p><input type="submit" value="登入"></p>
    </form>
    `)
  }
  
  export function signupUi() {
    return layout('註冊', `
    <h1>註冊</h1>
    <form action="/signup" method="post">
      <p><input type="text" placeholder="使用者名稱" name="username"></p>
      <p><input type="password" placeholder="密碼" name="password"></p>
      <p><input type="text" placeholder="信箱" name="email"></p>
      <p><a href="/login">返回登入頁面</p>
      <p><input type="submit" value="註冊"></p>
    </form>
    `)
  }
  
  export function success() {
    return layout('註冊成功', `
    <h1>註冊成功!</h1>
    前往 <a href="/login">登入</a> 頁面
    `)
  }
  
  export function fail() {
    return layout('失敗', `
    <h1>失敗!</h1>
    <a href="JavaScript:window.history.back()">返回上一頁</a>
    `)
  }
  
  export function list(posts, user) {
    console.log('list: user=', user)
    let list = []
    for (let post of posts) {
      list.push(`
      <li>
        <h2>${ post.title } -- by ${post.username}</h2>
        <p><a href="/post/${post.id}">查看貼文</a></p>
      </li>
      `)
    }
    let content = `
    <h1>貼文</h1>
    <p>${(user==null)?'<a href="/login">登入</a>來新增貼文!':'歡迎 '+user.username+', 你可以 <a href="/post/new">新增貼文</a> 或 <a href="/logout">登出</a> !'}</p>
    <p>目前有 <strong>${posts.length}</strong> 則貼文!</p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `
    return layout('Posts', content)
  }
  
  export function newPost() {
    return layout('新貼文', `
    <h1>新貼文</h1>
    <form action="/post" method="post">
      <p><input type="text" placeholder="標題" name="title"></p>
      <p><textarea placeholder="內容" name="body"></textarea></p>
      <p><input type="submit" value="確定新增"></p>
    </form>
    `)
  }
  
  export function show(post) {
    return layout(post.title, `
      <h1>${post.title} -- by ${post.username}</h1>
      <p>${post.body}</p>
    `)
  }
  
  export function userNotFound() {
    return layout('找不到用戶', `
      <h1>找不到用戶</h1>
      <p>提供的用戶名不存在。請檢查您的用戶名並重試。<a href="JavaScript:window.history.back()">返回上一頁</a></p>
    `);
  }  