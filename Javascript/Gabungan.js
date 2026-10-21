/* #####################################################################
   GABUNGAN.JS  -  SEMUA JAVASCRIPT DALAM SATU FILE
   Gabungan dari: Gabungan.js + daftar.js + stok-app.js + tracking-app.js

   DAFTAR BAGIAN (cari penandanya dengan "BAGIAN 0", "BAGIAN 1", dst.)
     BAGIAN 0 : AKSES ADMIN SITTA -> akun admin, penjaga halaman, menu admin
     BAGIAN 1 : INTI SITUS    (Gabungan.js)   -> login, menu, cek login,
                                                 Dashboard, Stok, Tracking
                (di dalamnya masih ada penomoran 1-7 bawaan file aslinya)
     BAGIAN 2 : BUAT AKUN     (daftar.js)     -> Daftar.html
     BAGIAN 3 : STOK SITTA    (Vue.js)        -> StokAdmin.html     (KHUSUS ADMIN)
     BAGIAN 4 : TRACKING SITTA(Vue.js)        -> TrackingAdmin.html (KHUSUS ADMIN)

   URUTAN MEMUAT <script> DI HTML:
     index / Daftar        : data.js, data2.js, Gabungan.js
     Dashboard/Stok/Tracking: data.js, Gabungan.js
     StokAdmin/TrackingAdmin: Vue (CDN), dataBahanAjar.js, Gabungan.js

   CATATAN: setiap bagian hanya berjalan jika elemen halamannya ada.
   BAGIAN 3 dan 4 hanya jalan untuk akun dengan peran "Admin SITTA";
   akun lain otomatis dikembalikan ke Dashboard.
   (Pembatasan ini ada di sisi browser, cukup untuk tugas/demo, tetapi
   bukan keamanan sungguhan. Untuk itu perlu server/backend.)
   ##################################################################### */

/* #####################################################################
   #####################################################################
   BAGIAN 0: AKSES ADMIN SITTA
   Sumber: (baru)
   Dipakai oleh login, menu navbar, dan halaman admin
   #####################################################################
   ##################################################################### */

/* Akun admin bawaan. Akun ini TIDAK bisa dibuat lewat Daftar.html
   (pilihan peran di form daftar tidak memuat "Admin SITTA"). */
var ROLE_ADMIN = "Admin SITTA";

var AKUN_ADMIN = [
    {
        nama: "Admin SITTA",
        email: "admin@sitta.ut.ac.id",
        password: "admin123",
        role: ROLE_ADMIN,
        lokasi: "UT Pusat"
    }
];

// Apakah user ini Admin SITTA?
function adalahAdmin(user) {
    return !!user && String(user.role || "").trim().toLowerCase() === ROLE_ADMIN.toLowerCase();
}

// Ambil data user yang sedang login (atau null)
function ambilUserLogin() {
    try {
        return JSON.parse(sessionStorage.getItem("userLogin"));
    } catch (e) {
        return null;
    }
}

// Penjaga halaman admin: belum login -> ke login, bukan admin -> ke Dashboard
function cekAdmin() {
    var user = ambilUserLogin();
    if (!user) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = "index.html";
        return null;
    }
    if (!adalahAdmin(user)) {
        alert("Halaman ini hanya tersedia untuk akun Admin SITTA.");
        window.location.href = "Dashboard.html";
        return null;
    }
    return user;
}

// Khusus admin: menu Stok & Tracking biasa dihapus, diganti "Stok SITTA" & "Tracking SITTA"
function tambahMenuAdmin() {
    if (!adalahAdmin(ambilUserLogin())) return;

    // Admin tidak memakai menu Stok & Tracking biasa: hapus dari navbar dan dropdown
    ["Stok.html", "Tracking.html"].forEach(function (href) {
        document.querySelectorAll('.navbar .links a[href="' + href + '"], .dropdown-menu a[href="' + href + '"]').forEach(function (a) {
            var li = a.closest("li");
            if (li) li.remove();
        });
    });

    var menu = [
        ["StokAdmin.html", "Stok SITTA"],
        ["TrackingAdmin.html", "Tracking SITTA"]
    ];
    var halaman = window.location.pathname.split("/").pop().toLowerCase();
    var daftarLink = document.querySelector(".navbar .links");
    var daftarDropdown = document.querySelector(".dropdown-menu ul");

    menu.forEach(function (m) {
        [daftarLink, daftarDropdown].forEach(function (wadah) {
            if (!wadah || wadah.querySelector('a[href="' + m[0] + '"]')) return;

            var li = document.createElement("li");
            if (halaman === m[0].toLowerCase()) li.className = "active";

            var a = document.createElement("a");
            a.href = m[0];
            a.textContent = m[1];
            li.appendChild(a);

            // Disisipkan sebelum "Contact Us" supaya Contact Us tetap di ujung kanan
            var contact = wadah.querySelector('a[href="#ContactUs"]');
            var liContact = contact ? contact.closest("li") : null;
            if (liContact) {
                wadah.insertBefore(li, liContact);
            } else if (wadah === daftarDropdown) {
                wadah.insertBefore(li, wadah.lastElementChild);   // sebelum tombol MyUT
            } else {
                wadah.appendChild(li);
            }
        });
    });
}
/* >>>>>>>>>> AKHIR BAGIAN 0: AKSES ADMIN SITTA <<<<<<<<<< */


