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
    { src: "img/foto2.jpeg", pie: "Aprender también es compartir" },
  ],
  // Si tienes un MP3, coloca aquí su ruta, por ejemplo: "img/cancion.mp3"
  cancion: { src: "", titulo: "Una canción para usted" },
};

const $ = (id) => document.getElementById(id);

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
  async function play() {
    if (on) return true;

    if (CONFIG.cancion.src) {
      audio =
        audio || Object.assign(new Audio(CONFIG.cancion.src), { loop: true });
      try {
        await audio.play();
        on = true;
        return true;
      } catch (e) {
        return false;
      }
    }

    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    try {
      await ctx.resume();
      on = true;
      tone(notes[step++ % notes.length]);
      clearInterval(timer);
      timer = setInterval(() => tone(notes[step++ % notes.length]), 420);
      return true;
    } catch (e) {
      return false;
    }
  }

  return {
    play,
    toggle() {
      if (on) {
        on = false;
        if (CONFIG.cancion.src && audio) audio.pause();
        clearInterval(timer);
        return false;
      }
      // toggle sigue disponible para el botón de reproducción/pausa.
      play();
      return true;
    },
  };
})();

// Onda de la canción
const wave = $("wave");
for (let i = 0; i < 34; i++) {
  const b = document.createElement("i");
  const h = 10 + Math.abs(Math.sin(i * 0.7) * 30) + ((i * 7) % 13);
  b.style.cssText = `--h:${h.toFixed(0)};--n:${i}`;
  wave.appendChild(b);
}
/* ---------- Invitación ---------- */
const invitation = $("invitation");
const openBtn = $("openBtn");
openBtn.addEventListener("click", async () => {
  // El clic de "Abrir invitación" desbloquea el audio del navegador.
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
  invitation.classList.add("closing");

  // Dejamos respirar la entrada para que el girasol no aparezca ya terminado.
  setTimeout(() => {
    document.body.classList.add("flower-ready");
  }, 850);

  // La música empieza automáticamente al abrir la invitación.
  const on = await Music.play();
  if (on) {
    $("cancion").classList.add("playing");
    $("play").setAttribute("aria-pressed", "true");
    $("play").setAttribute("aria-label", "Pausar canción");
    $("songHint").textContent = "Sonando…";
  }

  setTimeout(() => invitation.remove(), 1100);
});

/* ---------- Datos ---------- */
const q = new URLSearchParams(location.search);
if (q.get("para")) CONFIG.para = q.get("para");
if (q.get("de")) CONFIG.de = q.get("de");

document.title = `Para ${CONFIG.para} · Un detalle con gratitud`;
$("nombre").textContent = CONFIG.para;
$("tituloFotos").textContent = CONFIG.tituloFotos;
$("song").textContent = CONFIG.cancion.titulo;
$("flower").innerHTML = sunflower({ petals: 21 });
$("mini").innerHTML = sunflower({ petals: 12, cls: "still" });

/* ---------- Mensaje ---------- */
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

const lines = [...document.querySelectorAll(".ln")];
const ioLit = new IntersectionObserver(
  (es) => es.forEach((e) => e.target.classList.toggle("lit", e.isIntersecting)),
  { rootMargin: "-38% 0px -38% 0px" },
);
const ioSeen = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("seen");
    }),
  { rootMargin: "0px 0px -35% 0px" },
);
lines.forEach((l) => {
  ioLit.observe(l);
  ioSeen.observe(l);
});

/* ---------- Galería ---------- */
const track = $("track"),
  dots = $("dots");
CONFIG.fotos.forEach((f) => {
  const fig = document.createElement("figure");
  fig.className = "item";
  const card = document.createElement("div");
  card.className = "photo-card";

  const im = new Image();
  im.src = f.src;
  im.alt = f.pie || "";
  im.className = "ph";
  im.loading = "lazy";
  card.appendChild(im);

  const cap = document.createElement("figcaption");
  cap.textContent = f.pie || "";
  fig.append(card, cap);
  track.appendChild(fig);
  dots.appendChild(document.createElement("i"));
});

const step = () => {
  const item = track.querySelector(".item");
  return item ? item.getBoundingClientRect().width + 22 : 320;
};
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

/* ---------- Luciérnagas ---------- */
(() => {
  const cv = $("fly"),
    cx = cv.getContext("2d");
  let W = 0,
    H = 0,
    dpr = 1,
    flies = [];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 600 ? 30 : 58;
    if (flies.length !== n) {
      flies = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1.2 + Math.random() * 2,
        a: Math.random() * Math.PI * 2,
        s: 0.08 + Math.random() * 0.28,
        p: Math.random() * Math.PI * 2,
        f: 0.55 + Math.random() * 1.2,
      }));
    }
  }

  size();
  window.addEventListener("resize", size);

  function draw(t) {
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";

    for (const f of flies) {
      f.a += Math.sin(t / 2500 + f.p) * 0.018;
      f.x += Math.cos(f.a) * f.s;
      f.y += Math.sin(f.a) * f.s - 0.035;

      if (f.x < -25) f.x = W + 25;
      if (f.x > W + 25) f.x = -25;
      if (f.y < -25) f.y = H + 25;
      if (f.y > H + 25) f.y = -25;

      const pulse = 0.5 + 0.5 * Math.sin((t / 1000) * f.f + f.p);
      const al = 0.12 + 0.88 * pulse * pulse;
      const R = f.r * 7;

      const gr = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
      gr.addColorStop(0, `rgba(255,244,170,${al})`);
      gr.addColorStop(0.22, `rgba(255,216,75,${al * 0.55})`);
      gr.addColorStop(1, "rgba(255,210,70,0)");

      cx.fillStyle = gr;
      cx.beginPath();
      cx.arc(f.x, f.y, R, 0, Math.PI * 2);
      cx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ---------- Botón de canción ---------- */
$("play").addEventListener("click", async () => {
  const on = await Music.toggle();
  $("cancion").classList.toggle("playing", on);
  $("play").setAttribute("aria-pressed", on);
  $("play").setAttribute(
    "aria-label",
    on ? "Pausar canción" : "Reproducir canción",
  );
  $("songHint").textContent = on
    ? "Sonando… · Mira cómo reacciona la onda"
    : "Toca el botón para comenzar";
});
