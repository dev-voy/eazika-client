# 🚀 Eazika Frontend

Modern, scalable frontend application for **Eazika** built with a performance-first architecture and clean UI system.

---

## 📌 Overview

Eazika Frontend is a responsive, production-ready web application built using modern frontend technologies.
It focuses on:

- ⚡ Performance & scalability
- 🎯 Clean component architecture
- 🎨 Consistent design system
- 🔐 Secure API integration
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Hooks / Context API
- **API Handling:** Fetch / Axios
- **Deployment:** Vercel

---

## 📂 Project Structure

```
eazika-frontend/
│
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── (routes)/         # Feature routes
│
├── components/           # Reusable UI components
│
├── lib/                  # Utilities & helpers
│
├── services/             # API services
│
├── hooks/                # Custom hooks
│
├── types/                # TypeScript types
│
├── public/               # Static assets
│
└── styles/               # Global styles
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/dev-voy/eazika-client.git
cd eazika-client
```

### 2️⃣ Install dependencies

```bash
yarn install
```

### 3️⃣ Setup environment variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Eazika
```

---

## 🚀 Run Locally

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Environment Variables

| Variable               | Description          |
| ---------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | Application name     |

---

## 🎨 UI Guidelines

- Use `shadcn/ui` components wherever possible
- Follow Tailwind utility-first approach
- Maintain consistent spacing (4px scale)
- Keep components reusable and atomic
- Avoid inline styles

---

## 📡 API Integration Pattern

Example service structure:

```ts
// services/user.service.ts

import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getUser = async () => {
  const res = await axios.get(`${API}/user`);
  return res.data;
};
```

---

## 🧠 Best Practices

- Use Server Components when possible
- Keep client components minimal
- Centralize API logic inside `/services`
- Strict TypeScript usage
- Avoid unnecessary re-renders
- Use loading & error states properly

---

## 🔐 Authentication Strategy

- Token stored securely (HTTP-only cookies recommended)
- Protected routes handled via middleware
- Role-based UI rendering

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repo
2. Add environment variables
3. Deploy

## 📊 Performance Optimization

- Dynamic imports for heavy components
- Image optimization via Next.js `<Image />`
- Code splitting
- Lazy loading
- Proper caching headers

---

## 🤝 Contribution Guidelines

1. Create feature branch
2. Follow naming convention: `feature/feature-name`
3. Submit PR
4. Ensure lint passes

---

## 📄 License

Private project – All rights reserved.
