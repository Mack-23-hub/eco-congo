const CLE_FAVORIS = "ecocongo-favoris";

function lireFavoris() {
  try { return JSON.parse(localStorage.getItem(CLE_FAVORIS)) || []; }
  catch (erreur) { return []; }
}
function sauverFavoris(liste) {
  try { localStorage.setItem(CLE_FAVORIS, JSON.stringify(liste)); }
  catch (erreur) {  }
}

const coeurs = document.querySelectorAll(".carte-favori");

const favorisActuels = lireFavoris();
coeurs.forEach((coeur) => {
  coeur.setAttribute("aria-pressed", String(favorisActuels.includes(coeur.dataset.id)));
});

coeurs.forEach((coeur) => {
  coeur.addEventListener("click", () => {
    const id = coeur.dataset.id;
    let favoris = lireFavoris();
    favoris = favoris.includes(id) ? favoris.filter((f) => f !== id) : [...favoris, id];
    sauverFavoris(favoris);
    coeur.setAttribute("aria-pressed", String(favoris.includes(id)));
  });
});
