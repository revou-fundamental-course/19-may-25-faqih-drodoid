// ======================
// Variabel & Konstanta Global
// ======================

// Mode konversi: true = Celsius ke Fahrenheit, false = Fahrenheit ke Celsius
let isCelsiusToFahrenheit = true;

// Key untuk menyimpan tema dan history di localStorage
const themeKey = "suhu-theme";
const historyKey = "suhu-history";

// Array untuk menyimpan riwayat konversi (maksimal 10 item)
let conversionHistory = [];

// Status panel riwayat (history) terbuka/tidak
let isHistoryOpen = false;

// ======================
// Fungsi Tema (Dark/Light)
// ======================

// Fungsi untuk menerapkan tema pada elemen <body>
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Fungsi untuk update icon matahari/bulan sesuai tema
function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  if (document.body.classList.contains("dark-mode")) {
    icon.textContent = "🌙";
  } else {
    icon.textContent = "☀️";
  }
}

// Toggle mode tema antara dark & light (dan simpan ke localStorage)
function toggleTheme() {
  const isDark = document.body.classList.contains("dark-mode");
  if (isDark) {
    applyTheme("light");
    localStorage.setItem(themeKey, "light");
  } else {
    applyTheme("dark");
    localStorage.setItem(themeKey, "dark");
  }
  updateThemeIcon();
}

// ======================
// Fungsi Riwayat Konversi (History)
// ======================

// Mengambil data history dari localStorage
function loadHistory() {
  try {
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      conversionHistory = JSON.parse(savedHistory);
      displayHistory();
    }
  } catch (error) {
    console.log("Error loading history:", error);
    conversionHistory = [];
  }
}

// Menyimpan data history ke localStorage
function saveHistory() {
  try {
    localStorage.setItem(historyKey, JSON.stringify(conversionHistory));
  } catch (error) {
    console.log("Error saving history:", error);
  }
}

// Menambah 1 konversi ke array history dan update panel
function addToHistory(inputValue, outputValue, fromUnit, toUnit, formula) {
  const historyItem = {
    id: Date.now(),
    input: inputValue,
    output: outputValue,
    fromUnit: fromUnit,
    toUnit: toUnit,
    formula: formula,
    timestamp: new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Tambahkan data baru di awal array
  conversionHistory.unshift(historyItem);

  // Batasi agar maksimal hanya 10 data terbaru
  if (conversionHistory.length > 10) {
    conversionHistory = conversionHistory.slice(0, 10);
  }

  saveHistory();
  displayHistory();
}

// Tampilkan isi riwayat pada panel history di samping
function displayHistory() {
  const historyList = document.getElementById("historyList");

  // Jika belum ada riwayat, tampilkan pesan
  if (conversionHistory.length === 0) {
    historyList.innerHTML = `
      <div class="no-history">
        <p>Belum ada riwayat konversi</p>
        <small>Mulai konversi untuk melihat riwayat</small>
      </div>
    `;
    return;
  }

  // Jika ada, render tiap item history
  let htmlContent = "";
  conversionHistory.forEach((item) => {
    htmlContent += `
      <div class="history-item" onclick="loadFromHistory(${item.input}, '${
      item.fromUnit
    }')">
        <div class="history-item-header">
          <div class="history-conversion">
            ${item.input}°${item.fromUnit} → ${item.output}°${item.toUnit}
          </div>
          <div class="history-time">${item.timestamp}</div>
        </div>
        <div class="history-details">
          Konversi dari ${
            item.fromUnit === "C" ? "Celsius" : "Fahrenheit"
          } ke ${item.toUnit === "C" ? "Celsius" : "Fahrenheit"}
        </div>
        <div class="history-formula">${item.formula}</div>
      </div>
    `;
  });

  historyList.innerHTML = htmlContent;
}

// Load data dari item riwayat yang diklik ke form utama
function loadFromHistory(inputValue, fromUnit) {
  // Set mode konversi sesuai dengan history (C ke F atau F ke C)
  const shouldBeCtoF = fromUnit === "C";
  if (isCelsiusToFahrenheit !== shouldBeCtoF) {
    reverseMode();
  }

  // Masukkan nilai input ke kolom input
  document.getElementById("inputTemp").value = inputValue;

  // Otomatis konversi
  convertTemperature();

  // Tutup panel riwayat jika di mobile
  if (window.innerWidth <= 600) {
    toggleHistory();
  }
}

// Toggle buka/tutup panel riwayat
function toggleHistory() {
  const historyPanel = document.getElementById("historyPanel");
  const toggleBtn = document.getElementById("toggleHistoryBtn");

  isHistoryOpen = !isHistoryOpen;

  if (isHistoryOpen) {
    historyPanel.classList.add("active");
    toggleBtn.classList.add("active");
    toggleBtn.innerHTML = "✕"; // icon silang
  } else {
    historyPanel.classList.remove("active");
    toggleBtn.classList.remove("active");
    toggleBtn.innerHTML = "📜"; // icon riwayat
  }
}

// Hapus seluruh riwayat konversi
function clearHistory() {
  if (confirm("Yakin ingin menghapus semua riwayat konversi?")) {
    conversionHistory = [];
    saveHistory();
    displayHistory();
  }
}

// ======================
// Event Listener dan Inisialisasi
// ======================

document.addEventListener("DOMContentLoaded", function () {
  // Terapkan tema sesuai yang tersimpan
  const savedTheme = localStorage.getItem(themeKey) || "light";
  applyTheme(savedTheme);
  updateThemeIcon();

  // Ambil data history dari localStorage
  loadHistory();

  // Event tombol ganti tema
  const themeBtn = document.getElementById("toggleThemeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Event input: klik Enter langsung konversi
  const inputField = document.getElementById("inputTemp");
  if (inputField) {
    inputField.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        convertTemperature();
      }
    });
  }

  // Jika klik di luar panel history (desktop), panel akan tertutup otomatis
  document.addEventListener("click", function (event) {
    if (window.innerWidth > 600) {
      const historyPanel = document.getElementById("historyPanel");
      const toggleBtn = document.getElementById("toggleHistoryBtn");

      if (
        isHistoryOpen &&
        !historyPanel.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        toggleHistory();
      }
    }
  });

  // Reset tampilan kalkulator & fokus ke input saat pertama kali load
  resetCalculator();
});

