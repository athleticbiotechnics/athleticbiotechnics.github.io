const canvas = document.querySelector("#marble-field");
const context = canvas.getContext("2d");
let width = 0;
let height = 0;
let phase = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawMarble();
}

function drawMarble() {
  context.clearRect(0, 0, width, height);
  context.lineCap = "round";
  const darkMode = document.body.classList.contains("performance-home");

  for (let i = 0; i < 34; i += 1) {
    const yBase = (height / 34) * i + Math.sin(i * 1.72 + phase) * 44;
    const stroke = darkMode
      ? (i % 6 === 0 ? "rgba(139, 123, 184, 0.14)" : "rgba(242, 240, 234, 0.045)")
      : (i % 6 === 0 ? "rgba(180, 70, 43, 0.16)" : "rgba(17, 19, 18, 0.08)");
    context.strokeStyle = stroke;
    context.lineWidth = i % 7 === 0 ? 2.2 : 1;
    context.beginPath();

    for (let x = -120; x <= width + 120; x += 24) {
      const wave =
        Math.sin(x * 0.008 + i * 0.6 + phase) * 22 +
        Math.sin(x * 0.019 + i * 1.1) * 10;
      const y = yBase + wave;
      if (x === -120) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
  }
}

function animateMarble() {
  phase += 0.0022;
  drawMarble();
  requestAnimationFrame(animateMarble);
}

function setupSignup() {
  const form = document.querySelector(".signup-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.querySelector("input").value.trim();
    const note = form.querySelector(".form-note");

    if (!email) {
      note.textContent = "Add an email and we will keep you close to early access.";
      return;
    }

    note.textContent = "Received. Athletic Biotechnics will follow up with early access details.";
    form.reset();
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  animateMarble();
}

setupSignup();
