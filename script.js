/**
 * Interactive Scripts for Supasit Meedecha's Portfolio
 * Features:
 *  - Interactive Canvas Particle Network
 *  - Smooth Custom Magnetic Cursor
 *  - 3D Card Tilt & Radial Spotlight
 *  - Interactive Playwright QA Test Runner (Simulation + Audio Chimes)
 *  - Developer CLI Terminal Widget
 *  - Project Filter Tabs
 *  - Copy to Clipboard Utility
 */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasNetwork();
  initCustomCursor();
  initCardInteractions();
  initMobileMenu();
  initProjectFilter();
  initTerminal();
  initQASimulator();
});

/* ==========================================================
   1. INTERACTIVE CANVAS PARTICLE NETWORK
   ========================================================== */
function initCanvasNetwork() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const maxDistance = 140;

  const mouse = {
    x: -1000,
    y: -1000,
    radius: 160
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.5;
        this.y -= Math.sin(angle) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect particles to mouse
    if (mouse.x > 0 && mouse.y > 0) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   2. CUSTOM MAGNETIC CURSOR
   ========================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    // Lerp smooth follow
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, .interactive-card, .clickable');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================
   3. 3D CARD TILT & SPOTLIGHT EFFECT
   ========================================================== */
function initCardInteractions() {
  const cards = document.querySelectorAll('.interactive-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });
}

/* ==========================================================
   4. MOBILE MENU
   ========================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================
   5. PROJECT FILTER
   ========================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active style
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-slate-800/80', 'text-slate-400');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('bg-slate-800/80', 'text-slate-400');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.classList.remove('opacity-0', 'scale-95');
          card.classList.add('opacity-100', 'scale-100');
        } else {
          card.classList.remove('opacity-100', 'scale-100');
          card.classList.add('opacity-0', 'scale-95');
          setTimeout(() => {
            if (btn.getAttribute('data-filter') !== 'all' && !card.getAttribute('data-category').includes(btn.getAttribute('data-filter'))) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================
   6. WEB AUDIO SOUND EFFECTS (SYNTHESIZED)
   ========================================================== */
let audioCtx = null;
let soundMuted = false;

function playAudioTone(type) {
  if (soundMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pass') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'success') {
      // 4-note victory chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const chordOsc = audioCtx.createOscillator();
        const chordGain = audioCtx.createGain();
        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
        chordGain.gain.setValueAtTime(0.06, now + idx * 0.09);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
        chordOsc.connect(chordGain);
        chordGain.connect(audioCtx.destination);
        chordOsc.start(now + idx * 0.09);
        chordOsc.stop(now + idx * 0.09 + 0.45);
      });
    }
  } catch (e) {
    // Audio context not allowed or unsupported
  }
}

/* ==========================================================
   7. INTERACTIVE PLAYWRIGHT QA TEST RUNNER SIMULATOR
   ========================================================== */
