const form = document.getElementById("formDaftar");

if (form) {
  const KEY = "vocs_pendaftar";
  const ambil = () => JSON.parse(localStorage.getItem(KEY) || "[]");
  const simpan = (data) => localStorage.setItem(KEY, JSON.stringify(data));
  const daftarEl = document.getElementById("daftarPendaftar");
  const jumlahEl = document.getElementById("jumlah");

  // Tampilkan daftar pendaftar + jumlahnya
  function tampil() {
    const semua = ambil();
    jumlahEl.textContent = semua.length;
    daftarEl.innerHTML = "";

    if (semua.length === 0) {
      daftarEl.innerHTML = '<p class="kosong">Belum ada pendaftar. Isi formulir di samping.</p>';
      return;
    }

    semua.forEach((d) => {
      const item = document.createElement("div");
      item.className = "pendaftar";

      const info = document.createElement("div");
      const nama = document.createElement("strong");
      nama.textContent = d.nama;
      const detail = document.createElement("small");
      detail.textContent = d.nim + " • " + d.Divisi;
      info.append(nama, document.createElement("br"), detail);

      const tombol = document.createElement("button");
      tombol.type = "button";
      tombol.className = "btn-hapus";
      tombol.textContent = "Hapus";
      tombol.dataset.nim = d.nim;
      tombol.setAttribute("aria-label", "Hapus " + d.nama);

      item.append(info, tombol);
      daftarEl.append(item);
    });
  }

  // Hapus satu pendaftar
  daftarEl.addEventListener("click", (e) => {
    const tombol = e.target.closest(".btn-hapus");
    if (!tombol) return;
    if (!confirm("Hapus pendaftar ini?")) return;
    simpan(ambil().filter((d) => d.nim !== tombol.dataset.nim));
    tampil();
  });

  // Hapus semua pendaftar
  document.getElementById("hapusSemua").addEventListener("click", () => {
    if (ambil().length === 0) return;
    if (!confirm("Hapus SEMUA pendaftar?")) return;
    localStorage.removeItem(KEY);
    tampil();
  });

  document.getElementById("nim").addEventListener("input", (e) => e.target.setCustomValidity(""));

  // Kirim formulir
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const semua = ambil();

    if (semua.some((d) => d.nim === data.nim)) {
      document.getElementById("nim").setCustomValidity("NIM sudah terdaftar");
    }
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    semua.push(data);
    simpan(semua);
    document.getElementById("namaSukses").textContent = data.nama;
    new bootstrap.Modal(document.getElementById("modalSukses")).show();
    form.reset();
    form.classList.remove("was-validated");
    tampil();
  });

  tampil();
}