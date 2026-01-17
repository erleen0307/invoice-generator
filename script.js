const itemsContainer = document.querySelector('.items-container');
const addItemBtn = document.querySelector('.add-item');
const invoiceBody = document.querySelector('.invoice-table tbody');
const grandTotalText = document.querySelector('.grand-total span');
const invoiceTotalText = document.querySelector('.total-amount');

// Add row logic
addItemBtn.addEventListener('click', () => {
    const newItemRow = document.createElement('div');
    newItemRow.classList.add('item-row');

    const newItemName = document.createElement('input');
    newItemName.type = 'text';
    newItemName.placeholder = 'Item name';
    newItemName.classList.add('item-name');

    const newItemQty = document.createElement('input');
    newItemQty.type = 'number';
    newItemQty.placeholder = 'Qty';
    newItemQty.min = '0';
    newItemQty.classList.add('item-quantity');

    const newItemPrice = document.createElement('input');
    newItemPrice.type = 'number';
    newItemPrice.placeholder = 'Price';
    newItemPrice.min = '0';
    newItemPrice.classList.add('item-price');

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-item');
    removeBtn.textContent = '✕';

    newItemRow.appendChild(newItemName);
    newItemRow.appendChild(newItemQty);
    newItemRow.appendChild(newItemPrice);
    newItemRow.appendChild(removeBtn);

    itemsContainer.appendChild(newItemRow);
});

// Remove row logic
itemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item')) {
        const row = event.target.closest('.item-row');
        row.remove();
        calculateTotals();
        updateInvoicePreview();
    }
});

// Input changes logic
itemsContainer.addEventListener('input', (event) => {
    if (
        event.target.classList.contains('item-quantity') ||
        event.target.classList.contains('item-price') ||
        event.target.classList.contains('item-name')
    ) {
        calculateTotals();
        updateInvoicePreview();
    }
});

// Calculate total price
function calculateTotals() {
    let total = 0;

    for (let item of itemsContainer.querySelectorAll('.item-row')) {
        const qty = Number(item.querySelector('.item-quantity').value) || 0;
        const price = Number(item.querySelector('.item-price').value) || 0;
        total += qty * price;
    }

    grandTotalText.textContent = `Grand Total: Rs. ${total}`;
    invoiceTotalText.textContent = `Rs. ${total}`;
}

// Update invoice preview
function updateInvoicePreview() {
    invoiceBody.innerHTML = '';

    for (let item of itemsContainer.querySelectorAll('.item-row')) {
        const name = item.querySelector('.item-name').value;
        const qty = Number(item.querySelector('.item-quantity').value) || 0;
        const price = Number(item.querySelector('.item-price').value) || 0;

        if (name && qty > 0) {
            const row = document.createElement('tr');

            const nameTd = document.createElement('td');
            nameTd.textContent = name;

            const qtyTd = document.createElement('td');
            qtyTd.textContent = qty;

            const amtTd = document.createElement('td');
            amtTd.textContent = `Rs. ${qty * price}`;

            row.appendChild(nameTd);
            row.appendChild(qtyTd);
            row.appendChild(amtTd);

            invoiceBody.appendChild(row);
        }
    }
}

// CUSTOM FEATURE - DOWNLOAD PDF OF INVOICE
const downloadBtn = document.querySelector('.download-pdf');

downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text('Invoice', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.text('------------------------------', 20, y);
    y += 10;

    for (let item of itemsContainer.querySelectorAll('.item-row')) {
        const name = item.querySelector('.item-name').value;
        const qty = Number(item.querySelector('.item-quantity').value) || 0;
        const price = Number(item.querySelector('.item-price').value) || 0;

        if (name && qty > 0) {
            doc.text(`${name}  |  Qty: ${qty}  |  Rs. ${qty * price}`, 20, y);
            y += 8;
        }
    }

    y += 5;
    doc.text('------------------------------', 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Grand Total: ${invoiceTotalText.textContent}`, 20, y);

    doc.save('invoice.pdf');
});
