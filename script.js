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

    document.querySelectorAll(".project").forEach((project) => {
      const categories = project.dataset.category?.split(" ") || [];
      project.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});
