# Panduan Deployment ke cPanel - ScoreHAB

Panduan lengkap untuk deploy aplikasi ScoreHAB ke cPanel dengan subdomain scorehab.gaspul.com

---

## 📋 Persiapan Sebelum Upload

### 1. File yang Perlu Disiapkan
- Backup database lokal (export dari phpMyAdmin)
- Source code backend (folder `backend`)
- Source code frontend yang sudah di-build (folder `frontend`)
- File `.env.example` untuk referensi konfigurasi

### 2. Informasi yang Diperlukan
- URL cPanel: https://gaspul.com:2083 atau https://gaspul.com/cpanel
- Username cPanel
- Password cPanel
- Database credentials (akan dibuat di cPanel)

---

## 🗄️ LANGKAH 1: Setup Database di cPanel

### 1.1 Login ke cPanel
1. Buka browser dan akses: `https://gaspul.com:2083`
2. Login dengan username dan password cPanel Anda

### 1.2 Membuat Database MySQL
1. Di cPanel, cari dan klik **"MySQL Databases"** atau **"Database MySQL"**
2. Di bagian **"Create New Database"**:
   - Masukkan nama database: `gaspul_scorehab`
   - Klik tombol **"Create Database"**
   - Database akan dibuat dengan format: `namacpanel_gaspul_scorehab`
   - **Catat nama lengkap database ini!**

### 1.3 Membuat User Database
1. Scroll ke bawah ke bagian **"MySQL Users"** atau **"Add New User"**
2. Isi form:
   - Username: `scorehab_user` (atau nama lain yang Anda inginkan)
   - Password: Buat password yang kuat (misal: `ScoreHAB2024!`)
   - Password Strength: Pastikan minimal "Very Strong"
3. Klik **"Create User"**
4. User akan dibuat dengan format: `namacpanel_scorehab_user`
5. **Catat username dan password ini!**

### 1.4 Memberikan Privileges ke User
1. Scroll ke bagian **"Add User To Database"**
2. Pilih:
   - User: `namacpanel_scorehab_user`
   - Database: `namacpanel_gaspul_scorehab`
3. Klik **"Add"**
4. Di halaman privileges, centang **"ALL PRIVILEGES"**
5. Klik **"Make Changes"**

### 1.5 Import Database
1. Di cPanel, cari dan klik **"phpMyAdmin"**
2. Di sidebar kiri, klik database `namacpanel_gaspul_scorehab`
3. Klik tab **"Import"** di bagian atas
4. Klik **"Choose File"** dan pilih file SQL backup Anda
5. Scroll ke bawah dan klik **"Go"** atau **"Import"**
6. Tunggu hingga proses import selesai

**Catatan:** Jika Anda belum punya backup database, lewati langkah 1.5 dan database akan dibuat otomatis saat migrasi Laravel nanti.

---

## 📁 LANGKAH 2: Setup Subdomain

### 2.1 Membuat Subdomain
1. Di cPanel, cari dan klik **"Subdomains"** atau **"Subdomain"**
2. Isi form subdomain:
   - Subdomain: `scorehab`
   - Domain: `gaspul.com` (pilih dari dropdown)
   - Document Root: Akan otomatis terisi `public_html/scorehab`
3. Klik **"Create"** atau **"Buat"**
4. Subdomain `scorehab.gaspul.com` sekarang sudah aktif

### 2.2 Akses File Manager
1. Di cPanel, klik **"File Manager"**
2. Navigate ke folder: `public_html/scorehab`
3. Folder ini akan menjadi root directory untuk subdomain Anda

---

## 🚀 LANGKAH 3: Upload Backend (Laravel)

### 3.1 Persiapan File Backend
Di komputer lokal Anda:

1. Buka folder `backend` proyek Anda
2. Buat file ZIP dari folder backend (atau upload via FTP)
3. **PENTING:** Jangan include folder berikut dalam ZIP:
   - `vendor/` (akan di-generate ulang di server)
   - `node_modules/`
   - `.env` (akan dibuat manual di server)
   - `storage/logs/*.log`

### 3.2 Upload File ke Server

#### Opsi A: Via File Manager cPanel
1. Di File Manager, masuk ke folder `public_html/scorehab`
2. Klik **"Upload"** di toolbar
3. Pilih file ZIP backend Anda
4. Tunggu hingga upload selesai
5. Kembali ke File Manager
6. Klik kanan pada file ZIP → **"Extract"**
7. File akan di-extract ke folder `scorehab`

