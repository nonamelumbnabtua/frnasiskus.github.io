// Menggabungkan akun hasil pendaftaran (disimpan di localStorage) ke dataPengguna
function muatPenggunaBaru() {
    try {
        const tersimpan = JSON.parse(localStorage.getItem("penggunaBaru")) || [];
        tersimpan.forEach(function (u) {
            const sudahAda = dataPengguna.some(function (d) { return d.email === u.email; });
            if (!sudahAda) dataPengguna.push(u);
        });
    } catch (err) {
        // localStorage tidak tersedia / data rusak: abaikan, pakai data bawaan saja
    }
}

function initLogin() {
    muatPenggunaBaru();

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

    document.querySelectorAll(".toggle-password").forEach((icon) => {
        icon.addEventListener("click", () => {
            const input = icon.parentNode.querySelector(".input");
            const isHidden = input.type === "password";

            input.type = isHidden ? "text" : "password";
            icon.classList.toggle("ri-eye-line", isHidden);
            icon.classList.toggle("ri-eye-off-line", !isHidden);
        });
    });

    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const user = dataPengguna.find(u => u.email === email);

        if (user && user.password === password) {
            sessionStorage.setItem("userLogin", JSON.stringify(user));
            alert("Selamat datang " + user.nama + " di SITTA UT Medan");
            window.location.href = "dashboard.html";
        } else if (user) {
            alert("Aduhhh, maaf " + user.nama + ", kata sandi anda yang masukkan salahh.... coba ulangi");
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        } else {
            alert("Aduhhh, maaf, email anda tidak terdaftar.... coba ulangi");
        }
    });
}

function initDaftar() {
    const modalDaftar = document.getElementById("modalDaftar");
    const formDaftar = document.getElementById("formDaftar");
    const linkDaftar = document.getElementById("linkDaftar");
    const tutupDaftar = document.getElementById("tutupDaftar");

    if (!modalDaftar || !formDaftar || !linkDaftar || !tutupDaftar) return;

    function bukaModal() {
        modalDaftar.hidden = false;
        document.getElementById("daftarNama").focus();
    }

    function tutupModal() {
        modalDaftar.hidden = true;
    }

    linkDaftar.addEventListener("click", bukaModal);
    tutupDaftar.addEventListener("click", tutupModal);

    // klik area gelap di luar kotak modal juga menutup modal
    modalDaftar.addEventListener("click", function (e) {
        if (e.target === modalDaftar) tutupModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modalDaftar.hidden) tutupModal();
    });

    formDaftar.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = document.getElementById("daftarNama").value.trim();
        const email = document.getElementById("daftarEmail").value.trim().toLowerCase();
        const password = document.getElementById("daftarPassword").value;
        const konfirmasi = document.getElementById("daftarKonfirmasi").value;

        if (nama === "" || email === "" || password === "" || konfirmasi === "") {
            alert("Semua kolom wajib diisi.");
            return;
        }

        if (password.length < 6) {
            alert("Kata sandi minimal 6 karakter.");
            document.getElementById("daftarPassword").focus();
            return;
        }

        if (password !== konfirmasi) {
            alert("Konfirmasi kata sandi tidak sama dengan kata sandi.... coba ulangi");
            document.getElementById("daftarKonfirmasi").value = "";
            document.getElementById("daftarKonfirmasi").focus();
            return;
        }

        const sudahAda = dataPengguna.some(function (u) { return u.email === email; });
        if (sudahAda) {
            alert("Maaf, email tersebut sudah terdaftar. Silakan masuk atau gunakan email lain.");
            document.getElementById("daftarEmail").focus();
            return;
        }

        const penggunaBaru = {
            id: dataPengguna.length + 1,
            nama: nama,
            email: email,
            password: password,
            role: "Mahasiswa",
            lokasi: "UT Medan"
        };

        dataPengguna.push(penggunaBaru);

        try {
            const tersimpan = JSON.parse(localStorage.getItem("penggunaBaru")) || [];
            tersimpan.push(penggunaBaru);
            localStorage.setItem("penggunaBaru", JSON.stringify(tersimpan));
        } catch (err) {
            // Jika localStorage tidak tersedia, akun hanya berlaku sampai halaman dimuat ulang
        }

        alert("Pendaftaran berhasil! Silakan masuk dengan akun " + nama + ".");

        formDaftar.reset();
        formDaftar.querySelectorAll(".input-box").forEach(function (box) {
            box.classList.remove("focus");
        });

        tutupModal();

        const inputEmail = document.getElementById("email");
        inputEmail.value = email;
        inputEmail.parentNode.classList.add("focus");
        document.getElementById("password").focus();
    });
}

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

    toggleBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    dropDownMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            dropDownMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtnIcon.className = 'ri-menu-line';
        });
    });
}

function cekLogin() {
    const user = JSON.parse(sessionStorage.getItem('userLogin'));
    if (!user) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = 'index.html';
    }
    return user;
}

function initDashboard(user) {
    document.getElementById("namaUser").textContent = user.nama;

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

function initStok() {
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

    tampilkan(dataBahanAjar);
}

function initTracking() {
    const inputTracking = document.getElementById('inputTracking');
    const hasilTracking = document.getElementById('hasilTracking');
    const mainTracking = document.getElementById('mainTracking');

    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

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

        mainTracking.classList.remove('awal');

        const bmp = dataBahanAjar.find(function (b) { return b.kodeLokasi === data.paket; });
        const isiPaket = bmp ? bmp.namaBarang + ' (' + bmp.kodeBarang + ')' : data.paket;

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

(function () {
    if (document.getElementById('formLogin')) {
        initLogin();
        initDaftar();
    }

    initMenuDropdown();

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