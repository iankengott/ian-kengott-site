const lensCopy = {
  magnonics: {
    title: "Magnonics and magnetic materials",
    body: "Research support around magnetic materials, spin dynamics, spectroscopy context, and workflows connected to Dr. Arena's lab.",
  },
  muon: {
    title: "Muon telescope context",
    body: "A lab-connected project thread in my notes. I keep the public description restrained until the project details are ready to publish.",
  },
  mantis: {
    title: "MANTiS and x-ray spectromicroscopy",
    body: "Packaging and workflow notes for hyperspectral x-ray microscopy: preprocessing, PCA/SVD, clustering, maps, NNMA, and peak fitting.",
  },
};

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;

  const isDark = theme === "dark";
  toggle.setAttribute("aria-pressed", String(isDark));
  toggle.querySelector("span").textContent = isDark ? "Light" : "Dark";
}

document.querySelector("#themeToggle")?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

setTheme(document.documentElement.dataset.theme || "light");

const lensOutput = document.querySelector("#lensOutput");
document.querySelectorAll(".lens-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.lens;
    const copy = lensCopy[selected];
    if (!copy || !lensOutput) return;

    document.querySelectorAll(".lens-chip").forEach((chip) => {
      const isActive = chip === button;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-selected", String(isActive));
    });

    lensOutput.querySelector("h3").textContent = copy.title;
    lensOutput.querySelector("p:last-child").textContent = copy.body;
    lensOutput.classList.remove("is-swapping");
    void lensOutput.offsetWidth;
    lensOutput.classList.add("is-swapping");
  });
});

document.querySelectorAll(".shot-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.shot;

    document.querySelectorAll(".shot-chip").forEach((chip) => {
      const isActive = chip === button;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll(".mantis-shot").forEach((panel) => {
      const isActive = panel.dataset.shotPanel === selected;
      panel.hidden = !isActive;
      if (isActive) {
        panel.classList.remove("is-entering");
        void panel.offsetWidth;
        panel.classList.add("is-entering");
      }
    });
  });
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const isActive = chip === button;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".project, .arbor-panel").forEach((project) => {
      const categories = project.dataset.category?.split(" ") || [];
      const shouldShow = filter === "all" || categories.includes(filter);
      project.hidden = !shouldShow;
      if (shouldShow) {
        project.classList.remove("is-entering");
        void project.offsetWidth;
        project.classList.add("is-entering");
      }
    });
  });
});

const revealTargets = document.querySelectorAll(
  ".session-strip, .section, .feature, .card, .project, .arbor-panel, .lens-output"
);

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("revealable"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("in-view"));
}
