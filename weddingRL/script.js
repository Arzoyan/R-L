const weddingDate = new Date("2026-07-19T15:30:00+04:00");
const counts = {
  days: document.querySelector('[data-count="days"]'),
  hours: document.querySelector('[data-count="hours"]'),
  minutes: document.querySelector('[data-count="minutes"]'),
  seconds: document.querySelector('[data-count="seconds"]'),
};

function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  counts.days.textContent = days;
  counts.hours.textContent = String(hours).padStart(2, "0");
  counts.minutes.textContent = String(minutes).padStart(2, "0");
  counts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const musicButtons = document.querySelectorAll(".music-start__button");
const musicLabel = document.querySelector(".music-start__label");
const weddingMusic = document.querySelector("#wedding-audio");
weddingMusic.loop = true;
weddingMusic.volume = 0.55;

function playWeddingMusic() {
  return weddingMusic.play().then(() => {
    musicButtons.forEach(button => button.classList.add("is-playing"));
    musicLabel.textContent = "Անջատել";
  });
}

function stopWeddingMusic() {
  weddingMusic.pause();
  weddingMusic.currentTime = 0;
  musicButtons.forEach(button => button.classList.remove("is-playing"));
  musicLabel.textContent = "Միացնել";
}

function enableMusicAfterFirstInteraction() {
  playWeddingMusic().catch(() => {});
  removeMusicFallbackListeners();
}

function removeMusicFallbackListeners() {
  document.removeEventListener("pointerdown", enableMusicAfterFirstInteraction, true);
  document.removeEventListener("touchstart", enableMusicAfterFirstInteraction, true);
  document.removeEventListener("click", enableMusicAfterFirstInteraction, true);
  document.removeEventListener("keydown", enableMusicAfterFirstInteraction, true);
}

playWeddingMusic().catch(() => {
  document.addEventListener("pointerdown", enableMusicAfterFirstInteraction, true);
  document.addEventListener("touchstart", enableMusicAfterFirstInteraction, true);
  document.addEventListener("click", enableMusicAfterFirstInteraction, true);
  document.addEventListener("keydown", enableMusicAfterFirstInteraction, true);
});

musicButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (button.classList.contains("is-playing")) {
      stopWeddingMusic();
      return;
    }

    playWeddingMusic().catch(() => {
      musicButtons.forEach(item => item.classList.remove("is-playing"));
      musicLabel.textContent = "Միացնել";
    });
  });
});
