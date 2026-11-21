const formRecherche = document.getElementById("form-recherche");
const champTexte    = document.getElementById("champ-texte");
const selectVille   = document.getElementById("filtre-ville");
const selectFiliere = document.getElementById("filtre-filiere");
const casePublic    = document.getElementById("type-public");
const casePrive     = document.getElementById("type-prive");
const caseVR        = document.getElementById("filtre-vr");
const selectTri     = document.getElementById("tri");

const compteur   = document.getElementById("compteur");
const nbFiltres  = document.getElementById("nb-filtres");
const zoneChips  = document.getElementById("chips");
const zoneListe  = document.getElementById("liste-ecoles");
const zoneVide   = document.getElementById("vide");
const compteBas  = document.getElementById("compte-bas");

const tiroir       = document.getElementById("filtres");
const voile        = document.getElementById("voile");
const boutonOuvrir = document.getElementById("ouvrir-filtres");
const boutonFermer = document.getElementById("fermer-tiroir");
const boutonValider = document.getElementById("valider-filtres");

let ecoles = [];

const ICONE_VR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.2 2l-1.3-1.5h-7L7.2 16A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="11" r=".7"/><circle cx="18" cy="13" r=".7"/></svg>`;
const ICONE_COEUR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;

function lireFavoris() {
  try { return JSON.parse(localStorage.getItem("ecocongo-favoris")) || []; }
  catch (erreur) { return []; }
}
function sauverFavoris(liste) {
  try { localStorage.setItem("ecocongo-favoris", JSON.stringify(liste)); }
  catch (erreur) {  }
}

function normaliser(texte) {
  return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function remplirListes() {
  const villes = [...new Set(ecoles.map((e) => e.ville))].sort();
  const filieres = [...new Set(ecoles.flatMap((e) => e.filieres))].sort();
  villes.forEach((v) => selectVille.add(new Option(v, v)));
  filieres.forEach((f) => selectFiliere.add(new Option(f, f)));
}

function filtrer() {
  const mots = normaliser(champTexte.value.trim()).split(/\s+/).filter((m) => m.length > 2);

  let type = "";
  if (casePublic.checked && !casePrive.checked) type = "Public";
  if (casePrive.checked && !casePublic.checked) type = "Privé";

  let resultat = ecoles.filter((e) => {
    const texteEcole = normaliser([e.nom, e.ville, e.type, ...e.filieres].join(" "));
    const tousLesMotsTrouves = mots.every((m) => texteEcole.includes(m));
    return (
      tousLesMotsTrouves &&
      (!selectVille.value || e.ville === selectVille.value) &&
      (!selectFiliere.value || e.filieres.includes(selectFiliere.value)) &&
      (!type || e.type === type) &&
      (!caseVR.checked || e.vr)
    );
  });

  if (selectTri.value === "nom") {
    resultat = [...resultat].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  }
  return resultat;
}

function listerPuces() {
  const puces = [];
  if (selectVille.value)   puces.push({ texte: selectVille.value,   retirer: () => (selectVille.value = "") });
  if (selectFiliere.value) puces.push({ texte: selectFiliere.value, retirer: () => (selectFiliere.value = "") });
  if (casePublic.checked)  puces.push({ texte: "Public",            retirer: () => (casePublic.checked = false) });
  if (casePrive.checked)   puces.push({ texte: "Privé",             retirer: () => (casePrive.checked = false) });
  if (caseVR.checked)      puces.push({ texte: "Visite VR",         retirer: () => (caseVR.checked = false) });
  return puces;
}

function afficherPuces(puces) {
  zoneChips.innerHTML = "";
  puces.forEach((puce) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "chip";
    bouton.textContent = puce.texte + " ×";
    bouton.setAttribute("aria-label", "Retirer le filtre " + puce.texte);
    bouton.addEventListener("click", () => { puce.retirer(); afficher(); });
    zoneChips.appendChild(bouton);
  });
}

function creerCarte(ecole, favoris) {
  const estFavori = favoris.includes(ecole.id);
  const article = document.createElement("article");
  article.className = "carte-ecole";
  article.innerHTML = `
    <div class="photo" role="img" aria-label="Photo de ${ecole.nom}"></div>
    <div class="carte-contenu">
      <h3>${ecole.nom}</h3>
      <button class="carte-favori" type="button" data-id="${ecole.id}"
              aria-pressed="${estFavori}" aria-label="Ajouter ${ecole.nom} aux favoris">${ICONE_COEUR}</button>
      <p class="carte-meta">${ecole.ville} · ${ecole.type}</p>
      <p class="carte-filieres">${ecole.filieres.join(" · ")}</p>
      ${ecole.vr ? `<span class="badge-vr">${ICONE_VR} Visite VR disponible</span>` : ""}
      <div class="carte-actions">
        <a class="btn btn-simple" href="fiche-ecole.html?id=${ecole.id}">Voir la fiche</a>
        ${ecole.vr
          ? `<a class="btn btn-noir" href="preparer-visite.html?id=${ecole.id}">${ICONE_VR} Visiter en VR</a>`
          : `<span class="btn btn-contour" aria-disabled="true">Pas de visite VR</span>`}
      </div>
    </div>`;
  return article;
}

function afficher() {
  const resultat = filtrer();
  const puces = listerPuces();
  const favoris = lireFavoris();
  const n = resultat.length;

  compteur.textContent = n === 0 ? "0 résultat" : `${n} école${n > 1 ? "s" : ""} à découvrir`;
  nbFiltres.textContent = puces.length ? `Filtres · ${puces.length}` : "Filtres";
  boutonValider.textContent = n === 0 ? "Aucune école" : `Afficher les ${n} école${n > 1 ? "s" : ""}`;
  compteBas.textContent = n === 0 ? "" : `${n} école${n > 1 ? "s" : ""} affichée${n > 1 ? "s" : ""} sur ${ecoles.length}`;

  afficherPuces(puces);

  zoneListe.innerHTML = "";
  resultat.forEach((ecole) => zoneListe.appendChild(creerCarte(ecole, favoris)));
  zoneVide.hidden = n !== 0;
}

function toutReinitialiser(viderTexte) {
  selectVille.value = "";
  selectFiliere.value = "";
  casePublic.checked = false;
  casePrive.checked = false;
  caseVR.checked = false;
  if (viderTexte) champTexte.value = "";
  afficher();
}

function ouvrirTiroir() {
  tiroir.classList.add("ouvert");
  voile.classList.add("ouvert");
}
function fermerTiroir() {
  tiroir.classList.remove("ouvert");
  voile.classList.remove("ouvert");
}

formRecherche.addEventListener("submit", (e) => { e.preventDefault(); afficher(); });
champTexte.addEventListener("input", afficher);
[selectVille, selectFiliere, casePublic, casePrive, caseVR, selectTri].forEach((el) =>
  el.addEventListener("change", afficher)
);

document.getElementById("reinit-filtres").addEventListener("click", () => toutReinitialiser(false));
document.getElementById("vide-reinit").addEventListener("click", () => toutReinitialiser(false));
document.getElementById("vide-toutes").addEventListener("click", () => toutReinitialiser(true));

boutonOuvrir.addEventListener("click", ouvrirTiroir);
boutonFermer.addEventListener("click", fermerTiroir);
boutonValider.addEventListener("click", fermerTiroir);
voile.addEventListener("click", fermerTiroir);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fermerTiroir(); });

zoneListe.addEventListener("click", (e) => {
  const coeur = e.target.closest(".carte-favori");
  if (!coeur) return;
  const id = coeur.dataset.id;
  let favoris = lireFavoris();
  favoris = favoris.includes(id) ? favoris.filter((f) => f !== id) : [...favoris, id];
  sauverFavoris(favoris);
  coeur.setAttribute("aria-pressed", String(favoris.includes(id)));
});

fetch("../data/ecoles.json")
  .then((reponse) => reponse.json())
  .then((donnees) => {
    ecoles = donnees;
    remplirListes();

    const params = new URLSearchParams(window.location.search);
    const vientDeLAccueil = ["q", "ville", "filiere", "type", "vr"].some((cle) => params.has(cle));

    if (vientDeLAccueil) {
      champTexte.value = params.get("q") || "";
      selectVille.value = params.get("ville") || "";
      selectFiliere.value = params.get("filiere") || "";
      casePublic.checked = params.get("type") === "Public";
      casePrive.checked = params.get("type") === "Privé";
      caseVR.checked = params.get("vr") === "1";
    } else {
      selectVille.value = "Kinshasa";
    }
    afficher();
  })
  .catch(() => {
    zoneListe.innerHTML = "<p>Impossible de charger les écoles. Ouvre la page avec Live Server.</p>";
  });
