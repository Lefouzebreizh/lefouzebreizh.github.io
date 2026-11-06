# Boutique numerique — Souffler sur les Breizh

Projet statique et serverless destiné au projet Vercel project-ait8y. Le paiement passe par Stripe Checkout; la route de téléchargement vérifie le statut payé et les articles de la session avant de lire une archive depuis un stockage Blob privé.

## Vercel

Relier le projet à ce dépôt, choisir la branche musique-vercel et définir le répertoire racine boutique. Le site utilise les fonctions Node intégrées du dossier api/ et les pages HTML de ce dossier.

## Variables d’environnement nécessaires

- STRIPE_SECRET_KEY: clé secrète Stripe de test (préfixe sk_test_ pour cette configuration).
- PRICE_ALBUM_ID: identifiant du tarif de l’album seul en mode test.
- PRICE_EDITION_ID: identifiant du tarif album + livret en mode test.
- PUBLIC_SITE_URL: URL Vercel de ce projet.
- BLOB_READ_WRITE_TOKEN: jeton d’un store Vercel Blob privé.
- ALBUM_BLOB_URL: URL privée de l’archive album seul.
- EDITION_BLOB_URL: URL privée de l’archive album + livret.

Les identifiants de prix ne sont pas stockés dans le code. N’inscris jamais une clé secrète dans GitHub ou dans une conversation. Configure-la dans les variables d’environnement du projet Vercel.

## Fichiers numériques attendus

- Album seul : 13 fichiers audio, sans livret.
- Édition avec livret : les mêmes 13 fichiers audio et le PDF du livret.

Les deux URL d’archives doivent pointer vers le stockage privé. Les liens publics directs ne doivent pas être utilisés pour les fichiers payants.

## État

La boutique est une base de préparation. La configuration des secrets Stripe, du store privé et des fichiers doit être terminée avant toute vente réelle. Les offres Stripe actuellement préparées sont en mode test.
