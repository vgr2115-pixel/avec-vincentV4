# Réception du formulaire AVEC VINCENT

Le fichier Code.gs reçoit le formulaire public, envoie la demande à contact@avecvincent.fr et prépare une réponse chaleureuse dans Gmail. Le formulaire ne dépend pas d’un champ invisible anti-spam : cela évite que l’autocomplétion d’un navigateur bloque par erreur une demande légitime.

## Déploiement

1. Ouvrir le projet Apps Script associé au site.
2. Remplacer le contenu de Code.gs par le fichier fourni ici.
3. Enregistrer, puis créer un déploiement de type **Application Web**.
4. Choisir **Exécuter l'application en tant que moi-même** et **Toute personne** comme accès.
5. Renseigner l'URL /exec du déploiement dans FORM_ENDPOINT de script.js.
6. Tester avec une demande fictive avant la mise en ligne.

Le script utilise Gmail du compte qui déploie l'application. Il ne contient aucun mot de passe ni clé secrète.
