/* =====================================================================
   DATA BAHAN AJAR (dataBahanAjar.js)  ->  taruh di folder Javascript/
   Data dummy untuk Stok SITTA & Tracking SITTA (khusus Admin SITTA).
   Variabel global: upbjjList, kategoriList, ekspedisiList, paket, stok, tracking

   Catatan: blok "new Vue({ el: '#app' ... })" bawaan template dihapus karena
   tidak dipakai dan membuat error jika Vue belum dimuat. Seluruh logika Vue
   ada di Gabungan.js (BAGIAN 3 dan BAGIAN 4).
   ===================================================================== */

var upbjjList = [
  "Jakarta",
  "Surabaya",
  "Makassar",
  "Padang",
  "Denpasar",
  "Medan",
  "Bandung"
];

var kategoriList = [
  "MK Wajib",
  "MK Pilihan",
  "Praktikum",
  "Problem-Based"
];

var ekspedisiList = [
  { kode: "JNE-REG", nama: "JNE Regular" },
  { kode: "JNE-EXP", nama: "JNE Express" }
];

var paket = [
  { 
    kode: "PAKET-UT-001", 
    nama: "PAKET IPS Dasar", 
    isi: ["EKMA4116 - Pengantar Manajemen", "EKMA4115 - Pengantar Akuntansi"], 
    harga: 120000 
  },
  { 
    kode: "PAKET-UT-002", 
    nama: "PAKET IPA Dasar", 
    isi: ["BIOL4201 - Biologi Umum", "FISIP4001 - Dasar-Dasar Sosiologi"], 
    harga: 140000 
  },
  { 
    kode: "PAKET-UT-003", 
    nama: "PAKET Ilmu Komunikasi", 
    isi: ["ASIP4301 - Pengantar Ilmu Komunikasi"], 
    harga: 85000 
  }
];

var stok = [
  {
    kode: "ASIP4301",
    judul: "Pengantar Ilmu Komunikasi",
    kategori: "MK Wajib",
    upbjj: "Medan",
    lokasiRak: "0TMP01",
    harga: 85000,
    qty: 548,
    safety: 50,
    catatanHTML: "<em>Edisi terbaru, cetak penuh warna</em>"
  },
  {
    kode: "EKMA4216",
    judul: "Manajemen Keuangan",
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    lokasiRak: "0JKT01",
    harga: 95000,
    qty: 392,
    safety: 40,
    catatanHTML: "<strong>Revisi kurikulum baru</strong>"
  },
  {
    kode: "EKMA4310",
    judul: "Kepemimpinan",
    kategori: "MK Pilihan",
    upbjj: "Surabaya",
    lokasiRak: "0SBY02",
    harga: 75000,
    qty: 278,
    safety: 30,
    catatanHTML: "Stok tersedia di gudang utama"
  },
  {
    kode: "BIOL4211",
    judul: "Mikrobiologi Dasar",
    kategori: "Praktikum",
    upbjj: "Bandung",
    lokasiRak: "0MLG01",
    harga: 110000,
    qty: 12,
    safety: 20,
    catatanHTML: "Stok <i>menipis</i>, perlu segera re-order"
  },
  {
    kode: "PAUD4401",
    judul: "Perkembangan Anak Usia Dini",
    kategori: "MK Wajib",
    upbjj: "Bandung",
    lokasiRak: "0UPBJJBDG",
    harga: 90000,
    qty: 0,
    safety: 15,
    catatanHTML: "<span style='color:red;'>Stok kosong, menunggu kiriman pusat</span>"
  }
];

var tracking = {
  "DO2025-001": {
    nomorDO: "DO2025-001",
    nim: "031234567",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2025-08-25",
    paket: "PAKET-UT-001",
    total: 120000,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKARTA SELATAN" },
      { waktu: "2025-08-26 08:30:00", keterangan: "Diteruskan ke Kantor Tujuan UPBJJ Medan" }
    ]
  }
};