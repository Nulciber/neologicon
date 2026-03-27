// Neologicon JS
console.log('Neologicon prêt');

document.addEventListener("DOMContentLoaded", () => {
  // Fonction utilitaire pour charger un fragment HTML
  function loadFragment(id, path, callback) {
    const container = document.getElementById(id);
    if (container) {
      fetch(path)
        .then(res => {
          if (!res.ok) throw new Error(`Impossible de charger ${path}`);
          return res.text();
        })
        .then(html => {
          container.innerHTML = html;
          if (callback) callback();
        })
        .catch(err => console.error(err));
    }
  }

  // Détection du niveau de profondeur (sert à calculer les chemins relatifs)
  const path = window.location.pathname;
  const inPages = path.includes("/pages/");
  const depth = (path.match(/\//g) || []).length;
  const base = depth >= 3 ? "../../" : inPages ? "../" : "";

  // Chemins vers les fragments
  const headerPath = base + "partials/header.html";
  const footerPath = base + "partials/footer.html";
  const animaginauxPath = base + "partials/animaginaux-nav.html";
  const glossairePath = base + "partials/glossaire-nav.html";

  // Table de routage (cas particuliers)
  const routes = {
    index: "index.html",
    animaginaux: "pages/animaginaux/animaginaux.html",
    glossaire: "pages/glossaire/glossaire.html",
    legendes: "pages/legendes/legendes.html" // ← facile d’en ajouter d’autres
  };

  // Fonction utilitaire pour mettre à jour les liens d’un conteneur
  function updateLinks(containerSelector) {
    document.querySelectorAll(`${containerSelector} a[data-link]`).forEach(a => {
      const target = a.getAttribute("data-link");
      if (routes[target]) {
        a.href = base + routes[target];
      } else {
        a.href = base + `pages/${target}.html`;
      }
    });
  }

  // --- Charger le header ---
  loadFragment("header", headerPath, () => {
    updateLinks("nav");

    // Ré-attacher le menu hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }
  });

  // --- Charger le footer ---
  loadFragment("footer", footerPath, () => {
    updateLinks("footer");
  });

  // --- Charger la bannière Animaginaux ---
  loadFragment("animaginaux-nav", animaginauxPath);

  // --- Charger les bannières Glossaire haut et bas ---
  loadFragment("glossaire-nav-top", glossairePath);
  loadFragment("glossaire-nav-bottom", glossairePath);

  // --- Logs debug ---
  if (path.endsWith("index.html") || path.endsWith("/")) {
    console.log("Bienvenue sur la page d’accueil !");
  } else if (path.includes("animaginaux")) {
    console.log("Page Animaginaux détectée");
  } else if (path.includes("glossaire")) {
    console.log("Page Glossaire détectée");
  } else if (path.includes("legendes")) {
    console.log("Page Légendes détectée");
  }
});
