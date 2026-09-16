// Direct visits start at the hero; project return links explicitly opt in to anchoring.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const returningToWorks = new URLSearchParams(location.search).get("return") === "works";
if (!returningToWorks && location.hash) {
  history.replaceState(null, "", location.pathname + location.search);
}
const works = [
  ["work-01.webp", "灵犀 AI 平台", "LINGXI AI PLATFORM", "AIGC marketing productivity platform"],
  ["work-08.webp", "灵思创意", "LINGSI CREATIVE", "AI asset cloud and smart retrieval"],
  ["work-02.webp", "鲸鹏投放系统", "JINGPENG MEDIA BUYING", "One-stop intelligent media buying"],
  ["work-09.webp", "Eagle 数据平台", "EAGLE DATA PLATFORM", "Data insight and decision support"],
  ["work-03.webp", "设计系统组件库", "DESIGN SYSTEM", "Product-line components and standards"],
  ["work-10.webp", "大于众学 APP", "DAYU LEARNING APP", "Family education product upgrade"],
  ["work-04.webp", "智能画布探索", "SMART CANVAS", "AI-assisted content workflow"],
  ["work-11.webp", "语料库商业化", "CORPUS COMMERCIALIZATION", "Experience reconstruction"],
  ["work-05.webp", "人群洞察平台", "AUDIENCE INSIGHT", "Audience segmentation and analysis"],
  ["work-12.webp", "广告投放 SaaS", "ADVERTISING SAAS", "Campaign management workflow"],
  ["work-06.webp", "汽车行业体验策划", "AUTO UX STRATEGY", "GAC service and digital touchpoints"],
  ["work-13.webp", "快消行业体验策划", "FMCG UX STRATEGY", "Brand service and member journeys"],
  ["work-07.webp", "C 端会员体系", "MEMBERSHIP SYSTEM", "Consumer growth experience"],
  ["work-14.webp", "优亿市场门户", "UOUI MARKET PORTAL", "High-traffic app distribution"],
  ["work-15.webp", "品牌视觉与游戏化", "BRAND VISUAL SYSTEM", "IP image and gamified journeys"],
];

const galleryGroups = document.querySelectorAll(".gallery-group");
if (galleryGroups.length) {
  galleryGroups.forEach((group, groupIndex) => {
    works.forEach((work, index) => {
      const figure = document.createElement("figure");
      figure.className = "work-card";
      figure.role = "button";
      figure.tabIndex = groupIndex === 0 ? 0 : -1;
      figure.dataset.workIndex = String(index);
      figure.setAttribute("aria-label", `查看作品：${work[0]}`);
      figure.innerHTML = `<img src="./works/${work[0]}" alt="${groupIndex === 0 ? work[0] : ""}" draggable="false" decoding="async" loading="${index < 8 ? "eager" : "lazy"}" />`;
      group.appendChild(figure);
    });
  });
}

const track = document.querySelector(".gallery-track");
const gallery = document.querySelector(".work-gallery");
let offset = 0;
let dragging = false;
let startX = 0;
let startOffset = 0;

function groupWidth() {
  if (!galleryGroups.length) return 0;
  return galleryGroups[0].getBoundingClientRect().width;
}

function renderGallery() {
  const width = groupWidth();
  if (width > 0) {
    offset = ((offset % width) + width) % width;
    if (track) track.style.transform = `translate3d(${-offset}px,0,0)`;
  }
}

function tick() {
  if (gallery && !dragging) {
    offset += 0.42;
    renderGallery();
  }
  requestAnimationFrame(tick);
}

if (gallery) {
  gallery.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    startOffset = offset;
    gallery.setPointerCapture(event.pointerId);
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    offset = startOffset - (event.clientX - startX);
    renderGallery();
  });

  gallery.addEventListener("pointerup", () => {
    dragging = false;
  });

  gallery.addEventListener("pointercancel", () => {
    dragging = false;
  });

  gallery.addEventListener("wheel", (event) => {
    offset += event.deltaY || event.deltaX;
    renderGallery();
  }, { passive: true });
}

function openWork(index) {
  const work = works[index];
  if (!work) return;
  const backdrop = document.createElement("div");
  backdrop.className = "work-modal-backdrop";
  backdrop.innerHTML = `
    <div class="work-modal" role="dialog" aria-modal="true" aria-label="${work[1]}">
      <div class="work-modal-info">
        <div>
          <p class="work-modal-kicker">SELECTED WORK</p>
          <h2>${work[1]}</h2>
          <p class="work-modal-english">${work[2]}</p>
          <p class="work-modal-file">${work[3]}</p>
        </div>
      </div>
      <div class="work-modal-image"><img src="./works/${work[0]}" alt="${work[1]}" /></div>
      <div class="work-modal-side"></div>
      <button class="work-modal-close" type="button" aria-label="关闭"><span>×</span></button>
    </div>
  `;
  document.body.appendChild(backdrop);
  backdrop.querySelector(".work-modal-close").focus();
  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop || event.target.closest(".work-modal-close")) close();
  });
  document.addEventListener("keydown", function escape(event) {
    if (event.key === "Escape") {
      close();
      document.removeEventListener("keydown", escape);
    }
  });
}

