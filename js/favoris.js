const CLE_FAVORIS = "ecocongo-favoris";
const FAVORIS_PAR_DEFAUT = ["ecam", "college-horizon"];

const zoneFavoris = document.getElementById("fav-liste");
const compteurFavoris = document.getElementById("nb-favoris");
const compteurVisites = document.getElementById("nb-visites");
const listeHisto = document.getElementById("histo");
const messageHisto = document.getElementById("histo-vide");
const boutonEffacer = document.getElementById("effacer-histo");

const ICONE_VR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.2 2l-1.3-1.5h-7L7.2 16A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="11" r=".7"/><circle cx="18" cy="13" r=".7"/></svg>`;
const ICONE_COEUR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;

let ecoles = [];

function lireFavoris() {
  try {
    const brut = localStorage.getItem(CLE_FAVORIS);
    return brut === null ? [...FAVORIS_PAR_DEFAUT] : JSON.parse(brut) || [];
  } catch (erreur) {
    return [...FAVORIS_PAR_DEFAUT];
  }
}
function sauverFavoris(liste) {
  try { localStorage.setItem(CLE_FAVORIS, JSON.stringify(liste)); }
  catch (erreur) {  }
}

function afficherFavoris() {
  const ids = lireFavoris();
  const aAfficher = ids.map((id) => ecoles.find((e) => e.id === id)).filter(Boolean);

  compteurFavoris.textContent = aAfficher.length;
  zoneFavoris.innerHTML = "";

  if (aAfficher.length === 0) {
    zoneFavoris.innerHTML = `<div class="vide-favoris"><p>Tu n’as pas encore d’école favorite.</p>
      <a class="btn btn-noir" href="resultats.html">Découvrir les écoles</a></div>`;
    return;
  }

  aAfficher.forEach((ecole) => {
    const carte = document.createElement("article");
    carte.className = "fav-carte";
    carte.innerHTML = `
      <div class="photo" role="img" aria-label="Photo de ${ecole.nom}"></div>
      <div class="fav-ligne">
        <h3>${ecole.nom}</h3>
        <button class="fav-coeur" type="button" data-id="${ecole.id}" aria-label="Retirer ${ecole.nom} des favoris">${ICONE_COEUR}</button>
      </div>
      <p class="fav-meta">${ecole.ville}${ecole.vr ? " · Visite VR disponible" : ""}</p>
      <div class="fav-actions">
        <a class="btn btn-simple" href="fiche-ecole.html?id=${ecole.id}">Voir la fiche</a>
        <a class="btn btn-noir" href="preparer-visite.html?id=${ecole.id}">${ICONE_VR} Visiter en VR</a>
      </div>`;
    zoneFavoris.appendChild(carte);
  });
}

zoneFavoris.addEventListener("click", (e) => {
  const coeur = e.target.closest(".fav-coeur");
  if (!coeur) return;
  sauverFavoris(lireFavoris().filter((id) => id !== coeur.dataset.id));
  afficherFavoris();
});

function mettreAJourHistorique() {
  const nb = listeHisto.children.length;
  compteurVisites.textContent = nb;
  messageHisto.hidden = nb !== 0;
  boutonEffacer.hidden = nb === 0;
}
boutonEffacer.addEventListener("click", () => {
  if (confirm("Effacer tout l’historique des visites ?")) {
    listeHisto.innerHTML = "";
    mettreAJourHistorique();
  }
});

mettreAJourHistorique();
fetch("../data/ecoles.json")
  .then((reponse) => reponse.json())
  .then((donnees) => { ecoles = donnees; afficherFavoris(); })
  .catch(() => { zoneFavoris.innerHTML = "<p>Impossible de charger les écoles. Ouvre la page avec Live Server.</p>"; });
