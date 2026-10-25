const articles = [
  { title: 'AI-Driven Predictive Maintenance for UK Industrial Electrical Systems', category: 'Predictive maintenance', date: '2026-10-26', excerpt: 'A practical guide to reducing downtime and improving asset reliability with smarter monitoring and decision-making.', link: 'industrial-ai-predictive-maintenance-uk.html' },
  { title: 'How to Choose the Right Motor Control Solution for Your Facility', category: 'Motor control', date: '2026-01-12', excerpt: 'A practical guide to VFDs, starters, contactors and overload protection for safer and more efficient operations.', link: 'motor-control-solution-facility.html' },
  { title: 'Power Distribution Fundamentals for Commercial Buildings', category: 'Power distribution', date: '2026-01-28', excerpt: 'The key components and planning considerations behind safe, resilient and efficient building power systems.', link: 'power-distribution-fundamentals-commercial-buildings.html' },
  { title: 'PLC, HMI and SCADA: Understanding the Automation Stack', category: 'Industrial automation', date: '2026-02-09', excerpt: 'Learn how core automation technologies work together to improve visibility, control and plant performance.', link: 'plc-hmi-scada-automation-stack.html' },
  { title: 'What to Include in an Industrial Component Enquiry', category: 'Procurement', date: '2026-02-19', excerpt: 'A concise checklist for helping suppliers return accurate quotations faster and with better commercial clarity.', link: 'industrial-component-enquiry-checklist.html' },
  { title: 'Reducing Procurement Risk in Electrical Projects', category: 'Project support', date: '2026-03-17', excerpt: 'How structured sourcing, documentation and supplier coordination can protect delivery schedules and budgets.', link: 'reducing-procurement-risk-electrical-projects.html' },
  { title: 'Industrial Automation Trends for Growing Manufacturers', category: 'Industry insight', date: '2026-04-02', excerpt: 'A forward-looking view of connected control, data visibility and practical efficiency gains in modern manufacturing.', link: 'industrial-automation-trends-growing-manufacturers.html' },
  { title: 'Switchgear and Protection: A Buyer’s Quick Guide', category: 'Electrical components', date: '2026-04-16', excerpt: 'Understand the role of protection systems and the key questions to ask when selecting switchgear.', link: 'switchgear-protection-buyers-guide.html' },
  { title: 'Building Better Long-Term Supplier Partnerships', category: 'B2B strategy', date: '2026-05-18', excerpt: 'The practical habits that create stronger communication, better planning and more resilient supplier relationships.', link: 'building-better-long-term-supplier-partnerships.html' },
];

const whatsappNumber = '8801791665627';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello MCC, I want to discuss an industrial or electrical requirement.')}`;

const menu = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menu && navLinks) {
  menu.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const form = document.querySelector('[data-form="lead"]');
if (form) {
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const company = (data.get('company') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();

    if (!name || !company || !email) {
      status.textContent = 'Please fill in your name, company and email before submitting.';
      status.className = 'form-status show error';
      return;
    }

    const payload = {
      name,
      company,
      email,
      phone: (data.get('phone') || '').toString().trim(),
      interest: (data.get('interest') || '').toString().trim(),
      message: (data.get('message') || '').toString().trim(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('mccLeadSubmission', JSON.stringify(payload));

    const emailSubject = encodeURIComponent(`New MCC enquiry from ${name} (${company})`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${payload.phone || 'Not provided'}\nService required: ${payload.interest}\nProject details:\n${payload.message || 'No details provided'}\n\nSubmitted on: ${payload.createdAt}`
    );

    const mailtoLink = `mailto:info@mcontrolsco.com?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;

    status.textContent = `Thank you, ${name}. Your enquiry has been prepared for info@mcontrolsco.com. Please complete the email prompt to send it.`;
    status.className = 'form-status show success';
    form.reset();
  });
}

const whatsappButtons = document.querySelectorAll('[data-whatsapp="true"]');
whatsappButtons.forEach((button) => {
  button.setAttribute('href', whatsappLink);
  button.setAttribute('target', '_blank');
  button.setAttribute('rel', 'noopener noreferrer');
});

const grid = document.querySelector('#articleGrid');
const searchInput = document.querySelector('#articleSearch');
const emptyState = document.querySelector('#emptyState');

function renderArticles() {
  if (!grid) return;

  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const filtered = articles.filter((article) => {
    if (!query) return true;
    return Object.values(article).join(' ').toLowerCase().includes(query);
  });

  if (!filtered.length) {
    grid.innerHTML = '';
    if (emptyState) {
      emptyState.classList.remove('hidden');
      emptyState.style.display = 'block';
    }
    return;
  }

  if (emptyState) {
    emptyState.classList.add('hidden');
    emptyState.style.display = 'none';
  }

  grid.innerHTML = filtered.map((article) => `
    <article class="article-card reveal">
      <div class="tag">${article.category}</div>
      <h3>${article.title}</h3>
      <div class="meta">${article.date}</div>
      <p>${article.excerpt}</p>
      <a class="text-link" href="${article.link}">Read article →</a>
    </article>
  `).join('');

  const newCards = grid.querySelectorAll('.reveal');
  newCards.forEach((card) => observer.observe(card));
}

if (grid) {
  renderArticles();
}

if (searchInput) {
  searchInput.addEventListener('input', renderArticles);
}
