const form = document.getElementById("form-ecole");
const message = document.getElementById("message-form");
const succes = document.getElementById("succes");

function erreur(texte) {
  message.textContent = texte;
  message.className = "message-form erreur";
  message.hidden = false;
}
function info(texte) {
  message.textContent = texte;
  message.className = "message-form";
  message.hidden = false;
}

const detailsFilieres = document.getElementById("multi-filieres");
const texteFilieres = document.getElementById("multi-texte");
const casesFilieres = detailsFilieres.querySelectorAll("input[type=checkbox]");

function filieresChoisies() {
  return [...casesFilieres].filter((c) => c.checked).map((c) => c.value);
}
function mettreAJourFilieres() {
  const choix = filieresChoisies();
  texteFilieres.textContent = choix.length ? choix.join(", ") : "Sélectionner une ou plusieurs filières";
  texteFilieres.classList.toggle("choisi", choix.length > 0);
}
casesFilieres.forEach((c) => c.addEventListener("change", mettreAJourFilieres));

const depot = document.getElementById("depot");
const champFichiers = document.getElementById("fichiers");
const listeFichiers = document.getElementById("liste-fichiers");
const TAILLE_MAX = 20 * 1024 * 1024;
let photos = [];

function afficherFichiers(refus) {
  listeFichiers.innerHTML = "";
  photos.forEach((fichier) => {
    const li = document.createElement("li");
    li.innerHTML = `<span></span><span>${(fichier.size / 1048576).toFixed(1)} Mo</span>`;
    li.firstChild.textContent = fichier.name;
    listeFichiers.appendChild(li);
  });
  refus.forEach((texte) => {
    const li = document.createElement("li");
    li.className = "erreur";
    li.textContent = texte;
    listeFichiers.appendChild(li);
  });
}

function ajouterFichiers(liste) {
  const refus = [];
  [...liste].forEach((fichier) => {
    if (!["image/jpeg", "image/png"].includes(fichier.type)) refus.push(`${fichier.name} : format non accepté (JPG ou PNG).`);
    else if (fichier.size > TAILLE_MAX) refus.push(`${fichier.name} : plus de 20 Mo.`);
    else photos.push(fichier);
  });
  afficherFichiers(refus);
}

document.getElementById("btn-fichiers").addEventListener("click", () => champFichiers.click());
champFichiers.addEventListener("change", () => { ajouterFichiers(champFichiers.files); champFichiers.value = ""; });

["dragenter", "dragover"].forEach((nom) =>
  depot.addEventListener(nom, (e) => { e.preventDefault(); depot.classList.add("survol"); })
);
["dragleave", "drop"].forEach((nom) =>
  depot.addEventListener(nom, (e) => { e.preventDefault(); depot.classList.remove("survol"); })
);
depot.addEventListener("drop", (e) => ajouterFichiers(e.dataTransfer.files));

const CLE_BROUILLON = "ecocongo-brouillon-ecole";
const champsBrouillon = ["nom-ecole", "ville", "type", "adresse", "presentation", "responsable", "email", "tel"];

function enregistrerBrouillon() {
  const donnees = { filieres: filieresChoisies() };
  champsBrouillon.forEach((id) => (donnees[id] = document.getElementById(id).value));
  try {
    localStorage.setItem(CLE_BROUILLON, JSON.stringify(donnees));
    info("Brouillon enregistré sur cet appareil. Les photos ne sont pas gardées : ajoute-les avant l’envoi.");
  } catch (e) {
    erreur("Impossible d’enregistrer le brouillon sur cet appareil.");
  }
}
function chargerBrouillon() {
  try {
    const donnees = JSON.parse(localStorage.getItem(CLE_BROUILLON));
    if (!donnees) return;
    champsBrouillon.forEach((id) => { if (donnees[id]) document.getElementById(id).value = donnees[id]; });
    casesFilieres.forEach((c) => (c.checked = (donnees.filieres || []).includes(c.value)));
    mettreAJourFilieres();
  } catch (e) {}
}
document.getElementById("btn-brouillon").addEventListener("click", enregistrerBrouillon);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  message.hidden = true;

  const obligatoires = [
    ["nom-ecole", "le nom de l’école"], ["ville", "la ville"], ["type", "le type d’établissement"],
    ["adresse", "l’adresse"], ["responsable", "le nom du responsable"], ["email", "l’adresse e-mail"], ["tel", "le téléphone"],
  ];
  for (const [id, libelle] of obligatoires) {
    const champ = document.getElementById(id);
    if (!champ.value.trim()) { champ.focus(); return erreur(`Indique ${libelle}.`); }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("email").value.trim())) {
    document.getElementById("email").focus();
    return erreur("Écris une adresse e-mail valide.");
  }
  if (filieresChoisies().length === 0) {
    detailsFilieres.open = true;
    return erreur("Choisis au moins une filière.");
  }
  if (!document.getElementById("autorisation").checked) {
    return erreur("Confirme que tu es autorisé à représenter l’établissement.");
  }

  try { localStorage.removeItem(CLE_BROUILLON); } catch (e2) {  }
  form.hidden = true;
  succes.hidden = false;
  succes.scrollIntoView({ behavior: "smooth", block: "center" });
});

chargerBrouillon();
