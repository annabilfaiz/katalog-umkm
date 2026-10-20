# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:*Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.*

**Hasil:*Viewed AGENTS.md:1-53
Viewed user-stories.md:1-615
Viewed rancangan-teknis.md:1-69
Viewed DESIGN.md:1-52
Viewed page.jsx:1-37
Viewed package.json:1-25
Viewed .env.example:1-14
Listed directory lib
Viewed schema.sql:1-91
Listed directory components
Viewed KartuProduk.jsx:1-25
Viewed data-contoh.js:1-60
Viewed page.jsx:1-41
Listed directory katalog-umkm
Viewed PROMPTS.md:1-60
Viewed README.md:1-81
Viewed checklist-pengujian.md:1-27
Viewed checklist-keamanan.md:1-14
Viewed .env.local:1-14
Searched for "lib/supabase"
Searched for "SUPABASE_SECRET_KEY"
Searched for "createClient"
Listed directory docs
Viewed skema-database.md:1-27
Viewed PRD.md:1-60
Listed directory app
Viewed layout.jsx:1-30
Created server.js
Created index.js
Ran command: `node --env-file=.env.local -e "import('./lib/supabase/server.js').then(m => m.createClient().from('produk').select('*')).then(r => console.log('Count:', r.data?.length, 'Error:', r.error))"`
Searched for "dynamic"
Viewed globals.css:1-34
Edited page.jsx
Ran command: `powershell -Command "Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing | Select-Object -ExpandProperty StatusCode"`
Ran command: `powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content.Substring(0, 2000)"`
Ran command: `powershell -Command "((Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content -match 'CatatanBelumAktif|Masih data contoh')"`
Ran command: `powershell -Command "((Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content -match 'Kopi Bubuk Robusta')"`
Ran command: `powershell -Command "([regex]::Matches((Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content, 'href=\"/produk/\d+\"')).Count"`
Ran command: `powershell -Command "([regex]::Matches((Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content, 'href=""/produk/(\d+)""')).Count"`
Ran command: `powershell -Command "$c = (Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).Content; $c.Substring($c.IndexOf('Produk kami'), 500)"`
Ran command: `node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>{ const idx = t.indexOf('Produk kami'); console.log(t.substring(idx, idx + 600)); })"`
Ran command: `node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>{ const matches = t.match(/href=\"\/produk\/\d+\"/g); console.log('Total products rendered:', matches?.length); })"`
Ran command: `node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>{ const matches = t.split('/produk/').length - 1; console.log('Total products rendered:', matches); })"`
Ran command: `node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>{ const matches = t.split('group flex flex-col overflow-hidden').length - 1; console.log('Total cards:', matches); })"`
Ran command: `npm run build`
Ran command: `npx next build --webpack`
Used tool: manage_task
Used tool: manage_task
Used tool: manage_task

Pekerjaan untuk **US-01: Katalog dari database** telah selesai.

### Perubahan yang Dilakukan

1. **[lib/supabase/server.js](file:///c:/Faiz/My%20project/katalog-umkm/lib/supabase/server.js)** dan **[lib/supabase/index.js](file:///c:/Faiz/My%20project/katalog-umkm/lib/supabase/index.js)**:
   - Membuat koneksi Supabase untuk server menggunakan `createClient` dari `@supabase/supabase-js`.
   - Menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dari environment variable untuk membaca data di sisi server (melewati RLS tanpa mengirimkan kunci ke browser).

2. **[app/page.jsx](file:///c:/Faiz/My%20project/katalog-umkm/app/page.jsx)**:
   - Mengubah komponen menjadi Server Component `async` yang mengambil daftar produk dari tabel `produk` di Supabase secara dinamis (`force-dynamic`).
   - Mengurutkan produk berdasarkan kolom `id`.
   - Menghapus penggunaan `CatatanBelumAktif` dan data contoh dari `lib/data-contoh.js`.
   - Menampilkan daftar produk menggunakan komponen [KartuProduk](file:///c:/Faiz/My%20project/katalog-umkm/components/KartuProduk.jsx) tanpa mengubah tampilannya.
   - Menambahkan penanganan bila tabel kosong dengan menampilkan teks `"Belum ada produk"`.
   - Menambahkan penanganan bila terjadi error saat mengambil data dengan menampilkan pesan error yang jelas.

---

### Cara Mengetes

1. **Buka Katalog di Browser**:
   - Jalankan `npm run dev -- --webpack` (jika dev server belum menyala) dan buka `http://localhost:3000`.
   - Pastikan produk yang tampil berasal dari tabel `produk` di Supabase (bukan lagi 6 data contoh statis) dan komponen `CatatanBelumAktif` sudah tidak muncul.
2. **Uji Kondisi Error**:
   - Anda dapat menguji dengan mengosongkan sementara `SUPABASE_URL` di `.env.local` lalu memuat ulang halaman: halaman akan menampilkan kotak error dengan pesan yang jelas.
3. **Uji Kondisi Kosong**:
   - Jika tabel produk tidak memiliki baris data, halaman akan menampilkan tulisan `"Belum ada produk"`.*

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