/* #####################################################################
   #####################################################################
   BAGIAN 1: INTI SITUS (Login, Menu, Dashboard, Stok, Tracking)
   Sumber: Gabungan.js
   Halaman: index, Dashboard, Stok, Tracking
   #####################################################################
   ##################################################################### */

/* =====================================================================
   GABUNGAN.JS
   Gabungan dari: script.js, Stok.js, Tracking.js, dan <script> di Dashboard.html
   Satu file ini dipakai semua halaman. Setiap bagian hanya berjalan jika
   elemen halamannya ada, jadi aman dimuat di halaman mana pun.

   Daftar bagian:
     1. LOGIN (index.html)
        1a. Efek label floating
        1b. Tampilkan / sembunyikan password
        1c. Form login
     2. UMUM: MENU DROPDOWN (Dashboard, Stok, Tracking)
     3. UMUM: CEK LOGIN
     4. HALAMAN DASHBOARD
     5. HALAMAN STOK
     6. HALAMAN TRACKING
     7. PEMICU HALAMAN (menjalankan bagian sesuai halaman)
   ===================================================================== */


/* =====================================================================
   1. LOGIN (index.html) - dari script.js
   ===================================================================== */
function initLogin() {
    // ----- 1a. Efek label floating -----
    const inputs = document.querySelectorAll(".input");

    function addFocusClass() {
        let parent = this.parentNode;
        parent.classList.add("focus");
    }

    function blurFunc() {
        let parent = this.parentNode;

        if (this.value == "") {
            parent.classList.remove("focus");
        }
    }

    inputs.forEach((input) => {
        input.addEventListener("focus", addFocusClass);
        input.addEventListener("blur", blurFunc);
    });

    // ----- 1b. Tampilkan / sembunyikan password -----
    document.querySelectorAll(".toggle-password").forEach((icon) => {
        icon.addEventListener("click", () => {
            const input = icon.parentNode.querySelector(".input");
            const isHidden = input.type === "password";

            input.type = isHidden ? "text" : "password";
            icon.classList.toggle("ri-eye-line", isHidden);
            icon.classList.toggle("ri-eye-off-line", !isHidden);
        });
    });

    // ----- 1c. Form login -----
    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Cari di akun bawaan (data.js) dan akun baru (data2.js)
        let user = (typeof cariPengguna === "function")
            ? cariPengguna(email)
            : dataPengguna.find(u => u.email === email);

        // Akun Admin SITTA (BAGIAN 0)
        if (!user) user = AKUN_ADMIN.find(u => u.email === email);

        if (user && user.password === password) {
            sessionStorage.setItem("userLogin", JSON.stringify(user));
            alert("Selamat datang " + user.nama + " di PBA UT Medan");
            window.location.href = "Dashboard.html";
        } else if (user) {
            alert("Aduhhh, maaf " + user.nama + ", kata sandi anda yang masukkan salahh.... coba ulangi");
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        } else {
            alert("Aduhhh, maaf, email anda tidak terdaftar.... coba ulangi");
        }
    });
}


/* =====================================================================
   2. UMUM: MENU DROPDOWN (Dashboard, Stok, Tracking)
   ===================================================================== */
function initMenuDropdown() {
    const toggleBtn = document.querySelector('.toggle_btn');
    const toggleBtnIcon = document.querySelector('.toggle_btn i');
    const dropDownMenu = document.querySelector('.dropdown-menu');

    if (!toggleBtn || !dropDownMenu) return;

    function toggleMenu() {
        dropDownMenu.classList.toggle('open');
        const isOpen = dropDownMenu.classList.contains('open');

        toggleBtn.classList.toggle('active', isOpen);
        toggleBtnIcon.className = isOpen ? 'ri-close-line' : 'ri-menu-line';
    }

    toggleBtn.addEventListener('click', toggleMenu);

    // Bisa dibuka lewat keyboard (Enter / Spasi)
    toggleBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Tutup menu saat salah satu link diklik
    dropDownMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            dropDownMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtnIcon.className = 'ri-menu-line';
        });
    });
}


/* =====================================================================
   3. UMUM: CEK LOGIN
   Mengembalikan data user yang login, atau null (lalu diarahkan ke login)
   ===================================================================== */
function cekLogin() {
    const user = JSON.parse(sessionStorage.getItem('userLogin'));
    if (!user) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = 'index.html';
    }
    return user;
}


/* =====================================================================
   4. HALAMAN DASHBOARD - dari <script> di Dashboard.html
   ===================================================================== */
function initDashboard(user) {
    // Tampilkan nama user yang login
    document.getElementById("namaUser").textContent = user.nama;

    // Pencarian bahan ajar dari data.js
    const inputCari = document.getElementById("inputCari");
    const hasilCari = document.getElementById("hasilCari");

    function cariBahanAjar() {
        const kata = inputCari.value.trim().toLowerCase();
        hasilCari.innerHTML = "";
        if (kata === "") return;

        const hasil = dataBahanAjar.filter(function (b) {
            return b.namaBarang.toLowerCase().includes(kata) ||
                   b.kodeBarang.toLowerCase().includes(kata);
        });

        if (hasil.length === 0) {
            hasilCari.innerHTML = '<p class="kosong">Bahan ajar tidak ditemukan.</p>';
            return;
        }

        hasil.forEach(function (b) {
            hasilCari.innerHTML +=
                '<div class="item">' +
                    '<img src="' + b.cover + '" alt="Cover ' + b.namaBarang + '">' +
                    '<div class="info">' +
                        '<h3>' + b.namaBarang + '</h3>' +
                        '<p>Kode: ' + b.kodeBarang + '</p>' +
                        '<p>Jenis: ' + b.jenisBarang + ' | Edisi: ' + b.edisi + '</p>' +
                    '</div>' +
                '</div>';
        });
    }

    document.getElementById("btnCari").addEventListener("click", cariBahanAjar);
    inputCari.addEventListener("input", cariBahanAjar);
}


