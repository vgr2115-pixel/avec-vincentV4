# Réception du formulaire AVEC VINCENT

Le fichier `Code.gs` reçoit le formulaire public et envoie une seule demande à `contact@avecvincent.fr`. Il ne crée aucun brouillon et n’envoie aucun message automatique au demandeur.

La réception effective dans la boîte `contact@avecvincent.fr` dépend de la configuration de cette adresse chez l’hébergeur de messagerie : la boîte doit exister, ou l’adresse doit être configurée comme alias/redirection fonctionnelle. Apps Script peut envoyer le message vers cette adresse, mais ne peut pas créer ni administrer une boîte externe. En cas d’absence de message, vérifier aussi le dossier indésirables et les enregistrements MX du domaine.

Le formulaire utilise désormais un seul champ « Nom et prénom ». Le champ `student` reste accepté par le script uniquement pour assurer la compatibilité avec d’anciennes versions du formulaire.

## Déploiement

1. Ouvrir le projet Apps Script associé au site.
2. Remplacer le contenu de Code.gs par le fichier fourni ici.
3. Enregistrer, puis créer un déploiement de type **Application Web**.
4. Choisir **Exécuter l'application en tant que moi-même** et **Toute personne** comme accès.
5. Renseigner l'URL /exec du déploiement dans FORM_ENDPOINT de script.js.
6. Tester avec une demande fictive avant la mise en ligne et vérifier la boîte `contact@avecvincent.fr`.

Le script utilise Gmail du compte qui déploie l'application pour envoyer le message. Il ne contient aucun mot de passe ni clé secrète.