function initQASimulator() {
  const modal = document.getElementById('qa-modal');
  const openBtns = document.querySelectorAll('.open-qa-sim-btn');
  const closeBtn = document.getElementById('close-qa-modal');
  const runBtn = document.getElementById('run-tests-btn');
  const terminalBody = document.getElementById('qa-terminal-logs');
  const progressFill = document.getElementById('qa-progress-fill');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  if (!modal || !terminalBody) return;

  // Sound toggle button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundMuted = !soundMuted;
      soundToggleBtn.innerHTML = soundMuted 
        ? '<i class="fa-solid fa-volume-xmark"></i>' 
        : '<i class="fa-solid fa-volume-high"></i>';
      showToast(soundMuted ? 'Sound muted' : 'Sound effects enabled');
    });
  }

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      runPlaywrightSimulation();
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Re-run
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runPlaywrightSimulation();
    });
  }

  const testCases = [
    { name: '[chromium] › auth.setup.ts:14 › Admin & Tourist authentication flow', duration: '340ms' },
    { name: '[chromium] › cultura.spec.ts:28 › Community tourism attractions CRUD validation', duration: '580ms' },
    { name: '[chromium] › booking.spec.ts:42 › Booking reservation flow & payment webhook mock', duration: '710ms' },
    { name: '[chromium] › rest-api.spec.ts:19 › Prisma ORM & MySQL relational integrity test', duration: '310ms' },
    { name: '[firefox]  › responsive.spec.ts:11 › Desktop & Tablet viewports consistency check', duration: '490ms' },
    { name: '[webkit]   › mobile-safari.spec.ts:16 › Mobile navigation & touch gesture interaction', duration: '420ms' },
  ];

  let testInterval = null;

  function runPlaywrightSimulation() {
    if (testInterval) clearInterval(testInterval);
    terminalBody.innerHTML = '';
    progressFill.style.width = '0%';
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Running Tests...</span>';

    // Initial command banner
    appendLog('<span class="text-indigo-400 font-bold">$ npx playwright test --project=all</span>');
    appendLog('<span class="text-slate-400">Running 6 tests using 3 workers on Cultura Community Platform...</span><br/>');

    playAudioTone('click');

    let current = 0;
    testInterval = setInterval(() => {
      if (current < testCases.length) {
        const tc = testCases[current];
        appendLog(`
          <div class="flex items-center justify-between py-0.5 animate-pulse">
            <span class="text-emerald-400 flex items-center gap-2">
              <i class="fa-solid fa-check text-xs"></i>
              <span class="text-slate-200">${tc.name}</span>
            </span>
            <span class="text-xs text-slate-500 font-mono">(${tc.duration})</span>
          </div>
        `);
        playAudioTone('pass');
        current++;
        progressFill.style.width = `${(current / testCases.length) * 100}%`;
      } else {
        clearInterval(testInterval);
        appendLog(`
          <div class="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <span class="font-bold flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-base"></i>
              <span>6 passed (2.85s) — 100% Tests Passed!</span>
            </span>
            <span class="text-xs font-mono bg-emerald-500/20 px-2.5 py-1 rounded-md text-emerald-200">READY FOR PRODUCTION</span>
          </div>
        `);
        playAudioTone('success');
        runBtn.disabled = false;
        runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i><span>Re-run Test Suite</span>';
      }
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 450);
  }

  function appendLog(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    terminalBody.appendChild(div);
  }
}

