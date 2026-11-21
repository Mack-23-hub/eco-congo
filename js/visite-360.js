const espaces = [
  { nom: "Cour",             vers: "la cour",             lieu: "ECAM · Entrée",              image: "" },
  { nom: "Salle de classe",  vers: "la salle de classe",  lieu: "ECAM · Bâtiment principal",  image: "" },
  { nom: "Bibliothèque",     vers: "la bibliothèque",     lieu: "ECAM · Bâtiment principal",  image: "" },
  { nom: "Laboratoire",      vers: "le laboratoire",      lieu: "ECAM · Bâtiment sciences",   image: "" },
  { nom: "Salle informatique", vers: "la salle informatique", lieu: "ECAM · Bâtiment sciences", image: "" },
];

let indice = 1;

const scene        = document.getElementById("scene");
const titre        = document.getElementById("espace-titre");
const compteur     = document.getElementById("espace-compteur");
const lieu         = document.getElementById("espace-lieu");
const boutonPrec   = document.getElementById("btn-prec");
const boutonSuiv   = document.getElementById("btn-suiv");
const nomPrec      = document.getElementById("nom-prec");
const nomSuiv      = document.getElementById("nom-suiv");
const pointCentral = document.getElementById("point-central");
const pointFleche  = document.getElementById("point-fleche");
const pointEtiquette = document.getElementById("point-etiquette");
const boutonPlan   = document.getElementById("btn-plan");
const plan         = document.getElementById("plan");
const boutonPlein  = document.getElementById("btn-plein-ecran");
const boutonVR     = document.getElementById("btn-vr");
const message      = document.getElementById("message");

function afficherEspace() {
  const espace = espaces[indice];
  const total = espaces.length;

  titre.textContent = espace.nom;
  lieu.textContent = espace.lieu;
  compteur.textContent = `ESPACE ${String(indice + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  document.title = `${espace.nom} · Visite immersive · ECAM`;

  scene.style.backgroundImage = espace.image
    ? `url("${espace.image}")`
    : "";

  const aPrec = indice > 0;
  const aSuiv = indice < total - 1;
  boutonPrec.disabled = !aPrec;
  boutonSuiv.disabled = !aSuiv;
  if (aPrec) nomPrec.textContent = espaces[indice - 1].nom;
  if (aSuiv) nomSuiv.textContent = espaces[indice + 1].nom;

  pointCentral.hidden = !aSuiv;
  if (aSuiv) pointEtiquette.textContent = "Vers " + espaces[indice + 1].vers;

  decalage = 0;
  scene.style.backgroundPositionX = "0px";
  afficherPlan();
}

function aller(nouvelIndice) {
  if (nouvelIndice < 0 || nouvelIndice >= espaces.length) return;
  indice = nouvelIndice;
  afficherEspace();
}

boutonPrec.addEventListener("click", () => aller(indice - 1));
boutonSuiv.addEventListener("click", () => aller(indice + 1));
pointFleche.addEventListener("click", () => aller(indice + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  aller(indice - 1);
  if (e.key === "ArrowRight") aller(indice + 1);
});

let decalage = 0;
let departX = null;

scene.addEventListener("pointerdown", (e) => {
  departX = e.clientX - decalage;
  scene.classList.add("glisse");
  scene.setPointerCapture(e.pointerId);
});
scene.addEventListener("pointermove", (e) => {
  if (departX === null) return;
  decalage = e.clientX - departX;
  scene.style.backgroundPositionX = decalage + "px";
});
function finGlisse() {
  departX = null;
  scene.classList.remove("glisse");
}
scene.addEventListener("pointerup", finGlisse);
scene.addEventListener("pointercancel", finGlisse);

function afficherPlan() {
  plan.innerHTML = "";
  espaces.forEach((espace, i) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = `${i + 1}. ${espace.nom}`;
    if (i === indice) bouton.setAttribute("aria-current", "true");
    bouton.addEventListener("click", () => { aller(i); });
    plan.appendChild(bouton);
  });
}
boutonPlan.addEventListener("click", () => {
  plan.hidden = !plan.hidden;
  boutonPlan.setAttribute("aria-expanded", String(!plan.hidden));
});

boutonPlein.addEventListener("click", () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
});

let minuteur;
function dire(texte) {
  message.textContent = texte;
  message.hidden = false;
  clearTimeout(minuteur);
  minuteur = setTimeout(() => (message.hidden = true), 4000);
}

boutonVR.addEventListener("click", async () => {
  if (!("xr" in navigator)) {
    dire("Ton navigateur ne gère pas la réalité virtuelle (WebXR).");
    return;
  }
  try {
    const compatible = await navigator.xr.isSessionSupported("immersive-vr");
    dire(compatible
      ? "Casque détecté. La session VR sera ajoutée à l'étape suivante du projet."
      : "Aucun casque VR détecté sur cet appareil.");
  } catch (erreur) {
    dire("Impossible de vérifier le casque VR.");
  }
});

afficherEspace();