/* =====================================================================
   5. HALAMAN STOK - dari Stok.js
   ===================================================================== */
function initStok() {
    // ----- Tampilkan daftar BMP dari data.js -----
    const daftarBMP = document.getElementById('daftarBMP');
    const inputCari = document.getElementById('inputCari');

    function tampilkan(list) {
        if (list.length === 0) {
            daftarBMP.innerHTML = '<p class="kosong">Bahan ajar tidak ditemukan.</p>';
            return;
        }

        daftarBMP.innerHTML = list.map(function (b) {
            return `
      <div class="kartu">
        <img src="${b.cover}" alt="Cover ${b.namaBarang}">
        <div class="isi">
          <h3>${b.namaBarang}</h3>
          <p>Kode: ${b.kodeBarang}</p>
          <p>Jenis: ${b.jenisBarang} | Edisi: ${b.edisi}</p>
          <div class="stok-info">Stok: <strong>${b.stok.toLocaleString('id-ID')}</strong></div>
        </div>
      </div>`;
        }).join('');
    }

    // ----- Pencarian -----
    function cariBahanAjar() {
        const kata = inputCari.value.trim().toLowerCase();

        const hasil = dataBahanAjar.filter(function (b) {
            return b.namaBarang.toLowerCase().includes(kata) ||
                   b.kodeBarang.toLowerCase().includes(kata);
        });

        tampilkan(hasil);
    }

    document.getElementById('btnCari').addEventListener('click', cariBahanAjar);
    inputCari.addEventListener('input', cariBahanAjar);

    // Tampilkan semua BMP saat halaman dibuka
    tampilkan(dataBahanAjar);
}


/* =====================================================================
   6. HALAMAN TRACKING - dari Tracking.js
   ===================================================================== */
function initTracking() {
    // ----- Pencarian kode tracking dari data.js (dataTracking) -----
    const inputTracking = document.getElementById('inputTracking');
    const hasilTracking = document.getElementById('hasilTracking');
    const mainTracking = document.getElementById('mainTracking');

    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    // "2025-08-25 10:12:20" -> "25 Agu 2025, 10:12:20"
    function formatWaktu(teks) {
        const bagian = teks.split(' ');
        const tgl = bagian[0].split('-');
        const jam = bagian[1] ? ', ' + bagian[1] : '';
        return parseInt(tgl[2], 10) + ' ' + bulan[parseInt(tgl[1], 10) - 1] + ' ' + tgl[0] + jam;
    }

    function lacak() {
        const kode = inputTracking.value.trim();

        if (kode === '') {
            mainTracking.classList.add('awal');
            hasilTracking.innerHTML = '<p class="petunjuk">Masukkan kode tracking terlebih dahulu.</p>';
            return;
        }

        const data = dataTracking[kode];

        if (!data) {
            mainTracking.classList.add('awal');
            hasilTracking.innerHTML = '<p class="tidak-ditemukan"></p>';
            hasilTracking.querySelector('p').textContent =
                'Kode tracking "' + kode + '" tidak ditemukan. Periksa kembali nomor Anda.';
            return;
        }

        // Ada hasil: kolom pencarian naik ke atas, hasil tampil di bawahnya
        mainTracking.classList.remove('awal');

        // Cari isi paket (kode lokasi) di data bahan ajar
        const bmp = dataBahanAjar.find(function (b) { return b.kodeLokasi === data.paket; });
        const isiPaket = bmp ? bmp.namaBarang + ' (' + bmp.kodeBarang + ')' : data.paket;

        // Posisi terbaru ditampilkan paling atas
        const perjalanan = data.perjalanan.slice().reverse();

        const timeline = perjalanan.map(function (p, i) {
            return `
      <li class="${i === 0 ? 'terbaru' : ''}">
        <div class="waktu">${formatWaktu(p.waktu)}</div>
        <div class="keterangan">${p.keterangan}</div>
      </li>`;
        }).join('');

        hasilTracking.innerHTML = `
    <div class="kartu-tracking">
      <h3>Detail Pengiriman</h3>
      <span class="badge-status">${data.status}</span>
      <div class="baris-info"><span>Nomor DO</span><strong>${kode}</strong></div>
      <div class="baris-info"><span>Nama</span><strong>${data.nama}</strong></div>
      <div class="baris-info"><span>Ekspedisi</span><strong>${data.ekspedisi}</strong></div>
      <div class="baris-info"><span>Tanggal Kirim</span><strong>${formatWaktu(data.tanggalKirim)}</strong></div>
      <div class="baris-info"><span>Paket</span><strong>${isiPaket}</strong></div>
      <div class="baris-info"><span>Total</span><strong>${data.total}</strong></div>
    </div>

    <div class="kartu-tracking">
      <h3>Posisi Pengiriman</h3>
      <ul class="timeline">${timeline}</ul>
    </div>`;
    }

    document.getElementById('btnLacak').addEventListener('click', lacak);

    inputTracking.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') lacak();
    });
}


/* =====================================================================
   7. PEMICU HALAMAN
   Menjalankan bagian yang sesuai dengan elemen yang ada di halaman
   ===================================================================== */
