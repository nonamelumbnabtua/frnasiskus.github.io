# Portal Bahan Ajar (SITTA) UT Medan

Aplikasi web statis untuk melihat informasi bahan ajar, memantau stok, dan melacak pengiriman bahan ajar di lingkungan Universitas Terbuka (UT) Medan. Proyek ini dibuat sebagai **Tugas 1 MSIM4309 Pemrograman Berbasis Web**.

## Fitur

- **Login**: autentikasi sederhana dengan email dan kata sandi, dilengkapi tombol tampil/sembunyikan kata sandi dan pesan kesalahan yang berbeda untuk email tidak terdaftar maupun kata sandi salah.
- **Daftar akun**: tombol "Belum punya akun? Daftar" pada halaman login membuka modal box pendaftaran (nama, email, kata sandi, konfirmasi kata sandi) dengan validasi kolom kosong, panjang kata sandi minimal 6 karakter, kecocokan konfirmasi, dan email yang belum terdaftar. Akun baru disimpan di `localStorage` sehingga bisa dipakai untuk login berikutnya.
- **Dashboard**: sambutan dengan nama pengguna yang sedang login dan pencarian bahan ajar (berdasarkan kode atau nama) secara langsung saat mengetik.
- **Stok**: daftar seluruh bahan ajar lengkap dengan cover, kode, jenis, edisi, dan jumlah stok, serta kolom pencarian.
- **Tracking**: pelacakan pengiriman berdasarkan nomor DO, menampilkan detail pengiriman dan linimasa perjalanan paket (data terbaru di posisi paling atas).
- **Proteksi halaman**: Dashboard, Stok, dan Tracking hanya bisa dibuka setelah login. Jika belum login, pengguna diarahkan kembali ke halaman login.
- **Desain responsif**: menu navigasi berubah menjadi dropdown pada layar kecil, tampilan kartu menyesuaikan jumlah kolom.

## Teknologi

- HTML5, CSS3, dan JavaScript (vanilla, tanpa framework)
- [Remix Icon](https://remixicon.com/) untuk ikon (via CDN)
- Google Fonts untuk tipografi
- `sessionStorage` untuk menyimpan sesi login
- Data berupa array/objek JavaScript (`data.js`), tanpa backend dan database

## Struktur Folder

```
.
├── index.html            # Halaman login
├── Dashboard.html        # Beranda + pencarian bahan ajar
├── Stok.html             # Daftar dan stok bahan ajar
├── Tracking.html         # Pelacakan pengiriman
├── CSS/
│   ├── Style.css         # Gaya halaman login
│   └── Gabungan.css      # Gaya Dashboard, Stok, dan Tracking
├── Javascript/
│   ├── data.js           # Data pengguna, bahan ajar, dan tracking
│   └── Gabungan.js       # Seluruh logika aplikasi
├── img/img/              # Gambar cover bahan ajar
└── BG/                   # Gambar latar (background web hero section.png)
```

## Cara Menjalankan

1. Unduh atau clone proyek ini.
2. Pastikan struktur folder sesuai bagan di atas (terutama folder `CSS`, `Javascript`, `img/img`, dan `BG`).
3. Buka `index.html` di browser (atau gunakan ekstensi seperti Live Server di VS Code).
4. Masuk menggunakan salah satu akun demo di bawah ini.

> Koneksi internet diperlukan untuk memuat font dan ikon dari CDN.

## Akun Demo

| Nama           | Email           | Kata Sandi | Peran         |
|----------------|-----------------|------------|---------------|
| Rina Wulandari | rina@ut.ac.id   | rina123    | UPBJJ-UT      |
| Agus Pranoto   | agus@ut.ac.id   | agus123    | UPBJJ-UT      |
| Siti Marlina   | siti@ut.ac.id   | siti123    | Puslaba       |
| Doni Setiawan  | doni@ut.ac.id   | doni123    | Fakultas      |
| Admin SITTA    | admin@ut.ac.id  | admin123   | Administrator |

## Contoh Nomor DO untuk Tracking

| Nomor DO     | Nama           | Ekspedisi     | Status            |
|--------------|----------------|---------------|-------------------|
| `2023001234` | Rina Wulandari | JNE           | Dalam Perjalanan  |
| `2023005678` | Agus Pranoto   | Pos Indonesia | Dikirim           |

## Contoh Kata Kunci Pencarian Bahan Ajar

`ASIP4301`, `EKMA4216`, `EKMA4310`, `BIOL4211`, `PAUD4401`, atau sebagian nama seperti "Manajemen", "Mikrobiologi", dan "Kepemimpinan".

## Alur Aplikasi

1. Pengguna membuka `index.html` dan mengisi email serta kata sandi.
2. Data dicocokkan dengan `dataPengguna` di `data.js`. Jika cocok, data pengguna disimpan di `sessionStorage` lalu diarahkan ke `Dashboard.html`.
3. Setiap halaman internal memanggil `cekLogin()` untuk memastikan sesi masih ada.
4. Pengguna dapat berpindah antara Dashboard, Stok, dan Tracking melalui navbar.

## Catatan

- Aplikasi ini hanya untuk keperluan pembelajaran. Kata sandi disimpan sebagai teks biasa di `data.js` dan autentikasi dilakukan di sisi klien, sehingga **tidak aman untuk penggunaan produksi**.
- Akun hasil pendaftaran hanya tersimpan di browser yang dipakai mendaftar (`localStorage`), bukan di `data.js`, dan hilang jika data situs dihapus.
- Menu **Contact Us** pada Dashboard, Stok, dan Tracking saat ini masih berupa anchor (`#ContactUs`) dan belum mengarah ke bagian khusus.
- Pada `Stok.html` tautan menu memakai `stok.html` (huruf kecil). Pada server yang membedakan huruf besar/kecil (misalnya Linux), samakan penulisan dengan nama file `Stok.html`.
- Data tracking `2023005678` pada `data.js` memiliki properti `nomorDO` bernilai `2023001234`. Tampilan tidak terpengaruh karena yang ditampilkan adalah kode yang dicari, tetapi sebaiknya diperbaiki agar konsisten.

## Pengembang

- **Nama**: Lasro Fransiskus Lumban Batu
- **Mata Kuliah**: MSIM4309 Pemrograman Berbasis Web
- **Institusi**: Universitas Terbuka

&copy; 2026 SITTA UT Medan
