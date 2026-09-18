const pillarData = {
  ac: {
    title: 'AC Heavy-Duty Cooling Arrays',
    desc: 'Designed for high-voltage panel boards, transformer units, and uninterrupted industrial machinery cooling. High airflow output with sustained thermal resilience under continuous load.',
    specs: [
      '220V - 380V Direct Input Range',
      'Cast Aluminum Impeller Frames',
      'Maintenance-free dual ball bearings'
    ],
    tag: 'MODE: AC_STANDARD',
    status: '> Telemetry: Nominal 2800 RPM Output'
  },
  dc: {
    title: 'DC & EC Precision Micro-Ventilation',
    desc: 'Variable speed controls via PWM signals. Ultra-low wattage consumption tailored for precision telecom cabinets, automation logic racks, and battery storage modules.',
    specs: [
      '12V / 24V / 48V Precision Inputs',
      'Integrated PWM Feedback Control',
      'Ultra-Quiet Acoustic Dampening'
    ],
    tag: 'MODE: DC_EC_PRECISION',
    status: '> Telemetry: 92% Motor Energy Efficiency'
  },
  blower: {
    title: 'Industrial Centrifugal Blowers',
    desc: 'High static pressure blowers constructed to drive dense airflow through restricted ductwork, heavy filter assemblies, and severe industrial environments.',
    specs: [
      'High Static Pressure Chamber',
      'IP68 Environmental Sealing',
      'Reinforced Multi-Blade Turbines'
    ],
    tag: 'MODE: BLOWER_HIGH_PRESS',
    status: '> Telemetry: Static Pressure Peak 850 Pa'
  }
};

function switchPillar(type) {
  document.querySelectorAll('.pillar-btn').forEach(btn => {
    btn.classList.remove('bg-royal-blue', 'text-white', 'border-royal-blue');
    btn.classList.add('bg-cyber-card', 'text-gray-300', 'border-gray-800');
  });

  const activeBtn = document.getElementById(`tab-${type}`);
  activeBtn.classList.add('bg-royal-blue', 'text-white', 'border-royal-blue');

  const data = pillarData[type];
  document.getElementById('pillarTitle').innerText = data.title;
  document.getElementById('pillarDesc').innerText = data.desc;
  document.getElementById('pillarTag').innerText = data.tag;
  document.getElementById('pillarStatus').innerText = data.status;

  const specsList = document.getElementById('pillarSpecs');
  specsList.innerHTML = data.specs.map(s => `<li><i class="fa-solid fa-check text-royal-blue mr-2"></i>${s}</li>`).join('');
}

function adjustFanSpeed(mode) {
  const consoleBox = document.getElementById('telemetryConsole');
  const time = new Date().toLocaleTimeString();
  let log = '';

  if (mode === 'low') {
    log = `<p class="text-green-400">[${time}] ECO MODE ACTIVATED: Voltage scaled to 60%. RPM throttled to 1400. Noise &lt; 28 dBA.</p>`;
  } else {
    log = `<p class="text-royal-blue">[${time}] HIGH PERFORMANCE ENGAGED: Max Voltage applied. RPM boosted to 3600. Airflow at 100% capacity.</p>`;
  }

  consoleBox.innerHTML += log;
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function selectProduct(modelName, price) {
  const fanSelect = document.getElementById('fanSelect');
  for (let i = 0; i < fanSelect.options.length; i++) {
    if (fanSelect.options[i].getAttribute('data-name') === modelName) {
      fanSelect.selectedIndex = i;
      break;
    }
  }
  runCalculation();
  document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

function runCalculation() {
  const fanSelect = document.getElementById('fanSelect');
  const fanPrice = parseFloat(fanSelect.value) || 0;
  const quantity = parseInt(document.getElementById('quantityInput').value) || 1;

  const accessorySelect = document.getElementById('accessorySelect');
  const accessoryPrice = parseFloat(accessorySelect.value) || 0;

  const total = (fanPrice + accessoryPrice) * quantity;
  document.getElementById('totalPriceDisplay').innerText = `$${total.toFixed(2)}`;
}

function handleOrderSubmission(event) {
  event.preventDefault();

  const fanSelect = document.getElementById('fanSelect');
  const modelName = fanSelect.options[fanSelect.selectedIndex].getAttribute('data-name');
  const quantity = document.getElementById('quantityInput').value;

  const accessorySelect = document.getElementById('accessorySelect');
  const accessoryName = accessorySelect.options[accessorySelect.selectedIndex].getAttribute('data-acc');

  const totalPrice = document.getElementById('totalPriceDisplay').innerText;

  const message = `Hello DELTA ELECTRIC POWER!\nI would like to place an order/quote request:\n\n*Model:* ${modelName}\n*Quantity:* ${quantity} unit(s)\n*Accessory:* ${accessoryName}\n*Total Estimated Quote:* ${totalPrice}\n\nPlease confirm availability and dispatch details.`;

  const whatsappUrl = `https://wa.me/8801774777962?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function openZoomModal(imgSrc, title) {
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('modalTitle').innerText = title;
  const modal = document.getElementById('imageModal');
  modal.classList.remove('hidden');
}

function closeZoomModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.add('hidden');
  const img = document.getElementById('modalImg');
  img.classList.remove('scale-180');
  img.classList.add('scale-100');
}

function toggleImageZoom(container) {
  const img = container.querySelector('img');
  if (img.classList.contains('scale-100')) {
    img.classList.remove('scale-100');
    img.classList.add('scale-150');
  } else {
    img.classList.remove('scale-150');
    img.classList.add('scale-100');
  }
}

function toggleNosFeature(checkbox) {
  const consoleBox = document.getElementById('telemetryConsole');
  const time = new Date().toLocaleTimeString();
  if (checkbox.checked) {
    consoleBox.innerHTML += `<p class="text-yellow-400">[${time}] NOS BOOST MODE: Standby protocol loaded. [Upcoming Feature Module Active]</p>`;
  } else {
    consoleBox.innerHTML += `<p class="text-gray-400">[${time}] NOS BOOST MODE: Deactivated.</p>`;
  }
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

window.addEventListener('load', runCalculation);
