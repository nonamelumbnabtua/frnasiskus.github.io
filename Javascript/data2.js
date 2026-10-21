/* =====================================================================
   DATA2.JS - Penyimpanan akun baru (hasil fitur "Buat Akun")
   ---------------------------------------------------------------------
   CATATAN PENTING:
   JavaScript di browser TIDAK bisa menulis langsung ke file .js.
   Karena itu akun baru disimpan di localStorage browser dengan kunci
   "dataPengguna2". File data2.js inilah yang mengelola datanya:
   membaca, menyimpan, mencari, dan mengecek email.

   Akun bawaan di data.js (dataPengguna) tetap dipakai.
   Variabel dataPengguna2 selalu berisi akun baru yang sudah tersimpan.
   ===================================================================== */

var KUNCI_AKUN_BARU = "dataPengguna2";

/* Ambil semua akun baru dari penyimpanan */
function ambilAkunBaru() {
  try {
    var teks = localStorage.getItem(KUNCI_AKUN_BARU);
    var data = teks ? JSON.parse(teks) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

/* Variabel yang selalu mencerminkan isi penyimpanan */
var dataPengguna2 = ambilAkunBaru();

/* Gabungan akun bawaan (data.js) + akun baru */
function semuaPengguna() {
  var bawaan = (typeof dataPengguna !== "undefined") ? dataPengguna : [];
  return bawaan.concat(dataPengguna2);
}

/* Cek apakah email sudah terdaftar (tidak peka huruf besar/kecil) */
function emailSudahTerdaftar(email) {
  var cari = String(email).trim().toLowerCase();
  return semuaPengguna().some(function (u) {
    return u.email.toLowerCase() === cari;
  });
}

/* Cari satu pengguna berdasarkan email */
function cariPengguna(email) {
  var cari = String(email).trim().toLowerCase();
  return semuaPengguna().find(function (u) {
    return u.email.toLowerCase() === cari;
  });
}

/* Simpan akun baru. Mengembalikan { ok: true, akun } atau { ok: false, pesan } */
function simpanAkunBaru(akun) {
  if (emailSudahTerdaftar(akun.email)) {
    return { ok: false, pesan: "Email sudah terdaftar. Gunakan email lain." };
  }

  var idTerakhir = semuaPengguna().reduce(function (maks, u) {
    return Math.max(maks, u.id || 0);
  }, 0);

  var baru = {
    id: idTerakhir + 1,
    nama: akun.nama.trim(),
    email: akun.email.trim(),
    password: akun.password,
    role: akun.role,
    lokasi: akun.lokasi.trim(),
    dibuat: new Date().toISOString()
  };

  dataPengguna2.push(baru);

  try {
    localStorage.setItem(KUNCI_AKUN_BARU, JSON.stringify(dataPengguna2));
  } catch (e) {
    dataPengguna2.pop();
    return { ok: false, pesan: "Penyimpanan browser tidak tersedia." };
  }

  return { ok: true, akun: baru };
}

/* Opsional: ekspor akun baru sebagai teks, bisa ditempel ke file ini
   (jalankan exportDataPengguna2() di Console browser) */
function exportDataPengguna2() {
  var teks = "var dataPengguna2 = " + JSON.stringify(ambilAkunBaru(), null, 2) + ";";
  console.log(teks);
  return teks;
}