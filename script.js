const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const form = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const shuffleGrid = document.querySelector("#shuffle-grid");
const shuffleImage = document.querySelector(".shuffle-image");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

toggle.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  lucide.createIcons();
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Dados validados. Para receber as mensagens, conecte este formulário ao e-mail ou WhatsApp oficial do IRX.";
  formNote.classList.add("success");
});

document.querySelector("#year").textContent = new Date().getFullYear();
lucide.createIcons();

if (shuffleGrid && shuffleImage) {
  const tiles = Array.from({ length: 16 }, (_, index) => {
    const tile = document.createElement("span");

    tile.className = "shuffle-tile";
    tile.style.backgroundImage = `url("assets/shuffle/shuffle-${String(index + 1).padStart(2, "0")}.webp")`;
    tile.dataset.home = String(index);
    shuffleGrid.appendChild(tile);

    return tile;
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shuffleTiles = () => {
    const positions = tiles.map((_, index) => index);

    for (let current = positions.length - 1; current > 0; current -= 1) {
      const random = Math.floor(Math.random() * (current + 1));
      [positions[current], positions[random]] = [positions[random], positions[current]];
    }

    shuffleImage.classList.add("is-shuffling");

    tiles.forEach((tile, index) => {
      const target = positions[index];
      const homeRow = Math.floor(index / 4);
      const homeColumn = index % 4;
      const targetRow = Math.floor(target / 4);
      const targetColumn = target % 4;
      const x = (targetColumn - homeColumn) * 100;
      const y = (targetRow - homeRow) * 100;

      tile.style.transform = `translate(${x}%, ${y}%)`;
    });

    window.setTimeout(() => shuffleImage.classList.remove("is-shuffling"), 900);
  };

  if (!reducedMotion) {
    window.setInterval(shuffleTiles, 3600);
  }
}
