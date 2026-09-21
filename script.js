const CONFIG = {
  para: "Karen Corilla",
  de: "Con mucho cariño, sus estudiantes",
  mensaje: [
    "Hay personas que no solo enseñan una materia… también dejan huellas.",
    "Profesora Karen, gracias por compartir sus conocimientos con paciencia, dedicación y esa manera especial de convertir cada clase en una oportunidad para aprender.",
    "Cada explicación, cada consejo y cada palabra de ánimo puede parecer pequeña en el momento, pero para un estudiante puede convertirse en algo que recuerde durante muchos años.",
    "Gracias por enseñarnos que aprender no es solo memorizar, sino comprender, intentar, equivocarse y seguir adelante.",
    "Con admiración y gratitud, profesora Karen. 💛",
  ],
  tituloFotos: "Momentos que dejan huella",
  fotos: [
    { src: "img/foto1.jpeg", pie: "Una clase, muchas enseñanzas" },
    { src: "img/foto2.jpeg", pie: "Aprender también es compartir" }
  ],
  cancion: { src: "", titulo: "Una canción para usted" }, // src: "musica/cancion.mp3"
};

/* ---------- Girasol en SVG (se dibuja por código) ---------- */
let _sid = 0;
function sunflower({ petals = 21, cls = "" } = {}) {
  const id = "sf" + _sid++;
  let back = "",
    front = "",
    seeds = "";
  for (let i = 0; i < petals; i++) {
    const a = (i * 360) / petals;
    back += `<g transform="rotate(${a.toFixed(2)} 100 100)"><ellipse class="petal" style="--i:${i}" cx="100" cy="34" rx="12" ry="31" fill="url(#${id}p)"/></g>`;
    front += `<g transform="rotate(${(a + 180 / petals).toFixed(2)} 100 100)"><ellipse class="petal" style="--i:${i + petals}" cx="100" cy="42" rx="11" ry="27" fill="url(#${id}q)"/></g>`;
  }
  for (let n = 1; n <= 110; n++) {
    const r = 3.3 * Math.sqrt(n),
      t = n * 2.39996;
    seeds += `<circle cx="${(100 + r * Math.cos(t)).toFixed(1)}" cy="${(100 + r * Math.sin(t)).toFixed(1)}" r="${(1 + n / 160).toFixed(2)}"/>`;
  }
  return `<svg class="sf ${cls}" viewBox="0 0 200 200" aria-hidden="true"><defs>
    <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD93B"/><stop offset="1" stop-color="#EE9E00"/></linearGradient>
    <linearGradient id="${id}q" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE766"/><stop offset="1" stop-color="#F7B500"/></linearGradient>
    <radialGradient id="${id}c"><stop offset="0" stop-color="#7A4416"/><stop offset="1" stop-color="#3A1E08"/></radialGradient></defs>
    ${back}${front}<g class="disc"><circle cx="100" cy="100" r="38" fill="url(#${id}c)"/><g fill="#1F0F04" opacity=".55">${seeds}</g></g></svg>`;
}

/* ---------- Música (archivo real o melodía de ejemplo) ---------- */
const Music = (() => {
  let audio,
    ctx,
    timer,
    on = false,
    step = 0;
  const notes = [
    261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23, 440, 587.33, 440,
    349.23,
  ];
  const tone = (f) => {
    const t = ctx.currentTime,
      o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 1.5);
  };
  return {
    toggle() {
      on = !on;
      if (CONFIG.cancion.src) {
        audio =
          audio || Object.assign(new Audio(CONFIG.cancion.src), { loop: true });
        on ? audio.play() : audio.pause();
      } else if (on) {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume();
        tone(notes[step++ % notes.length]);
        timer = setInterval(() => tone(notes[step++ % notes.length]), 420);
      } else clearInterval(timer);
      return on;
    },
  };
})();

/* ---------- Construcción de la página ---------- */
const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
if (q.get("para")) CONFIG.para = q.get("para");
if (q.get("de")) CONFIG.de = q.get("de");
document.title = `Para ${CONFIG.para} · Un detalle con gratitud`;
$("nombre").textContent = CONFIG.para;
$("tituloFotos").textContent = CONFIG.tituloFotos;
$("song").textContent = CONFIG.cancion.titulo;
$("flower").innerHTML = sunflower({ petals: 21 });
$("mini").innerHTML = sunflower({ petals: 12, cls: "still" });

