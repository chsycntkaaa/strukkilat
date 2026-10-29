// Array untuk menyimpan daftar belanjaan
let cart = [];

// Format Angka ke Rupiah
function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

// Fungsi Memperbarui Tanggal & Waktu Real-Time
function updateDateTime() {
  const now = new Date();
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formattedDate = now.toLocaleDateString('id-ID', optionsDate);
  const formattedTime = now.toLocaleTimeString('id-ID', optionsTime);

  document.getElementById('receipt-datetime').innerText = `Tgl/Waktu: ${formattedDate} ${formattedTime}`;
}

// Fungsi Menambahkan Item Ke Cart
document.getElementById('add-item-btn').addEventListener('click', function() {
  const nameInput = document.getElementById('item-name');
  const qtyInput = document.getElementById('item-qty');
  const priceInput = document.getElementById('item-price');

  const name = nameInput.value.trim();
  const qty = parseInt(qtyInput.value);
  const price = parseFloat(priceInput.value);

  if (name === '' || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
    alert('Harap isi nama barang, jumlah, dan harga dengan benar!');
    return;
  }

  // Tambahkan item ke array
  cart.push({ name, qty, price, total: qty * price });

  // Kosongkan input item
  nameInput.value = '';
  qtyInput.value = 1;
  priceInput.value = '';

  renderReceipt();
});

// Fungsi Merender/Memperbarui Tampilan Struk
function renderReceipt() {
  // Update Informasi Header & Kasir
  document.getElementById('receipt-shop-name').innerText = document.getElementById('shop-name').value || 'Kedai Kopi Pelajar';
  document.getElementById('receipt-shop-phone').innerText = document.getElementById('shop-phone').value || '0812-3456-7890';
  document.getElementById('receipt-cashier').innerText = 'Kasir: ' + (document.getElementById('cashier-name').value || 'Budi');

  updateDateTime();

  // Update Daftar Barang
  const itemsList = document.getElementById('items-list');
  itemsList.innerHTML = '';

  let grandTotal = 0;

  cart.forEach(item => {
    grandTotal += item.total;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="col-item">${item.name}</td>
      <td class="col-qty">${item.qty}</td>
      <td class="col-price">${item.price.toLocaleString('id-ID')}</td>
      <td class="col-total">${item.total.toLocaleString('id-ID')}</td>
    `;
    itemsList.appendChild(row);
  });

  // Hitung Total, Bayar, dan Kembali
  const payAmount = parseFloat(document.getElementById('pay-amount').value) || 0;
  const change = payAmount - grandTotal;

  document.getElementById('receipt-grand-total').innerText = formatRupiah(grandTotal);
  document.getElementById('receipt-pay').innerText = formatRupiah(payAmount);
  document.getElementById('receipt-change').innerText = formatRupiah(change > 0 ? change : 0);
}

// Tombol Update Struk
document.getElementById('generate-btn').addEventListener('click', renderReceipt);

// Tombol Unduh Struk Menjadi Gambar (PNG)
document.getElementById('download-btn').addEventListener('click', function() {
  const receiptElement = document.getElementById('receipt-preview');

  html2canvas(receiptElement, { scale: 2 }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'struk-belanja.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});

// Jalankan render awal saat halaman dimuat
renderReceipt();