// ======================
// Fungsi Utama Kalkulasi Suhu
// ======================

function convertTemperature() {
  const inputValue = parseFloat(document.getElementById("inputTemp").value);

  // Validasi: harus angka
  if (isNaN(inputValue)) {
    showError("Sebelum Klik Konversi Masukin Angka Dulu ya🙏😌");
    return;
  }

  let result;
  let calculationSteps;
  let formula;
  let fromUnit, toUnit;

  if (isCelsiusToFahrenheit) {
    // Konversi Celsius ke Fahrenheit: °F = (°C × 9/5) + 32
    result = (inputValue * 9) / 5 + 32;
    fromUnit = "C";
    toUnit = "F";
    formula = `${inputValue}°C = (${inputValue} × 9/5) + 32 = ${result.toFixed(
      2
    )}°F`;

    // Detail langkah perhitungan
    calculationSteps = `
      <div class="formula">°F = (°C × 9/5) + 32</div>
      <div class="formula">°F = (${inputValue} × 9/5) + 32</div>
      <div class="formula">°F = (${inputValue} × 1.8) + 32</div>
      <div class="formula">°F = ${(inputValue * 1.8).toFixed(2)} + 32</div>
      <div class="formula">°F = ${result.toFixed(2)}</div>
    `;
  } else {
    // Konversi Fahrenheit ke Celsius: °C = (°F - 32) × 5/9
    result = ((inputValue - 32) * 5) / 9;
    fromUnit = "F";
    toUnit = "C";
    formula = `${inputValue}°F = (${inputValue} - 32) × 5/9 = ${result.toFixed(
      2
    )}°C`;

    // Detail langkah perhitungan
    calculationSteps = `
      <div class="formula">°C = (°F - 32) × 5/9</div>
      <div class="formula">°C = (${inputValue} - 32) × 5/9</div>
      <div class="formula">°C = ${(inputValue - 32).toFixed(2)} × 5/9</div>
      <div class="formula">°C = ${(inputValue - 32).toFixed(2)} × 0.556</div>
      <div class="formula">°C = ${result.toFixed(2)}</div>
    `;
  }

  // Tampilkan hasil pada kolom output
  document.getElementById("outputTemp").value = result.toFixed(2);

  // Tampilkan langkah perhitungan di panel bawah
  document.getElementById("calculationSteps").innerHTML = calculationSteps;

  // Tambahkan hasil ke riwayat
  addToHistory(inputValue, result.toFixed(2), fromUnit, toUnit, formula);
}

// ======================
// Fungsi Reverse Mode (balik arah konversi)
// ======================

function reverseMode() {
  isCelsiusToFahrenheit = !isCelsiusToFahrenheit;

  // Update tampilan UI sesuai mode
  updateModeDisplay();
  resetCalculator();
}

// Update label, judul rumus, dan info sesuai mode aktif
function updateModeDisplay() {
  const modeIndicator = document.getElementById("modeIndicator");
  const inputLabel = document.getElementById("inputLabel");
  const outputLabel = document.getElementById("outputLabel");
  const conversionTitle = document.getElementById("conversionTitle");
  const conversionFormula = document.getElementById("conversionFormula");
  const conversionExample = document.getElementById("conversionExample");

  if (isCelsiusToFahrenheit) {
    modeIndicator.textContent = "Mode: Celsius ke Fahrenheit";
    inputLabel.textContent = "Celsius (°C):";
    outputLabel.textContent = "Fahrenheit (°F):";
    conversionTitle.textContent =
      "Rumus Konversi Dari Celsius (°C) ke Fahrenheit (°F)";
    conversionFormula.textContent = "°F = (°C × 9/5) + 32";
    conversionExample.textContent = "Contoh: 0°C = (0 × 9/5) + 32 = 32°F";
  } else {
    modeIndicator.textContent = "Mode: Fahrenheit ke Celsius";
    inputLabel.textContent = "Fahrenheit (°F):";
    outputLabel.textContent = "Celsius (°C):";
    conversionTitle.textContent =
      "Rumus Konversi Dari Fahrenheit (°F) ke Celsius (°C)";
    conversionFormula.textContent = "°C = (°F - 32) × 5/9";
    conversionExample.textContent = "Contoh: 32°F = (32 - 32) × 5/9 = 0°C";
  }
}

// ======================
// Fungsi Reset Kalkulator
// ======================

function resetCalculator() {
  document.getElementById("inputTemp").value = "";
  document.getElementById("outputTemp").value = "";
  document.getElementById("calculationSteps").innerHTML = `
    <p style="color: #999; font-style: italic;">Masukkan nilai suhu dan klik "Konversi" untuk melihat perhitungan</p>
  `;

  // Update tampilan mode
  updateModeDisplay();

  // Fokus otomatis ke input suhu
  document.getElementById("inputTemp").focus();
}

// ======================
// Fungsi Nampilin Error
// ======================

function showError(message) {
  const errorBox = document.getElementById("errorMessage");
  errorBox.textContent = message;
  errorBox.classList.add("show");

  // Sembunyiin error box otomatis setelah 3 detik
  setTimeout(() => {
    errorBox.classList.remove("show");
  }, 3000);
}
