/* =====================================================================
   DATA2.JS - Penyimpanan akun baru (hasil fitur "Buat Akun")
   ---------------------------------------------------------------------
<<<<<<< HEAD
   Akun baru disimpan DI FILE INI, pada blok di antara tanda
   AKUN-MULAI dan AKUN-SELESAI di bawah. Blok itu ditulis otomatis
   oleh fungsi simpanDataPenggunaKeFile() setiap ada akun baru.
   JANGAN mengubah tanda AKUN-MULAI / AKUN-SELESAI.

   Cara kerjanya (karena JavaScript browser tidak boleh menulis file
   sembarangan):
   1. Pertama kali ada akun baru, browser (Chrome/Edge) meminta Anda
      memilih file data2.js ini SATU KALI lalu klik "Edit file".
   2. Selanjutnya akun baru langsung ditulis ke file ini.
   3. Bila browser tidak mendukung (mis. Firefox) atau dibuka lewat
      file://, file data2.js yang sudah diperbarui akan diunduh -
      tinggal timpa file ini.
   Cadangan: akun juga disimpan di localStorage ("dataPengguna2") agar
   login tetap bisa langsung dipakai.

   Akun bawaan di data.js (dataPengguna) tetap dipakai.
=======
   CATATAN PENTING:
   JavaScript di browser TIDAK bisa menulis langsung ke file .js.
   Karena itu akun baru disimpan di localStorage browser dengan kunci
   "dataPengguna2". File data2.js inilah yang mengelola datanya:
   membaca, menyimpan, mencari, dan mengecek email.

   Akun bawaan di data.js (dataPengguna) tetap dipakai.
   Variabel dataPengguna2 selalu berisi akun baru yang sudah tersimpan.
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc
   ===================================================================== */

var KUNCI_AKUN_BARU = "dataPengguna2";

<<<<<<< HEAD
/* ---------- DATA AKUN (ditulis otomatis) ---------- */
/*AKUN-MULAI*/
var akunTersimpanDiFile = [
  {
    "id": 6,
    "nama": "Lasro Fransiskus Lumban Batu",
    "email": "lasro@ut.ac.id",
    "password": "lasro123",
    "role": "Mahasiswa",
    "lokasi": "UPBJJ Jogjakarta",
    "dibuat": "2026-10-17T08:28:48.124Z"
  },
  {
    "id": 7,
    "nama": "Gilbert Nainggolan",
    "email": "Gilbert@ugm.ac.id",
    "password": "gilbert123",
    "role": "Mahasiswa",
    "lokasi": "Universitas Gajahmadja",
    "dibuat": "2026-10-17T08:48:49.460Z"
  },
  {
    "id": 8,
    "nama": "Valentinus Nababan",
    "email": "valen@ub.ac.id",
    "password": "valen123",
    "role": "Mahasiswa",
    "lokasi": "Universitas Brawijaya",
    "dibuat": "2026-10-17T09:45:35.292Z"
  },
  {
    "id": 9,
    "nama": "Gilbert Nainggolan",
    "email": "gilbertnainggolan@ugm.ac.id",
    "password": "gilbert123",
    "role": "Mahasiswa",
    "lokasi": "Universitas Gajah Mada",
    "dibuat": "2026-10-22T13:36:52.989Z"
  }
];
/*AKUN-SELESAI*/

