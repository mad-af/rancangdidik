# Database Setup Guide

Panduan ini akan membantu Anda mengatur SQLite database untuk aplikasi Next.js Dashboard.

## Prerequisites

1. **Node.js** - Versi 18 atau lebih tinggi
2. **npm** - Package manager yang digunakan dalam project ini
3. **SQLite** - Database file-based yang ringan (tidak perlu instalasi terpisah)

## Setup Database

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup SQLite Database

SQLite adalah database file-based yang tidak memerlukan server terpisah. Database akan dibuat otomatis saat menjalankan migrasi.

### 3. Environment Variables

1. Copy file environment:
```bash
cp .env.example .env
```

2. Pastikan `DATABASE_URL` di file `.env` sudah menggunakan SQLite:
```env
DATABASE_URL="file:./dev.db"
```

File database SQLite (`dev.db`) akan dibuat otomatis di direktori `prisma/`.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Setup Database dengan Migrations

```bash
npx prisma migrate dev --name init
```

Perintah ini akan:
- Membuat file database SQLite (`dev.db`)
- Membuat folder migrations dengan schema awal
- Generate Prisma client

### 6. (Opsional) Seed Database

Untuk menambahkan data sample:

```bash
npx prisma db seed
```

Untuk membuka Prisma Studio dan manage data:

```bash
npx prisma studio
```

## Available Scripts

- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Buat dan jalankan migrations untuk development
- `npx prisma db seed` - Jalankan seed script
- `npx prisma studio` - Buka Prisma Studio untuk manage data
- `npx prisma migrate reset` - Reset database dan jalankan ulang semua migrations

## API Endpoints

Setelah setup selesai, Anda dapat menggunakan API endpoints berikut:

### Documents API

- `GET /api/documents` - Get all documents dengan filtering
  - Query params: `page`, `limit`, `search`, `categories`
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

### Example API Usage

```javascript
// Get documents dengan filtering
fetch('/api/documents?page=1&limit=10&search=math&subjects=mathematics&phases=foundation')

// Create new document
fetch('/api/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Laptop Gaming',
    description: 'High performance gaming laptop',
    price: 15000000,
    category: 'electronics',
    photo_url: 'https://example.com/image.jpg'
  })
})
```

## Troubleshooting

### Connection Issues

1. Pastikan PostgreSQL service berjalan
2. Cek DATABASE_URL format dan credentials
3. Pastikan database sudah dibuat
4. Cek firewall/port 5432

### Prisma Issues

1. Jika ada error schema, coba:
```bash
pnpm db:generate
pnpm db:push
```

2. Reset database (hati-hati, akan menghapus semua data):
```bash
npx prisma db push --force-reset
```

### Development

Untuk development, jalankan:

```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Production Deployment

Untuk production:

1. Setup PostgreSQL database di cloud provider (Supabase, Railway, dll)
2. Update DATABASE_URL dengan connection string production
3. Jalankan migrations:
```bash
npx prisma migrate deploy
```
4. Build dan deploy aplikasi

## Features

✅ **CRUD Operations** - Create, Read, Update, Delete documents
✅ **Search & Filter** - Search by name, description, category
✅ **Pagination** - Efficient data loading
✅ **Form Validation** - Client-side validation dengan Zod
✅ **Error Handling** - Proper error messages dan loading states
✅ **Responsive UI** - Mobile-friendly interface
✅ **Toast Notifications** - User feedback untuk actions