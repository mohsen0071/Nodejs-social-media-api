# Social Media API

This is a backend API for a social media platform, built with **Node.js** and **Express**. It provides endpoints for user management, post creation, and comment handling, among other features.

## Features

- **User Management**: Register, update, and manage user profiles.
- **Posts**: Create, retrieve, and manage user posts.
- **Comments**: Add and manage comments on posts.
- **File Uploads**: Supports image uploads using `multer`.
- **Modular Structure**: Organized with handlers, services, routers, and validators.

## Project Structure

```
/api
  /user            # User-related logic
  /comments        # Comment-related logic
  /userPost        # Post-related logic
  /helpers         # Utility functions like multer setup
index.js           # Entry point
package.json       # Project metadata and dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/mohsen0071/social-media.git
cd social-media
npm install
```

### Running the Server

```bash
node index.js
```

Or use a tool like `nodemon` for development:

```bash
nodemon index.js
```

### Environment Variables

Set up your `.env` file to include variables such as:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/socialmedia
```

## API Endpoints

Examples:

- `POST /api/user` – Register user
- `POST /api/userPost` – Create a post
- `POST /api/comments` – Add a comment

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## License

[MIT](LICENSE)
