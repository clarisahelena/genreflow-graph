# GenreFlow Graph

GenreFlow Graph adalah aplikasi web interaktif untuk visualisasi dan manajemen musik dengan fitur graph-based music library, playback controls, dan playlist management.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** (v16.0.0 atau lebih baru) - [Download Node.js](https://nodejs.org/)
- **npm** (biasanya sudah terinstal bersama Node.js) atau **bun**
- **Git** (untuk clone repository) - [Download Git](https://git-scm.com/)

Untuk memeriksa versi yang terinstal:

```bash
node --version
npm --version
```

## 🚀 Panduan Installation & Running Locally

### Step 1: Navigate to Project Directory

```bash
cd genreflow-graph
```

### Step 2: Install Dependencies

Pilih salah satu dari opsi di bawah:

#### Menggunakan npm:
```bash
npm install
```

#### Atau menggunakan bun (lebih cepat):
```bash
bun install
```

Tunggu hingga semua dependencies berhasil diinstal. Proses ini mungkin memakan waktu beberapa menit pada first-time installation.

### Step 3: Jalankan Development Server

```bash
npm run dev
```

Atau jika menggunakan bun:
```bash
bun run dev
```

Output akan terlihat seperti ini:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

### Step 4: Akses Aplikasi di Browser

Buka browser Anda dan navigasi ke:
```
http://localhost:5173/
```

Aplikasi akan auto-reload ketika ada perubahan file.

## 📦 Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server dengan hot reload |
| `npm run build` | Build aplikasi untuk production |
| `npm run build:dev` | Build aplikasi dengan mode development |
| `npm run preview` | Preview production build secara lokal |
| `npm run lint` | Jalankan ESLint untuk check code style |

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Graph Visualization**: @xyflow/react
- **State Management**: React Query
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form
- **Package Manager**: npm / bun

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── GraphCanvas.tsx # Visualisasi graph musik
│   ├── PlayerBar.tsx   # Playback controls
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ...             # Komponen lainnya
├── pages/              # Halaman aplikasi
├── store/              # State management (musicStore)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── data/               # Static data (seedSongs)
├── types/              # TypeScript types
├── App.tsx             # Main App component
└── main.tsx            # Entry point
```

## 🔧 Troubleshooting

### Issue: Port 5173 sudah digunakan

Jika port 5173 sudah digunakan oleh aplikasi lain, Vite akan otomatis mencari port berikutnya yang tersedia. Atau bisa set port manually:

```bash
npm run dev -- --port 3000
```

### Issue: Module tidak ditemukan

Pastikan semua dependencies sudah terinstal dengan benar:

```bash
rm -r node_modules
npm install
```

### Issue: TypeScript errors

Pastikan `node_modules/.vite/deps` sudah di-generate:

```bash
npm run dev
```

Vite akan auto-generate dependency cache pada first run.

### Issue: ESLint errors saat development

Jalankan fix otomatis:

```bash
npm run lint -- --fix
```

## 🌐 Environment Setup

Development server berjalan pada:
- **Host**: `localhost` (127.0.0.1)
- **Port**: `5173` (default)
- **Hot Module Reload**: Enabled
- **CORS**: Enabled untuk development

## 📝 Notes

- Aplikasi menggunakan **Bun lockfile** (`bun.lockb`). Jika menggunakan npm, file `package-lock.json` akan di-generate.
- Pastikan memiliki kuota storage minimal **500MB** untuk `node_modules`
- Development server menyimpan cache di `.vite` folder - aman untuk dihapus
- Repository ini adalah **local project** tanpa version control (git history telah dihapus)

## 📚 Resources & Dokumentasi

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Flow Documentation](https://reactflow.dev/)

## 👨‍💻 Development Tips

1. **Enable Extensions di VS Code** untuk TypeScript, ESLint, dan Tailwind CSS:
   - Prettier - Code formatter
   - ESLint
   - Tailwind CSS IntelliSense

2. **Hot Reload**: Setiap kali save file, browser akan auto-refresh tanpa perlu manual reload

3. **DevTools**: Gunakan React DevTools browser extension untuk debugging

4. **Network Tab**: Buka DevTools → Network tab untuk melihat API calls dan assets loading

---

**Happy Coding! 🎵**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