(function () {
    // Halaman login (index.html)
    if (document.getElementById('formLogin')) {
        initLogin();
    }

    // Menu khusus Admin SITTA (hanya muncul untuk admin)
    tambahMenuAdmin();

    // Menu dropdown (Dashboard, Stok, Tracking)
    initMenuDropdown();

    // Halaman yang wajib login
    const adaDashboard = document.getElementById('namaUser');
    const adaStok = document.getElementById('daftarBMP');
    const adaTracking = document.getElementById('hasilTracking');

    if (adaDashboard || adaStok || adaTracking) {
        const user = cekLogin();
        if (!user) return;

        if (adaDashboard) initDashboard(user);
        if (adaStok) initStok();
        if (adaTracking) initTracking();
    }
})();
/* >>>>>>>>>> AKHIR BAGIAN 1: INTI SITUS <<<<<<<<<< */


/* #####################################################################
   #####################################################################
   BAGIAN 2: BUAT AKUN
   Sumber: daftar.js
   Halaman: Daftar.html (butuh data.js + data2.js)
   #####################################################################
   ##################################################################### */

/* =====================================================================
   DAFTAR.JS - Logika halaman Buat Akun
   Membutuhkan: data.js dan data2.js (dimuat lebih dulu di Daftar.html)
   ===================================================================== */
(function () {
    var form = document.getElementById("formDaftar");
    if (!form) return;

    var modal = document.getElementById("modalDaftar");   // ada di index.html (pop-up)
    var pemicu = document.getElementById("bukaDaftar");
    var halamanLogin = !!document.getElementById("formLogin");

    // ----- Pop-up: buka / tutup -----
    function bukaModal() {
        if (!modal) return;
        modal.classList.add("tampil");
        document.body.classList.add("modal-terbuka");
        var f = document.getElementById("regNama");
        if (f) setTimeout(function () { f.focus(); }, 150);
    }

    function tutupModal() {
        if (!modal) return;
        modal.classList.remove("tampil");
        document.body.classList.remove("modal-terbuka");
    }

    if (modal) {
        if (pemicu) pemicu.addEventListener("click", function (e) { e.preventDefault(); bukaModal(); });
        document.querySelectorAll("[data-tutup-daftar]").forEach(function (el) {
            el.addEventListener("click", function (e) { e.preventDefault(); tutupModal(); });
        });
        modal.addEventListener("click", function (e) { if (e.target === modal) tutupModal(); });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.classList.contains("tampil")) tutupModal();
        });
        // Daftar.html lama dialihkan ke index.html#daftar
        if (location.hash === "#daftar") bukaModal();
    }

    // Efek label floating & tampil/sembunyi password sudah dipasang oleh
    // initLogin() di halaman index. Dipasang di sini hanya bila berdiri sendiri.
    if (!halamanLogin) {
        form.querySelectorAll(".input").forEach(function (input) {
            input.addEventListener("focus", function () { this.parentNode.classList.add("focus"); });
            input.addEventListener("blur", function () {
                if (this.value === "") this.parentNode.classList.remove("focus");
            });
        });
        form.querySelectorAll(".toggle-password").forEach(function (icon) {
            icon.addEventListener("click", function () {
                var input = icon.parentNode.querySelector(".input");
                var tersembunyi = input.type === "password";
                input.type = tersembunyi ? "text" : "password";
                icon.classList.toggle("ri-eye-line", tersembunyi);
                icon.classList.toggle("ri-eye-off-line", !tersembunyi);
            });
        });
    }

    // ----- Helper pesan error -----
    function tampilError(idInput, idPesan, pesan) {
        var kotak = document.getElementById(idInput).parentNode;
        document.getElementById(idPesan).textContent = pesan;
        kotak.classList.toggle("salah", pesan !== "");
        return pesan === "";
    }

    function validasi() {
        var nama = document.getElementById("regNama").value.trim();
        var email = document.getElementById("regEmail").value.trim();
        var pass = document.getElementById("regPassword").value;
        var konf = document.getElementById("regKonfirmasi").value;
        var lokasi = document.getElementById("regLokasi").value.trim();

        var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var semuaOk = true;

        semuaOk = tampilError("regNama", "errRegNama",
            nama.length < 3 ? "Nama minimal 3 karakter." : "") && semuaOk;

        var pesanEmail = "";
        if (!polaEmail.test(email)) pesanEmail = "Format email tidak valid.";
        else if (emailSudahTerdaftar(email)) pesanEmail = "Email sudah terdaftar.";
        semuaOk = tampilError("regEmail", "errRegEmail", pesanEmail) && semuaOk;

        semuaOk = tampilError("regPassword", "errRegPassword",
            pass.length < 6 ? "Password minimal 6 karakter." : "") && semuaOk;

        semuaOk = tampilError("regKonfirmasi", "errRegKonfirmasi",
            konf !== pass ? "Password tidak sama." : "") && semuaOk;

        semuaOk = tampilError("regLokasi", "errRegLokasi",
            lokasi === "" ? "Lokasi wajib diisi." : "") && semuaOk;

        return semuaOk;
    }

    // ----- Simpan data akun baru ke Notepad.txt -----
    // Catatan: JavaScript di browser tidak boleh menulis langsung ke file di
    // komputer, jadi file Notepad.txt diunduh otomatis setiap ada akun baru.
    var SIMPAN_PASSWORD = true;      // ubah ke false jika password tidak ingin ikut dicatat
    var KUNCI_LOG = "logAkunNotepad";

    function simpanKeNotepad(akun) {
        var waktu = new Date().toLocaleString("id-ID");
        var baris = [
            "Waktu daftar : " + waktu,
            "Nama         : " + akun.nama,
            "Email        : " + akun.email,
            SIMPAN_PASSWORD ? "Password     : " + akun.password : null,
            "Peran        : " + akun.role,
            "Lokasi       : " + akun.lokasi
        ].filter(function (b) { return b !== null; });

        var catatan = baris.join("\r\n") + "\r\n" + "----------------------------------------" + "\r\n";

        var isiLama = "";
        try { isiLama = localStorage.getItem(KUNCI_LOG) || ""; } catch (e) {}
        var isiBaru = isiLama
            ? isiLama + catatan
            : "DATA AKUN PBA UT MEDAN\r\n========================================\r\n" + catatan;
        try { localStorage.setItem(KUNCI_LOG, isiBaru); } catch (e) {}

        var blob = new Blob([isiBaru], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "Notepad.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    // ----- Kirim form -----
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validasi()) return;

        var peran = document.getElementById("regRole").value;
        var hasil = simpanAkunBaru({
            nama: document.getElementById("regNama").value,
            email: document.getElementById("regEmail").value,
            password: document.getElementById("regPassword").value,
            role: adalahAdmin({ role: peran }) ? "Mahasiswa" : peran,
            lokasi: document.getElementById("regLokasi").value
        });

        if (!hasil.ok) {
            tampilError("regEmail", "errRegEmail", hasil.pesan);
            return;
        }

        simpanKeNotepad(hasil.akun);

        // Kembali ke form login (tetap di halaman yang sama) dengan email terisi
        form.reset();
        form.querySelectorAll(".input-box").forEach(function (k) {
            k.classList.remove("salah");
            if (!k.classList.contains("pilih")) k.classList.remove("focus");
        });
        form.querySelectorAll(".pesan-error").forEach(function (p) { p.textContent = ""; });
        tutupModal();

        var emailLogin = document.getElementById("email");
        var passLogin = document.getElementById("password");
        if (halamanLogin && emailLogin) {
            emailLogin.value = hasil.akun.email;
            emailLogin.parentNode.classList.add("focus");
            if (passLogin) passLogin.focus();
        }
        var info = document.getElementById("infoDaftarBerhasil");
        if (info) {
            info.textContent = "Akun untuk " + hasil.akun.nama + " berhasil dibuat. Silakan masuk.";
            info.classList.add("tampil");
            setTimeout(function () { info.classList.remove("tampil"); }, 6000);
        } else {
            alert("Akun untuk " + hasil.akun.nama + " berhasil dibuat. Silakan masuk.");
        }
    });
})();
/* >>>>>>>>>> AKHIR BAGIAN 2: BUAT AKUN <<<<<<<<<< */

