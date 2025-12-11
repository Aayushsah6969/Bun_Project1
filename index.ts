import { Client } from "pg";
import * as path from "path";
import { file } from "bun";

// ---------- DB CONNECTION ----------
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "aayush",
  database: "test-bun",
  port: 5432,
});
await client.connect();

// ---------- UTILITY: RENDER HTML ----------
async function renderIndex() {
  const html = await file("views/index.html").text();
  const msgs = await client.query("SELECT * FROM messages ORDER BY id DESC");

  const list = msgs.rows.length > 0
    ? msgs.rows
        .map(
          (m) => `
        <div class="message-item">
          <div class="message-content">
            <div class="message-text">${m.text}</div>
            <div class="message-time">${new Date(m.created_at).toLocaleString()}</div>
          </div>
          <div class="message-actions">
            <a href="/edit/${m.id}" class="edit-btn">Edit</a>
            <form action="/delete/${m.id}" method="POST" style="display:inline;">
              <button type="submit" class="delete-btn" onclick="return confirm('Are you sure you want to delete this message?')">Delete</button>
            </form>
          </div>
        </div>
      `
        )
        .join("")
    : '<div class="no-messages">No messages yet. Add one above!</div>';

  return html.replace("{{messages}}", list);
}

// ---------- SERVER ----------
const server = Bun.serve({
  port: 3000,

  fetch: async (req) => {
    const url = new URL(req.url);

    // 1. HOME PAGE
    if (url.pathname === "/") {
      const page = await renderIndex();
      return new Response(page, { headers: { "Content-Type": "text/html" } });
    }

    // 2. TIME PAGE
    if (url.pathname === "/time") {
      const page = await file("views/time.html").text();
      return new Response(page, { headers: { "Content-Type": "text/html" } });
    }

    // 3. API: Return DB time (used by time.html)
    if (url.pathname === "/dbtime") {
      const result = await client.query("SELECT NOW()");
      return Response.json({ time: result.rows[0].now });
    }

    // 4. FORM SUBMISSION (POST) - CREATE
    if (url.pathname === "/submit" && req.method === "POST") {
      const formData = await req.formData();
      const text = formData.get("text")?.toString();

      if (text) {
        await client.query("INSERT INTO messages(text) VALUES($1)", [text]);
      }

      // Redirect back to home
      return Response.redirect("/", { status: 303 });
    }

    // 5. EDIT PAGE (GET) - Show edit form
    if (url.pathname.startsWith("/edit/")) {
      const id = url.pathname.split("/")[2];
      const result = await client.query("SELECT * FROM messages WHERE id = $1", [id]);
      
      if (result.rows.length === 0) {
        return new Response("Message not found", { status: 404 });
      }

      const message = result.rows[0];
      const editPage = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Edit Message</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 20px;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              padding: 40px;
            }

            h1 {
              color: #333;
              margin-bottom: 30px;
              font-size: 2em;
              text-align: center;
            }

            form {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            input[type="text"] {
              padding: 15px;
              border: 2px solid #ddd;
              border-radius: 10px;
              font-size: 16px;
            }

            input[type="text"]:focus {
              outline: none;
              border-color: #667eea;
            }

            .button-group {
              display: flex;
              gap: 10px;
            }

            button {
              flex: 1;
              padding: 15px;
              border: none;
              border-radius: 10px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .save-btn {
              background: #667eea;
              color: white;
            }

            .save-btn:hover {
              background: #764ba2;
              transform: translateY(-2px);
            }

            .cancel-btn {
              background: #6c757d;
              color: white;
              text-decoration: none;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .cancel-btn:hover {
              background: #5a6268;
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✏️ Edit Message</h1>
            <form action="/update/${id}" method="POST">
              <input type="text" name="text" value="${message.text}" required />
              <div class="button-group">
                <button type="submit" class="save-btn">Save Changes</button>
                <a href="/" class="cancel-btn">Cancel</a>
              </div>
            </form>
          </div>
        </body>
        </html>
      `;

      return new Response(editPage, { headers: { "Content-Type": "text/html" } });
    }

    // 6. UPDATE MESSAGE (POST)
    if (url.pathname.startsWith("/update/") && req.method === "POST") {
      const id = url.pathname.split("/")[2];
      const formData = await req.formData();
      const text = formData.get("text")?.toString();

      if (text) {
        await client.query("UPDATE messages SET text = $1 WHERE id = $2", [text, id]);
      }

      return Response.redirect("/", { status: 303 });
    }

    // 7. DELETE MESSAGE (POST)
    if (url.pathname.startsWith("/delete/") && req.method === "POST") {
      const id = url.pathname.split("/")[2];
      await client.query("DELETE FROM messages WHERE id = $1", [id]);
      return Response.redirect("/", { status: 303 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Server running on http://localhost:3000");
