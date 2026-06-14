$(function () {
  $('#year').text(new Date().getFullYear());
  handleVisitCookie();
  startDigitalClock();
  startAnalogClock();
  setupEmailToggle();
  loadJoke();
  loadDogImage();

  $('#refresh-joke').on('click', loadJoke);
  $('#refresh-dog').on('click', loadDogImage);
  setInterval(loadJoke, 60000);
});

function setupEmailToggle() {
  $('#toggle-email').on('click', function () {
    $('#email-display').toggleClass('d-none');
    $(this).text($('#email-display').hasClass('d-none') ? 'Show my email' : 'Hide my email');
  });
}

function startDigitalClock() {
  function displayTime() {
    document.getElementById('digital-clock').textContent = 'Current Time: ' + new Date();
  }
  displayTime();
  setInterval(displayTime, 500);
}

function startAnalogClock() {
  const canvas = document.getElementById('analog-clock');
  if (!canvas || typeof drawClock !== 'function') return;

  const ctx = canvas.getContext('2d');
  let radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90;

  drawClock();
  setInterval(drawClock, 1000);

  function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
  }
}

async function loadJoke() {
  $('#joke-output').text('Loading joke...');
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
    const result = await response.json();
    const joke = result.type === 'single' ? result.joke : `${result.setup} ${result.delivery}`;
    $('#joke-output').text(joke || 'No joke returned.');
  } catch (error) {
    $('#joke-output').text('Unable to load a joke right now.');
  }
}

async function loadDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const result = await response.json();
    $('#dog-image').attr('src', result.message);
  } catch (error) {
    $('#dog-image').attr('alt', 'Unable to load image right now.');
  }
}

function handleVisitCookie() {
  const lastVisit = getCookie('lastVisit');
  const now = new Date().toLocaleString();
  if (!lastVisit) {
    $('#visit-message').text('Welcome to my homepage for the first time!');
  } else {
    $('#visit-message').text(`Welcome back! Your last visit was ${decodeURIComponent(lastVisit)}`);
  }
  setCookie('lastVisit', encodeURIComponent(now), 365);
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

function projectFilter() {
  return {
    selected: 'all',
    projects: [
      { title: 'Distributed Workflow Modernization', category: 'backend', description: 'Durable workflow orchestration with Temporal and service decomposition.' },
      { title: 'Cloud-Native Infrastructure', category: 'cloud', description: 'AWS services, Docker, CI/CD, and observability for scalable platforms.' },
      { title: 'Professional Profile Website', category: 'frontend', description: 'Responsive Bootstrap site with JavaScript, cookies, and public API integrations.' }
    ],
    get filteredProjects() {
      if (this.selected === 'all') return this.projects;
      return this.projects.filter(project => project.category === this.selected);
    }
  };
}
