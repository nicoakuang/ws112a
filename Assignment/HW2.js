//by github.com/nicoakuang

// import the module 
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// Create an instance of the Oak Application
const app = new Application();

// Define a Map to store room information
const room = new Map();
room.set("e320", {
  "Room": "e320",
  "Function": "Multimedia Classroom",
});
room.set("e319", {
  "Room": "e319",
  "Function": "Embedded Lab",
});

// Create a router instance
const router = new Router();

// Define routes and their handlers
router
  .get("", (context) => {
    // Respond with information about available routes
    context.response.body = `
    <html>
        <body>
          <p>/nqu/ Displays a hyperlink to National Quemoy University</p>
          <p>/nqu/csie/ Displays a hyperlink to National Quemoy University Department of Computer Science and Information Engineering</p>
          <p>/to/nqu/ Redirects to National Quemoy University website</p>
          <p>/to/nqu/csie/ Redirects to National Quemoy University Department of Computer Science and Information Engineering</p>
        </body>
    </html>`;
  })
  .get("/nqu", (context) => {
    // Respond with a hyperlink to National Quemoy University
    context.response.body = `
    <html>
        <body>
            <a href="https://www.nqu.edu.tw/">National Quemoy University</a>
        </body>
    </html>`;
  })
  .get("/nqu/csie", (context) => {
    // Respond with a hyperlink to National Quemoy University Department of Computer Science and Information Engineering
    context.response.body = `
    <html>
        <body>
            <a href="https://csie.nqu.edu.tw/">National Quemoy University Department of Computer Science and Information Engineering</a>
        </body>
    </html>`;
  })
  .get("/room/:id", (context) => {
    // Handle requests for room information based on room ID
    if (context.params && context.params.id && room.has(context.params.id)) {
        context.response.body = room.get(context.params.id);
    }
  })
  .get("/to/nqu", (context) => {
    // Redirect to National Quemoy University
    context.response.redirect('https://www.nqu.edu.tw/')
  })
  .get("/to/nqu/csie", (context) => {
    // Redirect to National Quemoy University Department of Computer Science and Information Engineering
    context.response.redirect('https://csie.nqu.edu.tw/')
  });

// Attach the router to the Oak Application
app.use(router.routes());
app.use(router.allowedMethods());

// Start the application and listen on port 8000
console.log('Started at: http://127.0.0.1:8000')
await app.listen({ port: 8000 });
