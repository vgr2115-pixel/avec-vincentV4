/* AVEC VINCENT — configuration publique unique.
   Pour changer vos coordonnées, modifier uniquement ces valeurs.
   SIREN, SIRET et numéro SAP se complètent dans legal.html. */
const CONFIG = Object.freeze({
  email: "contact@avecvincent.fr",
  phone: "06 03 87 22 63",
  phoneLink: "+33603872263"
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector("#site-menu");
  const toggle = document.querySelector(".menu-button");
  const closeMenu = () => {
    menu?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Ouvrir le menu");
  };
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, {passive:true});
  toggle?.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Fermer le menu" : "Ouvrir le menu");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("open")) {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (menu?.classList.contains("open") && !header.contains(event.target)) closeMenu();
  });
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  const desktop = window.matchMedia("(min-width:781px)");
  desktop.addEventListener("change", closeMenu);
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll("[data-contact]").forEach(el => {
    const email = el.dataset.contact === "email";
    el.textContent = email ? CONFIG.email : CONFIG.phone;
    el.href = email ? "mailto:" + CONFIG.email : "tel:" + CONFIG.phoneLink;
  });

  const form = document.querySelector("#formulaire");
  if (!form) return;
  const subject = form.elements.namedItem("subject");
  const params = new URLSearchParams(window.location.search);
  const aliases = {
    "Géopolitique & HGGSP": "Géopolitique / HGGSP",
    "BAC · BCE · ECRICOME": "BCE / ECRICOME"
  };
  const requested = params.get("demande") === "specifique"
    ? "Autre / demande spécifique"
    : (aliases[params.get("matiere")] || params.get("matiere"));
  if (requested && Array.from(subject.options).some(option => option.value === requested)) subject.value = requested;
  const status = form.querySelector(".form-status");
  const draft = document.querySelector("#email-draft");
  const compose = () => {
    const data = new FormData(form);
    const labels = [["name","Votre nom"],["student","Prénom de l’élève"],["email","E-mail"],["phone","Téléphone"],["level","Niveau"],["subject","Matière ou besoin"],["format","Format"],["objective","Objectif ou difficultés"]];
    return labels.map(([key,label]) => label + " : " + (String(data.get(key) || "").trim() || "Non précisé")).join("\n");
  };
  document.querySelector("#prepare-copy")?.addEventListener("click", () => {
    draft.value = compose(); draft.hidden = false; draft.focus(); draft.select();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const body = compose();
    draft.value = body;
    const title = "Demande de cours — " + subject.value;
    status.textContent = "Le message est préparé. Vérifiez-le dans votre messagerie, puis envoyez-le. Rien n’est envoyé automatiquement.";
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
  });
});
