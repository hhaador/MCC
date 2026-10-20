const articles = [
  { title: 'AI-Driven Predictive Maintenance for UK Industrial Electrical Systems', category: 'Predictive maintenance', date: '2026-10-26', excerpt: 'A practical guide to reducing downtime and improving reliability with smarter maintenance strategies.', link: 'industrial-ai-predictive-maintenance-uk.html' },
  { title: 'How to Choose the Right Motor Control Solution for Your Facility', category: 'Motor control', date: '2026-01-12', excerpt: 'A practical guide to VFDs, starters, contactors and overload protection for better operational performance.', link: 'blogs.html' },
  { title: 'Power Distribution Fundamentals for Commercial Buildings', category: 'Power distribution', date: '2026-01-28', excerpt: 'The key components and planning considerations behind safe, resilient and efficient building electrical systems.', link: 'power-distribution-fundamentals-commercial-buildings.html' },
  { title: 'PLC, HMI and SCADA: Understanding the Automation Stack', category: 'Industrial automation', date: '2026-02-09', excerpt: 'Learn how core automation technologies work together to improve visibility, control and operational reliability.', link: 'blogs.html' },
  { title: 'What to Include in an Industrial Component Enquiry', category: 'Procurement', date: '2026-02-19', excerpt: 'A concise checklist for helping suppliers return accurate quotations faster and with less rework.', link: 'blogs.html' },
  { title: 'Reducing Procurement Risk in Electrical Projects', category: 'Project support', date: '2026-03-17', excerpt: 'How structured sourcing, documentation and supplier coordination can protect project delivery.', link: 'blogs.html' },
  { title: 'Industrial Automation Trends for Growing Manufacturers', category: 'Industry insight', date: '2026-04-02', excerpt: 'A forward-looking view of connected control, data visibility and practical digital transformation.', link: 'blogs.html' },
  { title: 'Switchgear and Protection: A Buyer’s Quick Guide', category: 'Electrical components', date: '2026-04-16', excerpt: 'Understand the role of protection equipment and the questions to ask before ordering.', link: 'blogs.html' },
  { title: 'Building Better Long-Term Supplier Partnerships', category: 'B2B strategy', date: '2026-05-18', excerpt: 'The practical habits that create stronger communication, better planning and more dependable project delivery.', link: 'blogs.html' }
];

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

    const waMessage = encodeURIComponent(
      `Hello MCC, I am ${name} from ${company}. My email is ${email}. ${payload.phone ? `My phone is ${payload.phone}.` : ''} I need support for: ${payload.interest}. ${payload.message ? `Project details: ${payload.message}` : ''}`
    );

    if (window.confirm('Would you like to send this enquiry on WhatsApp to the MCC team?')) {
      window.open(`https://wa.me/44791665627?text=${waMessage}`, '_blank');
    }

    status.textContent = `Thank you, ${name}. Your requirement has been recorded and the MCC team will be in touch soon.`;
    status.className = 'form-status show success';
    form.reset();
  });
}

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