/* ==========================================================
   8. INTERACTIVE DEVELOPER CLI TERMINAL
   ========================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const quickCmds = document.querySelectorAll('.quick-cmd');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: () => `
      <div class="text-slate-300 space-y-1 font-mono text-xs">
        <div><strong class="text-indigo-400">help</strong>      - display all available commands</div>
        <div><strong class="text-emerald-400">test</strong>      - run Playwright QA automated test suite simulation</div>
        <div><strong class="text-sky-400">skills</strong>    - list specialized technologies and frameworks</div>
        <div><strong class="text-amber-400">projects</strong>  - list featured projects (NECTEC, ClickNext, Unity, Java)</div>
        <div><strong class="text-rose-400">contact</strong>   - get direct contact information (Email, Phone, LinkedIn)</div>
        <div><strong class="text-purple-400">cv</strong>        - open Supasit_CV.pdf resume in a new tab</div>
        <div><strong class="text-slate-400">clear</strong>     - clear terminal console screen</div>
      </div>
    `,
    test: () => {
      const modal = document.getElementById('qa-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        const runBtn = document.getElementById('run-tests-btn');
        if (runBtn) runBtn.click();
      }
      return '<span class="text-emerald-400"><i class="fa-solid fa-play mr-1.5 text-xs"></i>Launching Playwright QA Test Runner...</span>';
    },
    skills: () => `
      <div class="text-slate-200 font-mono text-xs space-y-1">
        <div><i class="fa-solid fa-flask-vial text-indigo-400 mr-1.5"></i><strong class="text-indigo-300">QA / Testing:</strong> Playwright (E2E & System), Test Cases, Bug Tracking, Insomnia</div>
        <div><i class="fa-solid fa-code text-sky-400 mr-1.5"></i><strong class="text-sky-300">Languages:</strong> Java (OOP), JavaScript, TypeScript, SQL (MySQL), HTML5, CSS3, PHP, C#</div>
        <div><i class="fa-solid fa-cubes text-emerald-400 mr-1.5"></i><strong class="text-emerald-300">Stack:</strong> React, Tailwind CSS, Express.js, Prisma ORM, Laravel, Git, Figma, Unity</div>
      </div>
    `,
    projects: () => `
      <div class="text-slate-200 font-mono text-xs space-y-1.5">
        <div>1. <strong class="text-indigo-300">Cultura (NECTEC):</strong> Community Tourism Management (React, Express, Prisma, Playwright)</div>
        <div>2. <strong class="text-sky-300">Work Request (ClickNext):</strong> Internal Task Assignment System (PHP Laravel, MySQL)</div>
        <div>3. <strong class="text-emerald-300">Scary Escape:</strong> 3D Survival Horror Game (Unity, C#)</div>
        <div>4. <strong class="text-amber-300">Quiz Blast:</strong> Desktop Interactive Quiz (Java OOP)</div>
      </div>
    `,
    contact: () => `
      <div class="text-slate-200 font-mono text-xs space-y-1">
        <div><i class="fa-solid fa-envelope text-indigo-400 mr-1.5"></i><strong>Email:</strong> <a href="mailto:supasit.mee@gmail.com" class="text-indigo-300 underline">supasit.mee@gmail.com</a></div>
        <div><i class="fa-solid fa-phone text-emerald-400 mr-1.5"></i><strong>Phone:</strong> <a href="tel:+66837392007" class="text-emerald-300 underline">(+66) 83-739-2007</a></div>
        <div><i class="fa-brands fa-linkedin text-sky-400 mr-1.5"></i><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/supasit-meedecha" target="_blank" class="text-sky-300 underline">supasit-meedecha</a></div>
        <div><i class="fa-brands fa-github text-purple-400 mr-1.5"></i><strong>GitHub:</strong> <a href="https://github.com/EzekielMorales" target="_blank" class="text-purple-300 underline">EzekielMorales</a></div>
      </div>
    `,
    cv: () => {
      window.open('assets/Supasit_CV.pdf', '_blank');
      return '<span class="text-indigo-400"><i class="fa-solid fa-file-pdf mr-1.5"></i>Opened Supasit_CV.pdf in a new tab.</span>';
    },
    about: () => `
      <div class="text-slate-300 text-xs leading-relaxed font-mono">
        Hi! I'm Supasit Meedecha, a 3rd-year Software Engineering student at Burapha University (GPA 3.61).<br/>
        Passionate about Software QA, Business Analysis, and Full-Stack Engineering. Actively seeking an internship opportunity!
      </div>
    `,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },
    sudo: () => '<span class="text-rose-400"><i class="fa-solid fa-shield-halved mr-1.5"></i>Permission denied: You already have full guest access to explore this portfolio!</span>'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    playAudioTone('click');

    // Echo input
    const inputEcho = document.createElement('div');
    inputEcho.innerHTML = `<span class="text-emerald-400 font-bold">visitor@supasit-portfolio:~$</span> <span class="text-white">${escapeHtml(rawCmd)}</span>`;
    terminalOutput.appendChild(inputEcho);

    if (cmd === '') return;

    // Response
    const resDiv = document.createElement('div');
    resDiv.className = 'text-xs text-slate-300 mb-2 mt-0.5';

    if (commands[cmd]) {
      const output = commands[cmd]();
      if (cmd === 'clear') return;
      resDiv.innerHTML = output;
    } else {
      resDiv.innerHTML = `<span class="text-rose-400">command not found: "${escapeHtml(rawCmd)}". Type <strong class="text-indigo-300 cursor-pointer underline" onclick="runChip('help')">help</strong> to view available commands.</span>`;
    }

    terminalOutput.appendChild(resDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value;
      terminalInput.value = '';
      executeCommand(cmd);
    }
  });

  quickCmds.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  window.runChip = (cmd) => executeCommand(cmd);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================
   9. COPY TO CLIPBOARD UTILITY WITH TOAST
   ========================================================== */
function copyToClipboard(text, buttonElement) {
  playAudioTone('click');
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard!`);
    
    if (buttonElement) {
      const originalHtml = buttonElement.innerHTML;
      buttonElement.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i><span>Copied!</span>';
      setTimeout(() => {
        buttonElement.innerHTML = originalHtml;
      }, 2000);
    }
  }).catch(err => {
    console.error('Could not copy text: ', err);
    showToast('Failed to copy text');
  });
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}
