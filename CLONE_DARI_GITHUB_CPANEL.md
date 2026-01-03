# Panduan Clone Project dari GitHub via Terminal cPanel

Panduan untuk mengambil project ScoreHAB dari GitHub repository menggunakan Terminal di cPanel.

---

## 📋 Persiapan

### Informasi yang Diperlukan:
- URL Repository GitHub: `https://github.com/echal/scorehab.git`
- Username cPanel
- Password cPanel
- Akses Terminal di cPanel

---

## 🚀 LANGKAH-LANGKAH

### LANGKAH 1: Login ke cPanel

1. Buka browser dan akses: `https://gaspul.com:2083`
2. Login dengan username dan password cPanel Anda

---

### LANGKAH 2: Buka Terminal

1. Di cPanel, scroll ke bawah atau gunakan search box
2. Cari dan klik **"Terminal"** atau **"SSH Access"**
3. Terminal web akan terbuka di browser

---

### LANGKAH 3: Navigate ke Folder public_html

Di terminal, ketik perintah berikut:

```bash
cd public_html
```

Kemudian cek isi folder:

```bash
ls -la
```

---

### LANGKAH 4: Clone Repository dari GitHub

**Opsi A: Clone ke Folder Baru "scorehab"**

```bash
git clone https://github.com/echal/scorehab.git scorehab
```

Perintah ini akan:
- Clone repository dari GitHub
- Membuat folder `scorehab` di dalam `public_html`
- Download semua file project

**Opsi B: Jika Folder scorehab Sudah Ada (Kosongkan Dulu)**

Jika folder `scorehab` sudah ada dan ingin diganti:

```bash
# Backup folder lama (opsional)
mv scorehab scorehab_backup_$(date +%Y%m%d)

# Clone fresh dari GitHub
git clone https://github.com/echal/scorehab.git scorehab
```

**Opsi C: Clone Langsung ke Folder yang Sudah Ada**

Jika folder kosong dan ingin clone ke dalamnya:

```bash
cd scorehab
git clone https://github.com/echal/scorehab.git .
```

**Catatan:** Tanda titik (.) di akhir artinya clone ke current directory

---

### LANGKAH 5: Verifikasi Clone Berhasil

Masuk ke folder scorehab dan cek isinya:

```bash
cd scorehab
ls -la
```

Anda harus melihat folder-folder seperti:
- `backend/`
- `frontend/`
- `README.md`
- `PANDUAN_DEPLOYMENT_CPANEL.md`
- dll

---

### LANGKAH 6: Setup Backend Laravel

#### 6.1 Masuk ke Folder Backend

```bash
cd backend
```

#### 6.2 Install Composer Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

**Jika composer tidak ditemukan, gunakan:**

```bash
php composer.phar install --no-dev --optimize-autoloader
```

**Jika composer.phar tidak ada, download dulu:**

```bash
curl -sS https://getcomposer.org/installer | php
php composer.phar install --no-dev --optimize-autoloader
```

#### 6.3 Copy File .env

```bash
cp .env.example .env
```

#### 6.4 Edit File .env

```bash
nano .env
```

**Update konfigurasi berikut:**

```env
APP_NAME="Gaspul ScoreHAB"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://scorehab.gaspul.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=gaspulco_scorehab         # Ganti dengan nama database Anda
DB_USERNAME=gaspulco_root             # Ganti dengan username database Anda
DB_PASSWORD=your_database_password    # Ganti dengan password database Anda

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

**Cara menggunakan nano:**
- Edit text seperti biasa
- Simpan: Tekan `Ctrl + O`, lalu `Enter`
- Keluar: Tekan `Ctrl + X`

#### 6.5 Generate Application Key

```bash
php artisan key:generate
```

#### 6.6 Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
```

#### 6.7 Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 6.8 Jalankan Migrasi Database

```bash
php artisan migrate --force
```

**Jika berhasil, Anda akan melihat:**
```
Migration table created successfully.
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
```

---

### LANGKAH 7: Setup Frontend

#### 7.1 Kembali ke Root Project

```bash
cd ..
cd frontend
```

#### 7.2 Install Node Modules (Jika perlu build di server)

```bash
npm install
```

#### 7.3 Build Frontend untuk Production

```bash
npm run build
```

Folder `dist` akan terbuat berisi file production-ready.

#### 7.4 Copy File Build ke Backend Public

```bash
cp -r dist/* ../backend/public/
```

---

### LANGKAH 8: Konfigurasi Subdomain (Via cPanel)

**Penting:** Langkah ini dilakukan via cPanel web interface, bukan terminal.

1. Keluar dari terminal (atau buka tab baru)
2. Di cPanel, klik **"Subdomains"**
3. Jika subdomain `scorehab` belum ada, buat:
   - Subdomain: `scorehab`
   - Domain: `gaspul.com`
   - Document Root: **PENTING!** Set ke: `public_html/scorehab/backend/public`
