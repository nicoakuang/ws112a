// Renders.js
export function home() {
  return layout('',
    `
    <h1>Welcome to Our Website</h1>
    <p>Explore our platform and sign up today!</p>
    <p><a href="/signup">Sign Up</a> | <a href="/signin">Sign In</a></p>
    `
  );
}

export function signUpForm() {
  return layout('',
    `
    <h1>Sign Up</h1>
    <form action="/signup" method="post">
      <p><input type="text" placeholder="Name" name="name" required></p>
      <p><input type="password" placeholder="Password" name="password" required></p>
      <p><input type="submit" value="Sign Up"></p>
    </form>
    `
  );
}

export function signInForm() {
  return layout('',
    `
    <h1>Sign In</h1>
    <form action="/signin" method="post">
      <p><input type="text" placeholder="Name" name="name" required></p>
      <p><input type="password" placeholder="Password" name="password" required></p>
      <p><input type="submit" value="Sign In"></p>
    </form>
    `
  );
}

export function signInSuccess() {
  return layout('',
    `
    <h1>Sign In Success</h1>
    <p>You have successfully signed in.</p>
    <p><a href="/">Go to Home</a></p>
    `
  );
}

export function signInFailure() {
  return layout('',
    "Sign In Failure",
    `
    <h1>Sign In Failure</h1>
    <p>Invalid username or password. Please <a href="/signin">try again</a>.</p>
    `
  );
}

export function signUpSuccess() {
  return layout('',
    "SignUp Success",
    `
    <h1>SignUp Success</h1>
    <p>Your account has been created successfully. You can now <a href="/signin">Sign In</a>.</p>
    
    <!-- JavaScript untuk menampilkan popup -->
    <script>
      // Fungsi untuk menampilkan popup
      function showPopup() {
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.innerHTML = "<p>Success Created Account</p>";
        
        document.body.appendChild(popup);
        
        // Hilangkan popup setelah beberapa detik
        setTimeout(function() {
          popup.remove();
        }, 3000); // Popup akan hilang setelah 3 detik
      }
      
      // Panggil fungsi showPopup() saat halaman dimuat
      window.onload = showPopup;
    </script>
    `
  );
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
  background-color: #f0f0f0; /* Warna latar belakang */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center; /* Mengatur margin menjadi di tengah */
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff; /* Warna latar belakang kotak */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Efek bayangan */
}

h1 {
  font-size: 24px;
  color: #333; /* Warna teks utama */
  margin-bottom: 20px; /* Jarak antara judul dan elemen lain */
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px; /* Jarak antara input fields */
  border: 1px solid #ddd; /* Garis tepi input fields */
  border-radius: 4px;
  font-size: 16px;
}

input[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #007bff; /* Warna latar belakang tombol */
  color: #fff; /* Warna teks tombol */
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #0056b3; /* Warna latar belakang tombol saat dihover */
}
    </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
      </header>
      <container>
        ${content}
      </container>
    </body>
    </html>
  `;
}