/* #####################################################################
   #####################################################################
   BAGIAN 3: STOK SITTA (Vue.js) - KHUSUS ADMIN
   Sumber: stok-app.js + soal Tugas 2
   Halaman: StokAdmin.html (#stokApp), data: dataBahanAjar.js
   #####################################################################
   ##################################################################### */

document.addEventListener("DOMContentLoaded", function () {
    // Hanya jalan di StokAdmin.html
    if (!document.getElementById("stokApp")) return;
    // Hanya untuk Admin SITTA
    if (!cekAdmin()) return;
    if (typeof Vue === "undefined") {
        alert("Vue.js gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.");
        return;
    }

    var KUNCI_STOK = "stokSITTA";

    function salin(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Fitur catatan sudah dihapus: field catatan/catatanHTML dibuang dari data lama.
    // peringatan: "" (otomatis ikut stok) | "aman" | "menipis" | "kosong"
    function rapikan(item) {
        if (item.peringatan === undefined) item.peringatan = "";
        delete item.catatanHTML;
        delete item.catatan;
        return item;
    }

    // Data awal: dari localStorage bila pernah diubah, kalau tidak dari dataBahanAjar.js
    function muatStok() {
        try {
            var tersimpan = JSON.parse(localStorage.getItem(KUNCI_STOK));
            if (Array.isArray(tersimpan)) return tersimpan.map(rapikan);
        } catch (e) {}
        return salin(stok).map(rapikan);
    }

    function formKosong() {
        return { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: 0, safety: 0, peringatan: "" };
    }

    new Vue({
        el: "#stokApp",

        // ------------------------------------------------------------
        // DATA
        // ------------------------------------------------------------
        data: {
            upbjjList: upbjjList,
            kategoriList: kategoriList,
            stok: muatStok(),

            // pilihan peringatan (warna) pada kolom Peringatan
            opsiPeringatan: [
                { kunci: "", label: "Otomatis (ikut stok)", ikon: "ri-magic-line" },
                { kunci: "aman", label: "Aman", ikon: "ri-checkbox-circle-fill" },
                { kunci: "menipis", label: "Stok menipis", ikon: "ri-error-warning-fill" },
                { kunci: "kosong", label: "Habis stok", ikon: "ri-close-circle-fill" }
            ],
            infoPeringatan: {
                aman: { label: "Aman", ikon: "ri-checkbox-circle-fill" },
                menipis: { label: "Stok menipis", ikon: "ri-error-warning-fill" },
                kosong: { label: "Habis stok", ikon: "ri-close-circle-fill" }
            },

            // filter & sort
            selectedUpbjj: "",
            selectedKategori: "",
            filterReorder: false,
            sortBy: "",
            sortDir: "asc",

            // form tambah / edit (modal)
            modalTampil: false,
            modalMode: "tambah",
            itemEdit: null,
            form: formKosong(),
            errors: {},

            // notifikasi
            pesan: "",
            pesanTimer: null,
            terakhirDiubah: ""
        },

        // ------------------------------------------------------------
        // COMPUTED (di-cache: tidak dihitung ulang kalau data tidak berubah)
        // ------------------------------------------------------------
        computed: {
            // Dependent options: kategori hanya yang ada di UT-Daerah terpilih
            kategoriTersedia: function () {
                var self = this;
                if (!self.selectedUpbjj) return [];
                return self.kategoriList.filter(function (k) {
                    return self.stok.some(function (i) {
                        return i.upbjj === self.selectedUpbjj && i.kategori === k;
                    });
                });
            },

            stokTerfilter: function () {
                var self = this;
                var hasil = self.stok.filter(function (i) {
                    if (self.selectedUpbjj && i.upbjj !== self.selectedUpbjj) return false;
                    if (self.selectedKategori && i.kategori !== self.selectedKategori) return false;
                    if (self.filterReorder && !(i.qty < i.safety || i.qty === 0)) return false;
                    return true;
                });

                if (self.sortBy) {
                    var arah = self.sortDir === "asc" ? 1 : -1;
                    var kunci = self.sortBy;
                    hasil.sort(function (a, b) {
                        if (kunci === "judul") return arah * a.judul.localeCompare(b.judul, "id");
                        return arah * (a[kunci] - b[kunci]);
                    });
                }
                return hasil;
            },

            ringkasan: function () {
                var r = { total: 0, aman: 0, menipis: 0, kosong: 0 };
                var self = this;
                self.stokTerfilter.forEach(function (i) {
                    r.total++;
                    r[self.statusStok(i)]++;
                });
                return r;
            },

            // Jumlah seluruh bahan ajar yang perlu re-order (tidak terpengaruh filter)
            jumlahReorder: function () {
                return this.stok.filter(function (i) {
                    return i.qty < i.safety || i.qty === 0;
                }).length;
            },

            // Pratinjau peringatan di form (mengikuti pilihan, atau stok yang sedang diketik)
            kunciPratinjau: function () {
                var f = this.form;
                return f.peringatan || this.statusStok({ qty: Number(f.qty) || 0, safety: Number(f.safety) || 0 });
            },

            adaFilterAktif: function () {
                return !!(this.selectedUpbjj || this.selectedKategori || this.filterReorder || this.sortBy);
            }
        },

        // ------------------------------------------------------------
        // METHODS
        // ------------------------------------------------------------
        methods: {
            // aman: qty >= safety | menipis: qty < safety | kosong: qty = 0
            statusStok: function (item) {
                if (item.qty === 0) return "kosong";
                if (item.qty < item.safety) return "menipis";
                return "aman";
            },

            // Peringatan yang tampil di kolom Peringatan: pilihan admin, atau otomatis ikut stok
            kunciPeringatan: function (item) {
                return item.peringatan || this.statusStok(item);
            },

            rupiah: function (n) {
                return "Rp " + Number(n).toLocaleString("id-ID");
            },

            toggleArah: function () {
                this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
            },

            resetFilter: function () {
                this.selectedUpbjj = "";
                this.selectedKategori = "";
                this.filterReorder = false;
                this.sortBy = "";
                this.sortDir = "asc";
            },

            tampilPesan: function (teks) {
                var self = this;
                self.pesan = teks;
                clearTimeout(self.pesanTimer);
                self.pesanTimer = setTimeout(function () { self.pesan = ""; }, 3500);
            },

            // ----- modal tambah / edit -----
            bukaTambah: function () {
                this.modalMode = "tambah";
                this.itemEdit = null;
                this.form = formKosong();
                this.errors = {};
                this.modalTampil = true;
            },

            bukaEdit: function (item) {
                this.modalMode = "edit";
                this.itemEdit = item;
                this.form = salin(item);
                this.errors = {};
                this.modalTampil = true;
            },

            tutupModal: function () {
                this.modalTampil = false;
            },

            // ----- validasi sederhana tiap field -----
            validasi: function () {
                var f = this.form;
                var e = {};
                var kode = String(f.kode).trim().toUpperCase();

                if (!kode) {
                    e.kode = "Kode wajib diisi.";
                } else if (!/^[A-Z]{4}\d{4}$/.test(kode)) {
                    e.kode = "Format kode: 4 huruf + 4 angka (contoh: EKMA4116).";
                } else if (this.modalMode === "tambah" && this.stok.some(function (i) {
                    return i.kode === kode && i.upbjj === f.upbjj;
                })) {
                    e.kode = "Kode ini sudah ada di UT-Daerah tersebut.";
                }

                if (String(f.judul).trim().length < 3) e.judul = "Judul minimal 3 karakter.";
                if (this.kategoriList.indexOf(f.kategori) === -1) e.kategori = "Pilih kategori.";
                if (this.upbjjList.indexOf(f.upbjj) === -1) e.upbjj = "Pilih UT-Daerah.";
                if (String(f.lokasiRak).trim().length < 2) e.lokasiRak = "Lokasi rak wajib diisi.";
                if (!(Number(f.harga) > 0)) e.harga = "Harga harus lebih dari 0.";
                if (f.qty === "" || !Number.isInteger(Number(f.qty)) || Number(f.qty) < 0) e.qty = "Stok harus bilangan bulat, minimal 0.";
                if (f.safety === "" || !Number.isInteger(Number(f.safety)) || Number(f.safety) < 0) e.safety = "Safety stock harus bilangan bulat, minimal 0.";

                this.errors = e;
                return Object.keys(e).length === 0;
            },

            simpan: function () {
                if (!this.validasi()) return;

                var f = this.form;
                var data = {
                    kode: String(f.kode).trim().toUpperCase(),
                    judul: String(f.judul).trim(),
                    kategori: f.kategori,
                    upbjj: f.upbjj,
                    lokasiRak: String(f.lokasiRak).trim(),
                    harga: Number(f.harga),
                    qty: Number(f.qty),
                    safety: Number(f.safety),
                    peringatan: f.peringatan
                };

                if (this.modalMode === "tambah") {
                    this.stok.push(data);
                    // Jika data baru tidak terlihat karena filter aktif, reset filter
                    if (this.stokTerfilter.indexOf(data) === -1) this.resetFilter();
                    this.tampilPesan("Bahan ajar " + data.kode + " berhasil ditambahkan.");
                } else {
                    Object.assign(this.itemEdit, data);
                    this.tampilPesan("Data " + data.kode + " berhasil diperbarui.");
                }
                this.tutupModal();
            },

            pulihkanData: function () {
                if (!confirm("Kembalikan semua data stok ke data awal? Perubahan yang sudah dibuat akan hilang.")) return;
                this.stok = salin(window.stok).map(rapikan);
                this.resetFilter();
                this.tampilPesan("Data stok dikembalikan ke data awal.");
            }
        },

        // ------------------------------------------------------------
        // WATCHERS
        // ------------------------------------------------------------
        watch: {
            // 1) Ganti UT-Daerah -> pilihan kategori lama tidak berlaku lagi
            selectedUpbjj: function () {
                this.selectedKategori = "";
            },

            // 2) Data stok berubah (tambah / edit) -> simpan otomatis + catat waktu
            stok: {
                deep: true,
                handler: function (baru) {
                    try { localStorage.setItem(KUNCI_STOK, JSON.stringify(baru)); } catch (e) {}
                    this.terakhirDiubah = new Date().toLocaleTimeString("id-ID");
                }
            },

            // 3) Kode otomatis huruf besar tanpa spasi saat diketik
            "form.kode": function (v) {
                var rapi = String(v).toUpperCase().replace(/\s+/g, "");
                if (rapi !== v) this.form.kode = rapi;
            }
        },

        mounted: function () {
            var self = this;
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") self.tutupModal();
            });
        }
    });
});
/* >>>>>>>>>> AKHIR BAGIAN 3: STOK SITTA <<<<<<<<<< */


