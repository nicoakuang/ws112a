import { Application, Router } from "https://deno.land/x/oak/mod.ts";
//by github.com/nicoakuang
const room = new Map();
room.set("e320", {
  "Room": "e320",
  "Function": "Multimedia Classroom",
});
room.set("e319", {
  "Room": "e319",
  "Function": "Embedded Lab",
});

const router = new Router();

router
  .get("", (context) => {
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
    context.response.body = `
    <html>
        <body>
            <a href="https://www.nqu.edu.tw/">National Quemoy University</a>
        </body>
    </html>`;
  })
  .get("/nqu/csie", (context) => {
    context.response.body = `
    <html>
        <body>
            <a href="https://csie.nqu.edu.tw/">National Quemoy University Department of Computer Science and Information Engineering</a>
        </body>
    </html>`;
  })
  .get("/room/:id", (context) => {
    console.log('id=', context.params.id)
    if (context.params && context.params.id && room.has(context.params.id)) {
        console.log('room=', room.get(context.params.id))
        context.response.body = room.get(context.params.id);
    }
  })
  .get("/to/nqu", (context) => {
    context.response.redirect('https://www.nqu.edu.tw/')
  })
  .get("/to/nqu/csie", (context) => {
    context.response.redirect('https://csie.nqu.edu.tw/')
  });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Started at: http://127.0.0.1:8000')
await app.listen({ port: 8000 });
