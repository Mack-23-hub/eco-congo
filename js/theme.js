(function () {
  var CLE = "ecocongo-theme";
  var racine = document.documentElement;

  function lireChoix() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }
  function appareilEnSombre() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function appliquer(theme) {
    racine.setAttribute("data-theme", theme);
  }

  var choix = lireChoix();
  appliquer(choix === "dark" || choix === "light" ? choix : (appareilEnSombre() ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", function () {
    var bouton = document.getElementById("theme-btn");
    if (!bouton) return;

    function majBouton() {
      var sombre = racine.getAttribute("data-theme") === "dark";
      bouton.setAttribute("aria-pressed", String(sombre));
      bouton.setAttribute("aria-label", sombre ? "Passer en mode clair" : "Passer en mode sombre");
    }
    majBouton();

    bouton.addEventListener("click", function () {
      var suivant = racine.getAttribute("data-theme") === "dark" ? "light" : "dark";
      appliquer(suivant);
      try { localStorage.setItem(CLE, suivant); } catch (e) {}
      majBouton();
    });

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!lireChoix()) { appliquer(e.matches ? "dark" : "light"); majBouton(); }
      });
    }
  });
})();
