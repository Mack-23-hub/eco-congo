const message = document.getElementById("message-form");

function afficherMessage(texte, estErreur) {
  message.textContent = texte;
  message.classList.toggle("erreur", estErreur);
  message.hidden = false;
}

document.querySelectorAll(".mdp-oeil").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const champ = bouton.parentElement.querySelector("input");
    const visible = champ.type === "password";
    champ.type = visible ? "text" : "password";
    bouton.setAttribute("aria-pressed", String(visible));
    bouton.setAttribute("aria-label", visible ? "Cacher le mot de passe" : "Afficher le mot de passe");
  });
});

document.querySelectorAll("[data-bientot]").forEach((lien) => {
  lien.addEventListener("click", (e) => {
    e.preventDefault();
    afficherMessage("Cette fonction arrivera bientôt.", false);
  });
});

const boutonsProfil = document.querySelectorAll("[data-profil]");
boutonsProfil.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsProfil.forEach((b) => b.setAttribute("aria-pressed", String(b === bouton)));
  });
});

const emailValide = (texte) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texte);

const formConnexion = document.getElementById("form-connexion");
if (formConnexion) {
  if (new URLSearchParams(window.location.search).get("inscrit") === "1") {
    afficherMessage("Compte créé. Tu peux maintenant te connecter.", false);
  }

  formConnexion.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = formConnexion.email.value.trim();
    const mdp = formConnexion.mdp.value;
    if (!emailValide(email)) return afficherMessage("Écris une adresse e-mail valide.", true);
    if (mdp.length === 0) return afficherMessage("Écris ton mot de passe.", true);
    window.location.href = "../index.html";
  });
}

const formInscription = document.getElementById("form-inscription");
if (formInscription) {
  formInscription.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = formInscription;
    if (!f.prenom.value.trim() || !f.nom.value.trim()) return afficherMessage("Écris ton prénom et ton nom.", true);
    if (!emailValide(f.email.value.trim())) return afficherMessage("Écris une adresse e-mail valide.", true);
    if (!/^(?=.*\d).{8,}$/.test(f.mdp.value)) return afficherMessage("Le mot de passe doit avoir au moins 8 caractères, dont un chiffre.", true);
    if (!f.conditions.checked) return afficherMessage("Accepte les conditions pour continuer.", true);
    window.location.href = "connexion.html?inscrit=1";
  });
}