/* Ambil akun baru dari cadangan localStorage */
=======
/* Ambil semua akun baru dari penyimpanan */
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc
function ambilAkunBaru() {
  try {
    var teks = localStorage.getItem(KUNCI_AKUN_BARU);
    var data = teks ? JSON.parse(teks) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

<<<<<<< HEAD
/* Gabungkan beberapa daftar akun, email yang sama hanya diambil sekali */
function gabungAkun() {
  var hasil = [];
  var sudah = {};
  for (var i = 0; i < arguments.length; i++) {
    (arguments[i] || []).forEach(function (u) {
      var kunci = String(u.email).trim().toLowerCase();
      if (!sudah[kunci]) { sudah[kunci] = true; hasil.push(u); }
    });
  }
  return hasil;
}

/* Variabel yang selalu berisi semua akun baru (file + cadangan) */
/* Akun yang dihapus: tidak akan dipakai lagi, dan dibersihkan dari localStorage */
var AKUN_DIHAPUS = ["admin@sitta.ut.ac.id"];

function bukanAkunDihapus(u) {
  return AKUN_DIHAPUS.indexOf(String(u.email).trim().toLowerCase()) === -1;
}

var dataPengguna2 = gabungAkun(akunTersimpanDiFile, ambilAkunBaru()).filter(bukanAkunDihapus);

try {
  if (localStorage.getItem(KUNCI_AKUN_BARU)) {
    localStorage.setItem(KUNCI_AKUN_BARU, JSON.stringify(dataPengguna2));
  }
} catch (e) {}
=======
/* Variabel yang selalu mencerminkan isi penyimpanan */
var dataPengguna2 = ambilAkunBaru();
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc

/* Gabungan akun bawaan (data.js) + akun baru */
function semuaPengguna() {
  var bawaan = (typeof dataPengguna !== "undefined") ? dataPengguna : [];
<<<<<<< HEAD
  return bawaan.concat(dataPengguna2).filter(bukanAkunDihapus);
=======
  return bawaan.concat(dataPengguna2);
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc
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

<<<<<<< HEAD
  /* cadangan di localStorage (kegagalan di sini tidak fatal) */
  try {
    localStorage.setItem(KUNCI_AKUN_BARU, JSON.stringify(dataPengguna2));
  } catch (e) {}
=======
  try {
    localStorage.setItem(KUNCI_AKUN_BARU, JSON.stringify(dataPengguna2));
  } catch (e) {
    dataPengguna2.pop();
    return { ok: false, pesan: "Penyimpanan browser tidak tersedia." };
  }
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc

  return { ok: true, akun: baru };
}

<<<<<<< HEAD

/* =====================================================================
   MENULIS AKUN BARU KE FILE data2.js
   ===================================================================== */

/* Ganti isi blok AKUN-MULAI ... AKUN-SELESAI pada teks data2.js */
function buatIsiData2Baru(teksLama, daftar) {
  var blok = "/*AKUN-MULAI*/\nvar akunTersimpanDiFile = " +
             JSON.stringify(daftar, null, 2) + ";\n/*AKUN-SELESAI*/";
  var pola = /\/\*AKUN-MULAI\*\/[\s\S]*?\/\*AKUN-SELESAI\*\//;
  if (!pola.test(teksLama)) return null;
  return teksLama.replace(pola, function () { return blok; });
}

/* Simpan "pegangan" file di IndexedDB supaya tidak memilih file berulang kali */
function bukaDBBerkas() {
  return new Promise(function (ok, gagal) {
    var r = indexedDB.open("pbaUtMedan", 1);
    r.onupgradeneeded = function () { r.result.createObjectStore("berkas"); };
    r.onsuccess = function () { ok(r.result); };
    r.onerror = function () { gagal(r.error); };
  });
}
function ambilHandleData2() {
  return bukaDBBerkas().then(function (db) {
    return new Promise(function (ok) {
      var q = db.transaction("berkas").objectStore("berkas").get("data2");
      q.onsuccess = function () { ok(q.result || null); };
      q.onerror = function () { ok(null); };
    });
  }).catch(function () { return null; });
}
function simpanHandleData2(handle) {
  return bukaDBBerkas().then(function (db) {
    return new Promise(function (ok) {
      var t = db.transaction("berkas", "readwrite");
      t.objectStore("berkas").put(handle, "data2");
      t.oncomplete = function () { ok(); };
      t.onerror = function () { ok(); };
    });
  }).catch(function () {});
}

/* Cadangan: unduh data2.js yang sudah diperbarui */
async function unduhData2(daftar) {
  var tag = document.querySelector('script[src$="data2.js"]');
  var alamat = tag ? tag.src : "Javascript/data2.js";
  var r = await fetch(alamat, { cache: "no-store" });
  var teks = buatIsiData2Baru(await r.text(), daftar);
  if (!teks) throw new Error("tanda AKUN-MULAI tidak ditemukan");
  var url = URL.createObjectURL(new Blob([teks], { type: "text/javascript;charset=utf-8" }));
  var a = document.createElement("a");
  a.href = url;
  a.download = "data2.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* Tulis semua akun baru ke data2.js.
   Mengembalikan: "file" (tertulis langsung), "unduh" (file diunduh),
   atau "gagal". Panggil dari event klik/submit (butuh interaksi pengguna). */
async function simpanDataPenggunaKeFile() {
  var daftar = dataPengguna2.slice();

  if (window.showOpenFilePicker) {
    try {
      var handle = await ambilHandleData2();
      if (handle) {
        var izin = await handle.queryPermission({ mode: "readwrite" });
        if (izin !== "granted") izin = await handle.requestPermission({ mode: "readwrite" });
        if (izin !== "granted") handle = null;
      }

      if (!handle) {
        alert("Pilih file data2.js milik proyek ini (folder Javascript), lalu klik \"Edit file\" agar akun baru bisa disimpan di dalamnya.");
        var pilihan = await window.showOpenFilePicker({
          multiple: false,
          types: [{ description: "data2.js", accept: { "text/javascript": [".js"] } }]
        });
        handle = pilihan[0];
        if (handle.name.toLowerCase() !== "data2.js") {
          alert("File yang dipilih bukan data2.js, akun belum disimpan ke file.");
          return "gagal";
        }
        var izinBaru = await handle.requestPermission({ mode: "readwrite" });
        if (izinBaru !== "granted") return "gagal";
        await simpanHandleData2(handle);
      }

      var teksLama = await (await handle.getFile()).text();
      var teksBaru = buatIsiData2Baru(teksLama, daftar);
      if (!teksBaru) {
        alert("Tanda AKUN-MULAI / AKUN-SELESAI tidak ditemukan di file yang dipilih.");
        return "gagal";
      }
      var tulis = await handle.createWritable();
      await tulis.write(teksBaru);
      await tulis.close();
      return "file";
    } catch (e) {
      if (e && e.name === "AbortError") return "gagal";   // pilih file dibatalkan
      /* galat lain: coba cadangan unduh di bawah */
    }
  }

  try {
    await unduhData2(daftar);
    return "unduh";
  } catch (e) {
    return "gagal";
  }
}

/* Opsional: lihat isi blok akun sebagai teks (jalankan di Console) */
function exportDataPengguna2() {
  var teks = "var akunTersimpanDiFile = " + JSON.stringify(dataPengguna2, null, 2) + ";";
=======
/* Opsional: ekspor akun baru sebagai teks, bisa ditempel ke file ini
   (jalankan exportDataPengguna2() di Console browser) */
function exportDataPengguna2() {
  var teks = "var dataPengguna2 = " + JSON.stringify(ambilAkunBaru(), null, 2) + ";";
>>>>>>> 367b64dba81395dea6ad8271826ae284cd46bcdc
  console.log(teks);
  return teks;
}