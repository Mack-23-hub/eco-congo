const ID_ECOLE = "ecam";
const CLE_FAVORIS = "ecocongo-favoris";

function lireFavoris() {
  try { return JSON.parse(localStorage.getItem(CLE_FAVORIS)) || []; }
  catch (erreur) { return []; }
}
function sauverFavoris(liste) {
  try { localStorage.setItem(CLE_FAVORIS, JSON.stringify(liste)); }
  catch (erreur) {  }
}

const boutonFavori = document.getElementById("btn-favori");
const texteFavori = document.getElementById("btn-favori-texte");

function mettreAJourBouton() {
  const estFavori = lireFavoris().includes(ID_ECOLE);
  boutonFavori.setAttribute("aria-pressed", String(estFavori));
  texteFavori.textContent = estFavori ? "Dans mes favoris" : "Ajouter aux favoris";
}
boutonFavori.addEventListener("click", () => {
  let favoris = lireFavoris();
  favoris = favoris.includes(ID_ECOLE) ? favoris.filter((f) => f !== ID_ECOLE) : [...favoris, ID_ECOLE];
  sauverFavoris(favoris);
  mettreAJourBouton();
});
mettreAJourBouton();

const onglets = document.querySelectorAll("#onglets a");
onglets.forEach((onglet) => {
  onglet.addEventListener("click", () => {
    onglets.forEach((o) => o.classList.toggle("actif", o === onglet));
  });
});
