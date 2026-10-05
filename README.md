# AVEC VINCENT V4

Site vitrine pour les cours particuliers du lycée à la prépa, à domicile à Lyon et en visioconférence.

## Formulaire de contact

La page `reserver.html` transmet les demandes à l’application Web Google Apps Script configurée dans `script.js`. Le script reçoit la demande sur `contact@avecvincent.fr`, puis prépare un brouillon de réponse chaleureux dans Gmail à partir du message reçu.

Le déploiement public doit rester configuré avec « Exécuter en tant que moi » et « Tout le monde ». Le code source et la procédure sont dans [`apps-script/`](apps-script/). Une demande réelle n’a pas été envoyée pendant la vérification afin de ne pas créer de faux contact ; l’URL `doGet` a bien répondu après le déploiement.

## TVA et facturation

Le site présente les montants comme des prix totaux affichés et laisse la facture porter la mention du régime de TVA applicable. Le dossier [`factures/`](factures/) contient un modèle HTML imprimable, prérempli avec les informations connues d’AVEC VINCENT, ainsi qu’un registre CSV vierge. Faites une copie privée du modèle avant d’y saisir des données client et sélectionnez le régime de TVA réellement applicable.

Les informations personnelles, les numéros de facture complétés et les factures clients ne doivent pas être ajoutés à ce dépôt public.