if (gallery) {
  gallery.addEventListener("click", (event) => {
    const card = event.target.closest(".work-card");
    if (card) openWork(Number(card.dataset.workIndex));
  });

  gallery.addEventListener("keydown", (event) => {
    const card = event.target.closest(".work-card");
    if (!card) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWork(Number(card.dataset.workIndex));
    }
  });
}

const creatorHero = document.querySelector(".creator-hero");
if (creatorHero) {
  const updatePointer = (event) => {
    const rect = creatorHero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));
    creatorHero.style.setProperty("--mx", `${clampedX * 100}%`);
    creatorHero.style.setProperty("--my", `${clampedY * 100}%`);
    creatorHero.style.setProperty("--move-x", `${(clampedX - .5) * 140}px`);
    creatorHero.style.setProperty("--move-y", `${(clampedY - .5) * 88}px`);
    creatorHero.style.setProperty("--tilt-x", `${(clampedX - .5) * 16}deg`);
    creatorHero.style.setProperty("--tilt-y", `${(0.5 - clampedY) * 12}deg`);
  };

  creatorHero.addEventListener("pointermove", updatePointer);
  creatorHero.addEventListener("pointerleave", () => {
    creatorHero.style.setProperty("--mx", "50%");
    creatorHero.style.setProperty("--my", "50%");
    creatorHero.style.setProperty("--move-x", "0px");
    creatorHero.style.setProperty("--move-y", "0px");
    creatorHero.style.setProperty("--tilt-x", "0deg");
    creatorHero.style.setProperty("--tilt-y", "0deg");
  });
}

const experienceSection = document.querySelector(".experience-section");
const experienceMotionItems = [
  [".experience-heading", .06],
  [".experience-portrait", .14],
  [".experience-eyebrow", .22],
  [".experience-about>h3", .28],
  [".experience-intro", .4],
  [".advantage-card:nth-child(1)", .52],
  [".advantage-card:nth-child(2)", .62],
  [".advantage-card:nth-child(3)", .72],
  [".career-block", .58],
].map(([selector, delay]) => ({
  element: document.querySelector(selector),
  delay,
})).filter((item) => item.element);
document.documentElement.classList.add("scroll-transition-ready");

function updateScrollTransition() {
  const viewportHeight = window.innerHeight || 1;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const heroProgress = Math.max(0, Math.min(1, scrollY / (viewportHeight * .92)));
  document.documentElement.style.setProperty("--hero-drop", `${heroProgress * viewportHeight * .34}px`);
  document.documentElement.style.setProperty("--hero-fade", String(Math.max(0, 1 - heroProgress * 1.15)));

  if (!experienceSection) return;
  const rect = experienceSection.getBoundingClientRect();
  const sectionProgress = Math.max(0, Math.min(1, (viewportHeight * .82 - rect.top) / (viewportHeight * 1.18)));
  document.documentElement.style.setProperty("--experience-progress", sectionProgress.toFixed(3));

  experienceMotionItems.forEach(({ element, delay }) => {
    const isCareer = element.classList.contains("career-block");
    const raw = Math.max(0, Math.min(1, (sectionProgress - delay) / (isCareer ? .18 : .24)));
    const eased = raw < .5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    element.style.setProperty("--item-opacity", eased.toFixed(3));
    element.style.setProperty("--item-rise", `${(1 - eased) * (isCareer ? 54 : 118)}px`);
    element.style.setProperty("--item-blur", `${(1 - eased) * (isCareer ? 10 : 28)}px`);
    element.style.setProperty("--item-scale", (0.965 + eased * .035).toFixed(3));
  });
}

window.addEventListener("scroll", updateScrollTransition, { passive: true });
window.addEventListener("resize", updateScrollTransition);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-revealed");
  });
}, { threshold: 0.16 });

document.documentElement.classList.add("reveal-effects-ready");
document.querySelectorAll(".scroll-reveal").forEach((element) => observer.observe(element));
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) {
      const content = target.querySelector(".scroll-reveal");
      if (content) content.classList.add("is-revealed");
      const anchor = target.id === "works"
        ? target.querySelector("#personal-works-title") || target
        : target;
      if (target.id === "works") {
        // Use layout coordinates so reveal transforms and scroll margins cannot
        // pull the previous work-experience section back into view.
        let top = 0;
        for (let element = anchor; element; element = element.offsetParent) {
          top += element.offsetTop;
        }
        window.scrollTo({ top: Math.max(0, top - 24), behavior: "instant" });
      } else {
        anchor.scrollIntoView({ block: "start", behavior: "instant" });
      }
    } else if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    updateScrollTransition();
  });
});
updateScrollTransition();
requestAnimationFrame(tick);