#### Opsi B: Via FTP (FileZilla/WinSCP)
1. Buka FileZilla atau FTP client lainnya
2. Connect ke server:
   - Host: `ftp.gaspul.com` atau `gaspul.com`
   - Username: username cPanel Anda
   - Password: password cPanel Anda
   - Port: 21 (FTP) atau 22 (SFTP/SSH)
3. Navigate ke: `/public_html/scorehab`
4. Upload semua file dari folder `backend` lokal Anda
5. Tunggu hingga upload selesai

### 3.3 Struktur Folder Backend
Setelah upload, struktur folder harus seperti ini:
```
public_html/scorehab/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/         <-- Ini yang akan menjadi document root
├── resources/
├── routes/
├── storage/
├── .env.example
├── artisan
├── composer.json
└── composer.lock
```

---

## ⚙️ LANGKAH 4: Konfigurasi Backend Laravel

### 4.1 Membuat File .env
1. Di File Manager, navigate ke `public_html/scorehab`
2. Copy file `.env.example` → rename menjadi `.env`
3. Klik kanan pada `.env` → **"Edit"** atau **"Code Editor"**
4. Update konfigurasi berikut:

```env
APP_NAME="Gaspul ScoreHAB"
APP_ENV=production
APP_KEY=base64:.... (akan di-generate nanti)
APP_DEBUG=false
APP_URL=https://scorehab.gaspul.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=namacpanel_gaspul_scorehab    # Ganti dengan nama database Anda
DB_USERNAME=namacpanel_scorehab_user      # Ganti dengan username database Anda
DB_PASSWORD=ScoreHAB2024!                 # Ganti dengan password database Anda

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

5. Klik **"Save Changes"**

### 4.2 Set Permissions untuk Storage dan Bootstrap
1. Di File Manager, navigate ke folder `storage`
2. Klik kanan → **"Change Permissions"**
3. Set permissions: **755** atau centang semua box untuk owner
4. Centang **"Recurse into subdirectories"**
5. Klik **"Change Permissions"**

Ulangi untuk folder `bootstrap/cache`:
- Set permissions: **755**

### 4.3 Update Document Root Subdomain
**PENTING:** Laravel memerlukan document root mengarah ke folder `public`

1. Di cPanel, klik **"Subdomains"**
2. Cari subdomain `scorehab.gaspul.com`
3. Klik **"Manage"** atau icon pensil (edit)
4. Ubah Document Root dari:
   - `public_html/scorehab`
   - Menjadi: `public_html/scorehab/public`
5. Klik **"Save"** atau **"Update"**

### 4.4 Install Composer Dependencies
Anda perlu akses SSH/Terminal untuk langkah ini.

#### Jika punya akses SSH:
```bash
cd public_html/scorehab
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

#### Jika TIDAK punya akses SSH:
Opsi 1: Upload folder `vendor` dari lokal (sudah include composer install)
1. Di lokal, jalankan: `composer install --no-dev`
2. Upload folder `vendor` ke server via FTP/File Manager

Opsi 2: Gunakan Terminal di cPanel (jika tersedia)
1. Di cPanel, cari **"Terminal"** atau **"SSH Access"**
2. Jalankan command yang sama seperti di atas

### 4.5 Generate Application Key (Manual)
Jika tidak bisa akses terminal:
1. Di browser, akses: `https://scorehab.gaspul.com/generate-key` (buat route khusus)
2. Atau generate secara manual:
   - Buka https://generate-random.org/laravel-key-generator
   - Copy key yang di-generate
   - Paste ke file `.env` di bagian `APP_KEY=`

### 4.6 Jalankan Migrasi Database (Manual via phpMyAdmin)
Jika tidak bisa `php artisan migrate`:
1. Di lokal, export hasil migrasi dari phpMyAdmin
2. Import SQL file tersebut ke database production via phpMyAdmin cPanel

---

## 🎨 LANGKAH 5: Build dan Upload Frontend

### 5.1 Build Frontend untuk Production
Di komputer lokal Anda:

1. Buka terminal/command prompt
2. Navigate ke folder `frontend`:
   ```bash
   cd frontend
   ```

3. Update file `.env` atau `vite.config.js` dengan API URL production:

   Buat file `frontend/.env.production`:
   ```env
   VITE_API_URL=https://scorehab.gaspul.com/api
   ```

4. Install dependencies (jika belum):
   ```bash
   npm install
   ```

5. Build untuk production:
   ```bash
   npm run build
   ```

6. Folder `dist` akan terbuat berisi file production-ready

