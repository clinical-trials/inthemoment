const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const audioPlayers = document.querySelectorAll("[data-audio]");
const form = document.querySelector("[data-inquiry-form]");
const formStatus = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

audioPlayers.forEach((audio) => {
  const audioPanel = audio.closest(".audio-panel");
  const audioNote = audioPanel?.querySelector("[data-audio-note]");
  const title = audio.dataset.title || "this sample";

  audio.addEventListener("play", () => {
    audioPlayers.forEach((otherAudio) => {
      if (otherAudio !== audio) otherAudio.pause();
    });
    audioPanel?.classList.add("is-playing");
    if (audioNote) audioNote.textContent = `Now playing: ${title}.`;
  });

  audio.addEventListener("pause", () => {
    audioPanel?.classList.remove("is-playing");
    if (audioNote && !audio.ended) audioNote.textContent = "Paused. Press play to continue the sample.";
  });

  audio.addEventListener("ended", () => {
    audioPanel?.classList.remove("is-playing");
    if (audioNote) audioNote.textContent = "Sample complete. Inquire below for availability.";
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const lines = [
    "New In the Moment inquiry",
    "",
    `Name: ${data.get("name") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Phone: ${data.get("phone") || ""}`,
    `Event date: ${data.get("date") || ""}`,
    `Event location: ${data.get("location") || ""}`,
    `Event type: ${data.get("type") || ""}`,
    `Preferred ensemble: ${data.get("ensemble") || ""}`,
    "",
    "Event details:",
    `${data.get("message") || ""}`,
  ];

  const subject = encodeURIComponent("In the Moment event inquiry");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:Calvinappleberry@gmail.com?subject=${subject}&body=${body}`;

  if (formStatus) {
    formStatus.textContent =
      "Thank you for reaching out. Your email app should open with the inquiry details.";
  }
});
