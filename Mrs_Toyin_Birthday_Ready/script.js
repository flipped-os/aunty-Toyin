document.documentElement.style.setProperty("--gold", CONFIG.accent);

const intro = document.querySelector("#intro");
const welcome = document.querySelector("#welcome");
const home = document.querySelector("#home");

document.querySelector("#openingName").textContent = CONFIG.name;
document.querySelector("#welcomeGreeting").textContent = CONFIG.greeting;
document.querySelector("#topName").textContent = CONFIG.name;
document.querySelector("#heroGreeting").textContent = CONFIG.greeting;
document.querySelector("#heroMessage").textContent = CONFIG.introMessage;
document.querySelector("#birthdayMessage").textContent = CONFIG.birthdayMessage;
document.querySelector("#sender").textContent = CONFIG.senderName;
document.querySelector("#footerName").textContent = CONFIG.name;

/* Portrait */
const portraitImg = document.querySelector("#portraitImg");
portraitImg.src = CONFIG.photos[0];
portraitImg.alt = CONFIG.name;

/* Gallery */
const photoGrid = document.querySelector("#photoGrid");

CONFIG.photos.forEach((photo, index) => {
  if (!photo) return;

  const card = document.createElement("div");
  card.className = "memory";

  const img = document.createElement("img");
  img.src = photo;
  img.alt = `${CONFIG.name} memory ${index + 1}`;
  img.loading = "lazy";

  card.appendChild(img);
  photoGrid.appendChild(card);
});

/* Videos */
const video1 = document.querySelector("#birthdayVideo1");
const video2 = document.querySelector("#birthdayVideo2");

if (CONFIG.videos?.[0]) video1.src = CONFIG.videos[0];
if (CONFIG.videos?.[1]) video2.src = CONFIG.videos[1];

/* Mobile scroll autoplay: play whichever video occupies the most of the viewport. */
const videoList = [video1, video2].filter(Boolean);
const mobileVideoQuery = window.matchMedia("(max-width: 699px)");

if (mobileVideoQuery.matches && videoList.length) {
  const visibility = new Map(videoList.map((video) => [video, 0]));
  let activeVideo = null;

  videoList.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
  });

  const playMostVisibleVideo = () => {
    let mostVisible = null;
    let highestRatio = 0;

    visibility.forEach((ratio, video) => {
      if (ratio > highestRatio) {
        highestRatio = ratio;
        mostVisible = video;
      }
    });

    if (mostVisible && highestRatio >= 0.45 && mostVisible !== activeVideo) {
      activeVideo = mostVisible;

      videoList.forEach((video) => {
        if (video !== mostVisible) video.pause();
      });

      mostVisible.play().catch(() => {});
    } else if (highestRatio < 0.2) {
      videoList.forEach((video) => video.pause());
      activeVideo = null;
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibility.set(entry.target, entry.intersectionRatio));
    playMostVisibleVideo();
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
  });

  videoList.forEach((video) => observer.observe(video));
}

/* Clean fullscreen: expand the whole video card, not just a tiny video box. */
document.querySelectorAll(".video-card").forEach((card) => {
  const video = card.querySelector("video");
  const button = card.querySelector(".fullscreen-button");

  button.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (card.requestFullscreen) {
        await card.requestFullscreen();
      }
    } catch (error) {
      // Some browsers restrict fullscreen; native video controls still work.
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const active = document.fullscreenElement === card;
    card.classList.toggle("is-fullscreen", active);
    button.textContent = active ? "✕" : "⛶";
    button.setAttribute("aria-label", active ? "Exit fullscreen" : "Open video fullscreen");
  });
});

/* Opening */
setTimeout(() => {
  intro.classList.add("hidden");
  welcome.classList.remove("hidden");
}, 2300);

/* Enter site */
document.querySelector("#openButton").addEventListener("click", async () => {
  welcome.classList.add("hidden");
  home.classList.remove("hidden");

  window.scrollTo(0, 0);
});

/* Memories */
document.querySelector("#viewMemories").addEventListener("click", () => {
  document.querySelector("#memories").scrollIntoView({
    behavior: "smooth"
  });
});
