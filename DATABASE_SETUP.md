# Database Setup Guide

Panduan ini akan membantu Anda mengatur PostgreSQL database untuk aplikasi Next.js Dashboard.

## Prerequisites

1. **PostgreSQL** - Pastikan PostgreSQL sudah terinstall di sistem Anda
2. **Node.js** - Versi 18 atau lebih tinggi
3. **pnpm** - Package manager yang digunakan dalam project ini

## Setup Database

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup PostgreSQL Database

#### Opsi A: Local PostgreSQL

1. Buat database baru:
```sql
CREATE DATABASE nextjs_dashboard;
```

2. Buat user baru (opsional):
```sql
CREATE USER dashboard_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nextjs_dashboard TO dashboard_user;
```

#### Opsi B: Docker PostgreSQL

```bash
docker run --name postgres-dashboard \
  -e POSTGRES_DB=nextjs_dashboard \
  -e POSTGRES_USER=dashboard_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Environment Variables

1. Copy file environment:
```bash
cp env.example.txt .env
```

2. Update `DATABASE_URL` di file `.env`:
```env
DATABASE_URL="postgresql://dashboard_user:your_password@localhost:5432/nextjs_dashboard"
```

### 4. Generate Prisma Client

```bash
pnpm db:generate
```

### 5. Push Database Schema

```bash
pnpm db:push
```

Atau jika ingin menggunakan migrations:

```bash
pnpm db:migrate
```

### 6. (Opsional) Seed Database

Untuk menambahkan data sample, Anda bisa membuat script seed atau menggunakan Prisma Studio:

```bash
pnpm db:studio
```

## Available Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema ke database tanpa migrations
- `pnpm db:migrate` - Buat dan jalankan migrations
- `pnpm db:studio` - Buka Prisma Studio untuk manage data

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