### 5.2 Upload Frontend ke Server
1. Di File Manager cPanel, navigate ke `public_html/scorehab/public`
2. Upload semua isi folder `frontend/dist` ke `public_html/scorehab/public`
3. File yang di-upload:
   - `index.html`
   - folder `assets/` (berisi JS, CSS, images)
   - folder `images/` (jika ada)
   - file `hab80.png`

### 5.3 Konfigurasi untuk SPA (Single Page Application)
Laravel perlu dikonfigurasi untuk handle routing frontend.

Edit file `public_html/scorehab/routes/web.php`:
```php
<?php

use Illuminate\Support\Facades\Route;

// Catch all routes untuk SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
```

Buat file `resources/views/app.blade.php`:
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gaspul ScoreHAB</title>
    @vite(['resources/js/app.js'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

**ATAU** (Lebih Sederhana):
Copy isi `frontend/dist/index.html` ke `resources/views/app.blade.php`

---

## 🔧 LANGKAH 6: Konfigurasi .htaccess

### 6.1 File .htaccess di public/
Pastikan file `public_html/scorehab/public/.htaccess` ada dan berisi:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### 6.2 File .htaccess di root (opsional)
Buat file `public_html/scorehab/.htaccess`:

```apache
RewriteEngine On
RewriteRule ^(.*)$ public/$1 [L]
```

---

## ✅ LANGKAH 7: Testing dan Verifikasi

### 7.1 Test Backend API
1. Buka browser
2. Akses: `https://scorehab.gaspul.com/api/events`
3. Anda harus melihat response JSON (bisa kosong jika belum ada data)

### 7.2 Test Frontend
1. Akses: `https://scorehab.gaspul.com`
2. Halaman home harus muncul dengan banner HAB 80
3. Test navigasi menu
4. Test login dengan akun admin yang sudah dibuat

### 7.3 Test CORS (jika API dan Frontend terpisah)
Jika ada error CORS, update `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['https://scorehab.gaspul.com'],
'allowed_origins_patterns' => [],
'supports_credentials' => true,
```

---

## 🐛 Troubleshooting

### Error 500 - Internal Server Error
1. Cek file `.env` sudah benar
2. Cek APP_KEY sudah di-generate
3. Cek permissions folder storage dan bootstrap/cache (755)
4. Cek error log di cPanel → Errors

### Database Connection Error
1. Verifikasi nama database, username, password di .env
2. Pastikan user sudah diberi privileges ke database
3. DB_HOST harus `localhost` (bukan 127.0.0.1)

### 404 Not Found pada Routing
1. Pastikan document root mengarah ke `public_html/scorehab/public`
2. Cek file `.htaccess` ada dan mod_rewrite aktif
3. Clear cache: `php artisan config:clear`

### Gambar/Assets Tidak Muncul
1. Cek permissions folder public (755)
2. Verifikasi file ada di `public_html/scorehab/public/`
3. Cek URL di browser console untuk path yang benar

### White Screen / Blank Page
1. Set `APP_DEBUG=true` sementara di .env untuk lihat error
2. Cek browser console untuk JavaScript errors
3. Cek path API URL di frontend sudah benar

---

## 📊 Checklist Deployment

- [ ] Database dibuat di cPanel
- [ ] User database dibuat dan diberi privileges
- [ ] Subdomain scorehab.gaspul.com dibuat
- [ ] Backend files di-upload
- [ ] File .env dibuat dan dikonfigurasi
- [ ] Permissions storage dan bootstrap/cache di-set
- [ ] Document root subdomain mengarah ke folder public
- [ ] Composer dependencies terinstall
- [ ] Application key di-generate
- [ ] Database migrasi dijalankan
- [ ] Frontend di-build untuk production
- [ ] Frontend files di-upload ke folder public
- [ ] File .htaccess dikonfigurasi
- [ ] Testing API endpoint
- [ ] Testing frontend di browser
- [ ] Login admin berfungsi
- [ ] SSL/HTTPS aktif

---

## 📞 Support

Jika mengalami kendala:
1. Cek error log di cPanel → Errors
2. Aktifkan APP_DEBUG=true untuk melihat error detail
3. Cek browser console untuk error JavaScript
4. Hubungi support hosting untuk masalah server/cPanel

---

## 🔒 Keamanan Production

Setelah deployment berhasil:

1. Set `APP_DEBUG=false` di .env
2. Set `APP_ENV=production` di .env
3. Aktifkan HTTPS/SSL
4. Ganti password database default
5. Backup database secara berkala
6. Update `.gitignore` agar .env tidak ter-commit

---

**Selamat! Aplikasi ScoreHAB Anda sekarang sudah live di scorehab.gaspul.com** 🎉
