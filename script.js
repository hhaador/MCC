const AUTHORIZED_EMAILS = ['hhaador24@gmail.com', 'maksudr.mr@gmail.com'];

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return new Intl.NumberFormat('en-US').format(numeric);
};

const numberToWords = (value) => {
  const whole = Math.floor(Number(value) || 0);
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const groupToWords = (num) => {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    const rem = num % 10;
    return `${tens[Math.floor(num / 10)]}${rem ? ` ${ones[rem]}` : ''}`;
  };

  const convert = (num) => {
    if (num === 0) return 'Zero';
    const lakh = Math.floor(num / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;
    let parts = [];

    if (lakh) parts.push(`${groupToWords(lakh)} Lakh`);
    if (thousand) parts.push(`${groupToWords(thousand)} Thousand`);
    if (remainder) parts.push(groupToWords(remainder));
    return parts.join(' ');
  };

  let result = convert(whole);
  if (!result) result = 'Zero';
  return `${result} Taka`;
};

const invoiceAccessGate = document.getElementById('invoiceAccessGate');
const invoiceBuilder = document.getElementById('invoiceBuilder');
const invoiceAccessInput = document.getElementById('invoiceAccessEmail');
const invoiceAccessBtn = document.getElementById('invoiceAccessBtn');
const invoiceAccessError = document.getElementById('invoiceAccessError');

const setAccessMessage = (message, type = 'error') => {
  if (!invoiceAccessError) return;
  invoiceAccessError.textContent = message;
  invoiceAccessError.className = `form-status show ${type}`;
};

const allowInvoiceAccess = (email) => {
  const normalized = (email || '').trim().toLowerCase();
  return AUTHORIZED_EMAILS.includes(normalized);
};

const revealInvoiceBuilder = () => {
  if (invoiceAccessGate) invoiceAccessGate.classList.add('hidden');
  if (invoiceBuilder) invoiceBuilder.classList.remove('hidden');
};

if (invoiceAccessBtn) {
  invoiceAccessBtn.addEventListener('click', () => {
    const email = invoiceAccessInput.value.trim();
    if (!allowInvoiceAccess(email)) {
      setAccessMessage('Access denied. Only approved MCC emails can open this invoice portal.', 'error');
      return;
    }

    sessionStorage.setItem('mccInvoiceAccessEmail', email.toLowerCase());
    setAccessMessage('Access granted.', 'success');
    revealInvoiceBuilder();
  });
}

const savedEmail = sessionStorage.getItem('mccInvoiceAccessEmail');
if (savedEmail && allowInvoiceAccess(savedEmail)) {
  if (invoiceAccessInput) invoiceAccessInput.value = savedEmail;
  revealInvoiceBuilder();
}

const createProductRow = (data = {}) => {
  const row = document.createElement('tr');
  row.className = 'invoice-item-row';

  const productName = data.productName || '';
  const productBrand = data.productBrand || '';
  const qty = data.qty || 1;
  const unitPrice = data.unitPrice || 0;

  row.innerHTML = `
    <td>${document.querySelectorAll('.invoice-item-row').length + 1}</td>
    <td><input type="text" value="${productName}" class="table-input product-name"></td>
    <td><input type="text" value="${productBrand}" class="table-input product-brand"></td>
    <td><input type="number" value="${qty}" min="1" class="table-input qty"></td>
    <td><input type="number" value="${unitPrice}" min="0" class="table-input unit-price"></td>
    <td><input type="number" value="${Number(qty) * Number(unitPrice)}" min="0" class="table-input total-price" readonly></td>
  `;

  return row;
};

const itemsBody = document.getElementById('invoiceItemsBody');
const addProductRowBtn = document.getElementById('addProductRow');

if (addProductRowBtn && itemsBody) {
  addProductRowBtn.addEventListener('click', () => {
    itemsBody.appendChild(createProductRow());
    updateInvoiceSummary();
    reindexRows();
  });
}

const reindexRows = () => {
  const rows = document.querySelectorAll('.invoice-item-row');
  rows.forEach((row, index) => {
    const firstCell = row.querySelector('td');
    if (firstCell) firstCell.textContent = index + 1;
  });
};

const updateInvoiceSummary = () => {
  const rows = document.querySelectorAll('.invoice-item-row');
  let subtotal = 0;

  rows.forEach((row) => {
    const quantity = Number((row.querySelector('.qty') || {}).value || 0);
    const unitPrice = Number((row.querySelector('.unit-price') || {}).value || 0);
    const total = quantity * unitPrice;
    const totalInput = row.querySelector('.total-price');
    if (totalInput) totalInput.value = total;
    subtotal += total;
  });

  const subtotalValue = document.getElementById('subtotalValue');
  const totalBillValue = document.getElementById('totalBillValue');
  const grandTotal = document.getElementById('grandTotal');
  const outstandingBalance = document.getElementById('outstandingBalance');
  const amountInWords = document.getElementById('amountInWords');

  const formatted = formatCurrency(subtotal);

  if (subtotalValue) subtotalValue.textContent = formatted;
  if (totalBillValue) totalBillValue.textContent = formatted;
  if (grandTotal) grandTotal.textContent = formatted;
  if (outstandingBalance) outstandingBalance.textContent = formatted;
  if (amountInWords) amountInWords.textContent = numberToWords(subtotal);
};

const bindRowCalculations = () => {
  document.querySelectorAll('.invoice-item-row').forEach((row) => {
    row.querySelectorAll('.qty, .unit-price').forEach((field) => {
      field.addEventListener('input', updateInvoiceSummary);
    });
  });
};

bindRowCalculations();
updateInvoiceSummary();

const customerNameField = document.getElementById('customerName');
const customerTitleField = document.getElementById('customerTitle');
const customerAddressField = document.getElementById('customerAddress');
const customerEmailField = document.getElementById('customerEmail');
const deliveryNameField = document.getElementById('deliveryName');
const deliveryAddressField = document.getElementById('deliveryAddress');
const projectNameField = document.getElementById('projectName');
const poNumberField = document.getElementById('poNumber');

const getInvoicePayload = () => {
  const rows = [...document.querySelectorAll('.invoice-item-row')].map((row, index) => {
    const name = (row.querySelector('.product-name') || { value: '' }).value || '';
    const brand = (row.querySelector('.product-brand') || { value: '' }).value || '';
    const qty = Number((row.querySelector('.qty') || { value: 0 }).value || 0);
    const unitPrice = Number((row.querySelector('.unit-price') || { value: 0 }).value || 0);
    const total = qty * unitPrice;

    return { index: index + 1, name, brand, qty, unitPrice, total };
  });

  return {
    invoiceNumber: document.getElementById('invoiceNumber')?.value || 'INV-2026-001',
    invoiceDate: document.getElementById('invoiceDate')?.value || '',
    dueDate: document.getElementById('dueDate')?.value || '',
    customerName: customerNameField?.value || '',
    customerTitle: customerTitleField?.value || '',
    customerAddress: customerAddressField?.value || '',
    customerEmail: customerEmailField?.value || '',
    deliveryName: deliveryNameField?.value || '',
    deliveryAddress: deliveryAddressField?.value || '',
    projectName: projectNameField?.value || '',
    poNumber: poNumberField?.value || '',
    rows,
    subtotal: Number(document.getElementById('subtotalValue')?.textContent?.replace(/,/g, '') || 0),
    totalValue: document.getElementById('totalBillValue')?.textContent || '0',
    recipients: document.getElementById('sendToEmails')?.value || '',
    amountInWords: document.getElementById('amountInWords')?.textContent || ''
  };
};

const buildInvoiceEmail = () => {
  const payload = getInvoicePayload();
  const recipientList = payload.recipients
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
    .join(',');

  const productLines = payload.rows.map((row) => {
    if (!row.name && !row.brand) return '';
    return `- ${row.name || 'Product'} (${row.brand || 'N/A'}) | Qty: ${row.qty} | Unit: ${row.unitPrice} BDT | Total: ${row.total} BDT`;
  }).filter(Boolean).join('\n');

  const emailSubject = encodeURIComponent(`Invoice ${payload.invoiceNumber} - ${payload.customerName || 'Customer'}`);
  const emailBody = encodeURIComponent(
    `Hello,\n\nPlease review the attached invoice / quotation details below.\n\nInvoice Number: ${payload.invoiceNumber}\nInvoice Date: ${payload.invoiceDate}\nDue Date: ${payload.dueDate}\nCustomer: ${payload.customerName}\nTitle: ${payload.customerTitle}\nAddress: ${payload.customerAddress}\nEmail: ${payload.customerEmail}\n\nDelivery To: ${payload.deliveryName}\nDelivery Address: ${payload.deliveryAddress}\n\nReference:\nPO No.: ${payload.poNumber}\nProject: ${payload.projectName}\n\nProducts:\n${productLines || 'No products listed'}\n\nSubtotal: ${payload.subtotal} BDT\nTotal Bill: ${payload.totalValue}\nAmount in Words: ${payload.amountInWords}\n\nRegards,\nMotion Controls Corporation\nwww.mcontrolsco.com`
  );

  return {
    recipientList,
    mailto: `mailto:${recipientList}?subject=${emailSubject}&body=${emailBody}`
  };
};

const sendInvoiceBtn = document.getElementById('sendInvoiceBtn');
if (sendInvoiceBtn) {
  sendInvoiceBtn.addEventListener('click', () => {
    const email = sessionStorage.getItem('mccInvoiceAccessEmail');
    if (!email || !allowInvoiceAccess(email)) {
      setAccessMessage('Access denied. Please sign in with an approved MCC address to send invoices.', 'error');
      return;
    }

    const { recipientList, mailto } = buildInvoiceEmail();
    if (!recipientList) {
      window.alert('Please enter at least one email address in “Send to multiple emails”.');
      return;
    }

    window.location.href = mailto;
  });
}

const printInvoiceBtn = document.getElementById('printInvoiceBtn');
if (printInvoiceBtn) {
  printInvoiceBtn.addEventListener('click', () => {
    window.print();
  });
}

const formInputs = document.querySelectorAll('#invoiceBuilder input, #invoiceBuilder textarea');
formInputs.forEach((input) => {
  input.addEventListener('input', updateInvoiceSummary);
});

const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  if (link.getAttribute('href') === 'invoice.html') {
    link.classList.add('active-link');
  }
});

if (document.body.dataset.page === 'invoice' && !savedEmail) {
  const accessField = document.getElementById('invoiceAccessEmail');
  if (accessField) accessField.focus();
}