4. Jika sudah ada, klik **"Manage"** atau icon pensil
5. Update Document Root ke: `public_html/scorehab/backend/public`
6. Klik **"Save"**

---

### LANGKAH 9: Buat User Admin (Via Terminal)

Kembali ke terminal:

```bash
cd ~/public_html/scorehab/backend
```

Buat user admin menggunakan tinker:

```bash
php artisan tinker
```

Di prompt tinker, ketik:

```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->username = 'admin';
$user->email = 'admin@gaspul.com';
$user->password = bcrypt('admin123');
$user->role = 'admin';
$user->save();
echo 'Admin user created!';
exit;
```

**Catatan:** Tekan Enter setelah setiap baris.

---

### LANGKAH 10: Testing

#### 10.1 Test Backend API

Di browser, akses:
```
https://scorehab.gaspul.com/api/events
```

Harus muncul response JSON (bisa kosong array `[]` jika belum ada data).

#### 10.2 Test Frontend

Di browser, akses:
```
https://scorehab.gaspul.com
```

Halaman home harus muncul dengan:
- Banner HAB 80
- Logo "ScoreHAB"
- Menu navigasi

#### 10.3 Test Login Admin

1. Klik **"Masuk"** atau akses: `https://scorehab.gaspul.com/login`
2. Login dengan:
   - Email: `admin@gaspul.com`
   - Password: `admin123`
3. Setelah login, akses: `https://scorehab.gaspul.com/admin`

---

## 🔄 Update dari GitHub (Pull Changes)

Jika ada perubahan di GitHub dan ingin update:

```bash
cd ~/public_html/scorehab
git pull origin main
```

Setelah pull, update dependencies dan cache:

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Untuk frontend (jika ada perubahan):

```bash
cd ../frontend
npm install
npm run build
cp -r dist/* ../backend/public/
```

---

## 📝 Ringkasan Perintah Lengkap (Copy-Paste Friendly)

```bash
# 1. Navigate dan Clone
cd ~/public_html
git clone https://github.com/echal/scorehab.git scorehab
cd scorehab/backend

# 2. Install Composer Dependencies
composer install --no-dev --optimize-autoloader

# 3. Setup Environment
cp .env.example .env
nano .env  # Edit sesuai konfigurasi database

# 4. Generate Key dan Setup Laravel
php artisan key:generate
chmod -R 755 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# 5. Build Frontend (jika perlu)
cd ../frontend
npm install
npm run build
cp -r dist/* ../backend/public/

# 6. Buat Admin User
cd ../backend
php artisan tinker
# Kemudian jalankan code PHP untuk create admin user

# 7. Selesai - Test di browser
# https://scorehab.gaspul.com
```

---

## ⚠️ Troubleshooting

### Error: "git: command not found"

Git mungkin tidak tersedia. Alternatif:
1. Download ZIP dari GitHub
2. Upload via File Manager cPanel
3. Extract di server

```bash
# Download via wget
cd ~/public_html
wget https://github.com/echal/scorehab/archive/refs/heads/main.zip
unzip main.zip
mv scorehab-main scorehab
```

### Error: "composer: command not found"

Install composer lokal:

```bash
cd ~/public_html/scorehab/backend
curl -sS https://getcomposer.org/installer | php
php composer.phar install --no-dev --optimize-autoloader
```

### Error: "npm: command not found"

Node.js mungkin tidak tersedia di shared hosting. Solusi:
1. Build di komputer lokal: `npm run build`
2. Upload folder `dist` via FTP/File Manager
3. Copy manual ke `backend/public/`

### Permission Denied

Set permissions:

```bash
cd ~/public_html/scorehab/backend
chmod -R 755 storage bootstrap/cache
chown -R $USER:$USER storage bootstrap/cache
```

### Database Connection Error

1. Cek .env file sudah benar
2. Verifikasi database name, username, password
3. Pastikan DB_HOST=localhost (bukan 127.0.0.1)

---

## 🎯 Checklist Deployment

- [ ] Clone repository dari GitHub
- [ ] Install composer dependencies
- [ ] Copy dan edit file .env
- [ ] Generate application key
- [ ] Set folder permissions
- [ ] Jalankan migrasi database
- [ ] Build frontend
- [ ] Copy frontend ke backend/public
- [ ] Update subdomain document root
- [ ] Buat user admin
- [ ] Test API endpoint
- [ ] Test frontend di browser
- [ ] Test login admin

---

**Selamat! Project ScoreHAB Anda sudah live dari GitHub!** 🎉

Repository: https://github.com/echal/scorehab.git
Website: https://scorehab.gaspul.com