// Mensaje
const box = $("mensaje");
CONFIG.mensaje.forEach((t, i) => {
  const p = document.createElement("p");
  p.className = "ln" + (i === CONFIG.mensaje.length - 1 ? " fin" : "");
  p.textContent = t;
  box.appendChild(p);
});
const firma = document.createElement("p");
firma.className = "firma";
firma.textContent = "Con cariño, " + CONFIG.de;
box.appendChild(firma);

// La línea del centro se ilumina; las que ya pasaron quedan más tenues pero legibles
const lines = [...document.querySelectorAll(".ln")];
const ioLit = new IntersectionObserver(
  (es) => es.forEach((e) => e.target.classList.toggle("lit", e.isIntersecting)),
  { rootMargin: "-40% 0px -40% 0px" },
);
const ioSeen = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("seen");
    }),
  { rootMargin: "0px 0px -45% 0px" },
);
lines.forEach((l) => {
  ioLit.observe(l);
  ioSeen.observe(l);
});

// Fotos
const track = $("track"),
  dots = $("dots");
CONFIG.fotos.forEach((f, i) => {
  const fig = document.createElement("figure");
  fig.className = "item";
  const arco = document.createElement("div");
  arco.className = "arco";
  if (f.src) {
    const im = new Image();
    im.src = f.src;
    im.alt = f.pie || "";
    im.className = "ph";
    im.loading = "lazy";
    arco.appendChild(im);
  } else {
    const d = document.createElement("div");
    d.className = "ph";
    d.innerHTML = sunflower({ cls: "still" }) + "<span>Tu foto aquí</span>";
    arco.appendChild(d);
  }
  const cap = document.createElement("figcaption");
  cap.textContent = f.pie || "";
  fig.append(arco, cap);
  track.appendChild(fig);
  dots.appendChild(document.createElement("i"));
});
const step = () =>
  track.firstElementChild
    ? track.firstElementChild.getBoundingClientRect().width + 34
    : 300;
const paintDots = () => {
  const i = Math.round(track.scrollLeft / step());
  [...dots.children].forEach((d, k) =>
    d.classList.toggle("on", k === Math.min(i, dots.children.length - 1)),
  );
};
track.addEventListener("scroll", () => requestAnimationFrame(paintDots), {
  passive: true,
});
$("prev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
$("next").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
paintDots();

// Onda de la canción
const wave = $("wave");
for (let i = 0; i < 34; i++) {
  const b = document.createElement("i");
  const h = 10 + Math.abs(Math.sin(i * 0.7) * 30) + ((i * 7) % 13);
  b.style.cssText = `--h:${h.toFixed(0)};--n:${i}`;
  wave.appendChild(b);
}
$("play").addEventListener("click", () => {
  const on = Music.toggle();
  $("cancion").classList.toggle("playing", on);
  $("play").setAttribute("aria-pressed", on);
  $("play").setAttribute(
    "aria-label",
    on ? "Pausar canción" : "Reproducir canción",
  );
  $("songHint").textContent = on ? "Sonando…" : "Toca para escucharla";
});

/* ---------- Luciérnagas ---------- */
(() => {
  const cv = $("fly"),
    cx = cv.getContext("2d"),
    reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr;
  const flies = [];
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener("resize", size);
  const n = W < 600 ? 34 : 60;
  for (let i = 0; i < n; i++)
    flies.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.4 + Math.random() * 2.2,
      a: Math.random() * 6.28,
      s: 0.12 + Math.random() * 0.32,
      p: Math.random() * 6.28,
      f: 0.5 + Math.random() * 1.1,
    });
  function draw(t) {
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";
    for (const f of flies) {
      if (!reduce) {
        f.a += Math.sin(t / 2600 + f.p) * 0.025;
        f.x += Math.cos(f.a) * f.s;
        f.y += Math.sin(f.a) * f.s - 0.06;
        if (f.x < -20) f.x = W + 20;
        if (f.x > W + 20) f.x = -20;
        if (f.y < -20) f.y = H + 20;
        if (f.y > H + 20) f.y = -20;
      }
      const g = 0.5 + 0.5 * Math.sin((t / 1000) * f.f + f.p),
        al = 0.12 + 0.88 * g * g,
        R = f.r * 7;
      const gr = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
      gr.addColorStop(0, `rgba(255,236,150,${al})`);
      gr.addColorStop(0.25, `rgba(255,210,70,${al * 0.45})`);
      gr.addColorStop(1, "rgba(255,210,70,0)");
      cx.fillStyle = gr;
      cx.beginPath();
      cx.arc(f.x, f.y, R, 0, 6.283);
      cx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