/* #####################################################################
   #####################################################################
   BAGIAN 4: TRACKING SITTA (Vue.js) - KHUSUS ADMIN
   Sumber: tracking-app.js + soal Tugas 2
   Halaman: TrackingAdmin.html (#trackingApp), data: dataBahanAjar.js
   #####################################################################
   ##################################################################### */

document.addEventListener("DOMContentLoaded", function () {
    // Hanya jalan di TrackingAdmin.html
    if (!document.getElementById("trackingApp")) return;
    // Hanya untuk Admin SITTA
    if (!cekAdmin()) return;
    if (typeof Vue === "undefined") {
        alert("Vue.js gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.");
        return;
    }

    var KUNCI_DO = "trackingSITTA";
    var BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    function salin(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    // Waktu lokal (bukan UTC) supaya tanggal tidak bergeser
    function tglLokal(d) {
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }

    function jamLokal(d) {
        return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function muatTracking() {
        try {
            var tersimpan = JSON.parse(localStorage.getItem(KUNCI_DO));
            if (tersimpan && typeof tersimpan === "object" && !Array.isArray(tersimpan)) return tersimpan;
        } catch (e) {}
        return salin(tracking);
    }

    function formKosong() {
        return { nim: "", nama: "", ekspedisi: ekspedisiList[0].kode, paketKode: "", tanggalKirim: tglLokal(new Date()) };
    }

    new Vue({
        el: "#trackingApp",

        // ------------------------------------------------------------
        // DATA
        // ------------------------------------------------------------
        data: {
            paketList: paket,
            ekspedisiList: ekspedisiList,
            trackingData: muatTracking(),

            // pencarian
            kodeCari: "",
            kodeHasil: "",
            sudahCari: false,

            // form DO baru (modal)
            modalTampil: false,
            formDO: formKosong(),
            errors: {},

            pesan: "",
            pesanTimer: null
        },

        // ------------------------------------------------------------
        // COMPUTED
        // ------------------------------------------------------------
        computed: {
            daftarNomorDO: function () {
                return Object.keys(this.trackingData);
            },

            // DO + tahun berjalan + nomor urut tahun itu. Contoh: DO2025-001, DO2025-002, ...
            nomorDOBerikutnya: function () {
                var tahun = new Date().getFullYear();
                var maks = 0;
                this.daftarNomorDO.forEach(function (n) {
                    var m = /^DO(\d{4})-(\d+)$/.exec(n);
                    if (m && Number(m[1]) === tahun) maks = Math.max(maks, Number(m[2]));
                });
                return "DO" + tahun + "-" + pad(maks + 1).padStart(3, "0");
            },

            detail: function () {
                return this.kodeHasil ? this.trackingData[this.kodeHasil] : null;
            },

            // Paket pada hasil pencarian (data lama menyimpan kode paket)
            paketDetail: function () {
                if (!this.detail) return null;
                var p = this.detail.paket;
                return this.paketList.find(function (x) { return x.kode === p || x.nama === p; }) || null;
            },

            // Posisi terbaru di paling atas
            perjalananTerbaru: function () {
                return this.detail ? this.detail.perjalanan.slice().reverse() : [];
            },

            paketTerpilih: function () {
                var kode = this.formDO.paketKode;
                return this.paketList.find(function (p) { return p.kode === kode; }) || null;
            },

            totalHarga: function () {
                return this.paketTerpilih ? this.paketTerpilih.harga : 0;
            }
        },

        // ------------------------------------------------------------
        // METHODS
        // ------------------------------------------------------------
        methods: {
            rupiah: function (n) {
                return "Rp " + Number(n).toLocaleString("id-ID");
            },

            // "2025-08-25 10:12:20" -> "25 Agu 2025, 10:12:20"
            formatWaktu: function (teks) {
                var bagian = String(teks).split(" ");
                var tgl = bagian[0].split("-");
                if (tgl.length !== 3) return teks;
                var jam = bagian[1] ? ", " + bagian[1] : "";
                return parseInt(tgl[2], 10) + " " + BULAN[parseInt(tgl[1], 10) - 1] + " " + tgl[0] + jam;
            },

            lacak: function () {
                var kode = this.kodeCari.trim().toUpperCase();
                this.sudahCari = true;
                this.kodeHasil = this.trackingData[kode] ? kode : "";
            },

            lacakDari: function (nomor) {
                this.kodeCari = nomor;
                this.lacak();
            },

            tampilPesan: function (teks) {
                var self = this;
                self.pesan = teks;
                clearTimeout(self.pesanTimer);
                self.pesanTimer = setTimeout(function () { self.pesan = ""; }, 3500);
            },

            // ----- modal DO baru -----
            bukaModal: function () {
                this.formDO = formKosong();
                this.errors = {};
                this.modalTampil = true;
            },

            tutupModal: function () {
                this.modalTampil = false;
            },

            isiHariIni: function () {
                this.formDO.tanggalKirim = tglLokal(new Date());
            },

            validasi: function () {
                var f = this.formDO;
                var e = {};

                if (!/^\d{8,12}$/.test(f.nim)) e.nim = "NIM harus berupa angka, 8-12 digit.";
                if (String(f.nama).trim().length < 3) e.nama = "Nama minimal 3 karakter.";
                if (!this.ekspedisiList.some(function (x) { return x.kode === f.ekspedisi; })) e.ekspedisi = "Pilih ekspedisi.";
                if (!this.paketTerpilih) e.paketKode = "Pilih paket bahan ajar.";
                if (!/^\d{4}-\d{2}-\d{2}$/.test(f.tanggalKirim)) e.tanggalKirim = "Tanggal kirim wajib diisi.";

                this.errors = e;
                return Object.keys(e).length === 0;
            },

            simpanDO: function () {
                if (!this.validasi()) return;

                var f = this.formDO;
                var nomor = this.nomorDOBerikutnya;
                var paketDipilih = this.paketTerpilih;
                var ekspedisi = this.ekspedisiList.find(function (x) { return x.kode === f.ekspedisi; });
                var jam = jamLokal(new Date());

                var entri = {
                    nomorDO: nomor,
                    nim: f.nim,
                    nama: String(f.nama).trim(),
                    status: "Diproses di Gudang UT",
                    ekspedisi: ekspedisi.nama,
                    tanggalKirim: f.tanggalKirim,
                    paket: paketDipilih.kode,
                    total: paketDipilih.harga,
                    perjalanan: [
                        {
                            waktu: f.tanggalKirim + " " + jam,
                            keterangan: "DO dibuat. Paket " + paketDipilih.nama + " sedang disiapkan di gudang UT."
                        }
                    ]
                };

                // $set agar properti baru ikut reaktif (Vue 2)
                this.$set(this.trackingData, nomor, entri);

                this.tutupModal();
                this.lacakDari(nomor);
                this.tampilPesan("Delivery Order " + nomor + " berhasil dibuat.");
            },

            pulihkanData: function () {
                if (!confirm("Kembalikan semua data DO ke data awal? DO yang sudah dibuat akan hilang.")) return;
                this.trackingData = salin(window.tracking);
                this.kodeCari = "";
                this.tampilPesan("Data DO dikembalikan ke data awal.");
            }
        },

        // ------------------------------------------------------------
        // WATCHERS
        // ------------------------------------------------------------
        watch: {
            // 1) Kolom pencarian dikosongkan -> hasil dibersihkan
            kodeCari: function (v) {
                if (v.trim() === "") {
                    this.kodeHasil = "";
                    this.sudahCari = false;
                }
            },

            // 2) Data DO berubah -> simpan otomatis
            trackingData: {
                deep: true,
                handler: function (baru) {
                    try { localStorage.setItem(KUNCI_DO, JSON.stringify(baru)); } catch (e) {}
                }
            },

            // 3) NIM hanya boleh angka
            "formDO.nim": function (v) {
                var angka = String(v).replace(/\D/g, "");
                if (angka !== v) this.formDO.nim = angka;
            },

            // 4) Paket dipilih -> hapus pesan error paket
            "formDO.paketKode": function () {
                if (this.errors.paketKode) this.$delete(this.errors, "paketKode");
            }
        },

        mounted: function () {
            var self = this;
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") self.tutupModal();
            });
        }
    });
});
/* >>>>>>>>>> AKHIR BAGIAN 4: TRACKING SITTA <<<<<<<<<< */