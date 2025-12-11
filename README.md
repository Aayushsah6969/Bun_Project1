# 📝 Message App with Bun & PostgreSQL

A modern, full-stack CRUD application built with Bun runtime and PostgreSQL database. Features a beautiful gradient UI, complete message management, and real-time database time display.

## ✨ Features

- **Full CRUD Operations**: Create, Read, Update, and Delete messages
- **PostgreSQL Integration**: Direct database connection using `pg` client
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Mobile-friendly interface
- **Database Time Display**: Fetch and display current time from PostgreSQL
- **Navigation**: Easy switching between pages
- **Confirmation Dialogs**: Prevent accidental deletions

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.com) v1.3.4 - Fast all-in-one JavaScript runtime
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Styling**: Vanilla CSS with modern gradients and animations

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.3.4 or higher
- PostgreSQL 12 or higher
- A PostgreSQL database named `test-bun`

## 🛠️ Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Database

Update the database connection in `index.ts`:

```typescript
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "your_password",
  database: "test-bun",
  port: 5432,
});
```

### 3. Create Database Table

Run the following SQL in your PostgreSQL database:

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Running the Application

```bash
bun run index.ts
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
bun_p1/
├── index.ts          # Main server file with all routes
├── package.json      # Dependencies and project config
├── tsconfig.json     # TypeScript configuration
├── README.md         # Project documentation
├── db/
│   └── schema.sql    # Database schema (optional)
└── views/
    ├── index.html    # Main page with message CRUD
    └── time.html     # Database time display page
```

## 🌐 Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Home page with message list and form |
| `GET` | `/time` | Display current database time |
| `GET` | `/dbtime` | API endpoint returning DB time as JSON |
| `POST` | `/submit` | Create a new message |
| `GET` | `/edit/:id` | Edit page for specific message |
| `POST` | `/update/:id` | Update existing message |
| `POST` | `/delete/:id` | Delete message by ID |

## 💡 Features in Detail

### Create Message
- Fill in the text input on the home page
- Click "Save" to store in database
- Automatically redirected to updated list

### Read Messages
- All messages displayed in reverse chronological order
- Shows message text and formatted timestamp
- Empty state when no messages exist

### Update Message
- Click "Edit" button on any message
- Modify text in the edit form
- Save changes or cancel to return

### Delete Message
- Click "Delete" button on any message
- Confirmation dialog prevents accidents
- Message removed from database

## 🎨 UI Features

- **Gradient Background**: Purple to blue gradient theme
- **Smooth Animations**: Hover effects and transitions
- **Card-based Layout**: Clean, modern card design
- **Responsive Forms**: Full-width inputs with focus states
- **Action Buttons**: Color-coded edit (yellow) and delete (red) buttons
- **Navigation Bar**: Switch between Messages and DB Time pages

## 🔧 Development

This project uses:
- **TypeScript** for type safety
- **Bun's native file API** for serving HTML
- **PostgreSQL client** for database operations
- **Vanilla CSS** for styling (no frameworks)

## 📦 Dependencies

```json
{
  "dependencies": {
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

## 🚦 Future Enhancements

- [ ] Add pagination for messages
- [ ] Search/filter functionality
- [ ] User authentication
- [ ] API endpoints for external integration
- [ ] Message categories/tags
- [ ] Export messages to CSV/JSON

## 📝 License

This project was created using `bun init` in bun v1.3.4.

---

Built with ❤️ using [Bun](https://bun.com)
