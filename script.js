// Array untuk menyimpan data barang yang dibeli
let cart = [];

// Elemen DOM
const storeNameInput = document.getElementById('storeName');
const itemNameInput = document.getElementById('itemName');
const itemQtyInput = document.getElementById('itemQty');
const itemPriceInput = document.getElementById('itemPrice');
const paymentAmountInput = document.getElementById('paymentAmount');

const addItemBtn = document.getElementById('addItemBtn');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');

const cartList = document.getElementById('cartList');
const receiptStoreTitle = document.getElementById('receiptStoreTitle');
const receiptDate = document.getElementById('receiptDate');
const receiptItems = document.getElementById('receiptItems');
const receiptTotal = document.getElementById('receiptTotal');
const receiptPaid = document.getElementById('receiptPaid');
const receiptChange = document.getElementById('receiptChange');

// Format Angka ke Rupiah
function formatRupiah(number) {
    return 'Rp ' + Number(number).toLocaleString('id-ID');
}

// Format Tanggal
function getCurrentDate() {
    const now = new Date();
    return `Tgl: ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
}

// Inisialisasi Tanggal Struk
receiptDate.innerText = getCurrentDate();

// Event Listener: Update Nama Toko di Struk
storeNameInput.addEventListener('input', () => {
    receiptStoreTitle.innerText = storeNameInput.value.trim() || 'NAMA TOKO';
});

// Event Listener: Tambah Barang ke Cart
addItemBtn.addEventListener('click', () => {
    const name = itemNameInput.value.trim();
    const qty = parseInt(itemQtyInput.value);
    const price = parseFloat(itemPriceInput.value);

    if (!name || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert('Mohon isi nama barang, jumlah, dan harga satuan dengan benar!');
        return;
    }

    const subtotal = qty * price;
    cart.push({ name, qty, price, subtotal });

    // Reset Form Input Barang
    itemNameInput.value = '';
    itemQtyInput.value = '1';
    itemPriceInput.value = '';
    itemNameInput.focus();

    updateUI();
});

// Hapus Barang dari Cart
function removeItem(index) {
    cart.splice(index, 1);
    updateUI();
}

// Hitung Total Belanja
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

// Event Listener: Update Uang Bayar & Kembalian
paymentAmountInput.addEventListener('input', updateReceiptTotals);

// Update Tampilan Tabel & Struk
function updateUI() {
    // 1. Render Tabel Form Kasir
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${formatRupiah(item.subtotal)}</td>
            <td><button class="btn btn-remove" onclick="removeItem(${index})">X</button></td>
        `;
        cartList.appendChild(tr);
    });

    // 2. Render Daftar Item di Struk Paper
    receiptItems.innerHTML = '';
    cart.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'receipt-item-row';
        itemDiv.innerHTML = `
            <div>${item.name}</div>
            <div class="receipt-item-detail">
                <span>${item.qty} x ${formatRupiah(item.price)}</span>
                <span>${formatRupiah(item.subtotal)}</span>
            </div>
        `;
        receiptItems.appendChild(itemDiv);
    });

    updateReceiptTotals();
}

// Update Perhitungan Total, Bayar, dan Kembalian di Struk
function updateReceiptTotals() {
    const total = calculateTotal();
    const paid = parseFloat(paymentAmountInput.value) || 0;
    const change = paid - total;

    receiptTotal.innerText = formatRupiah(total);
    receiptPaid.innerText = formatRupiah(paid);
    receiptChange.innerText = formatRupiah(change > 0 ? change : 0);
}

// Tombol Reset
resetBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan semua data?')) {
        cart = [];
        storeNameInput.value = '';
        paymentAmountInput.value = '';
        receiptStoreTitle.innerText = 'NAMA TOKO';
        updateUI();
    }
});

// Tombol Cetak / Print Struk
printBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tambahkan minimal satu barang sebelum mencetak struk!');
        return;
    }
    receiptDate.innerText = getCurrentDate();
    window.print();
});
