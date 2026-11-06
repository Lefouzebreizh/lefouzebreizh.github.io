# Boutique numerique — Souffler sur les Breizh

Projet statique et serverless pour le projet Vercel `project-ait8y`. Le paiement passe par Stripe Checkout. Après vérification du paiement, la route de téléchargement lit l’archive correspondante depuis un Blob Vercel privé.

## Configuration Vercel

Le projet utilise la branche `musique-vercel` et le répertoire racine `boutique`.

Variables nécessaires en Production :

- `STRIPE_SECRET_KEY` : clé secrète Stripe de production (`sk_live_…`). Ne jamais la stocker dans GitHub ni l’envoyer dans une conversation.
- `PRICE_ALBUM_ID` : tarif Stripe en production pour l’album seul.
- `PRICE_EDITION_ID` : tarif Stripe en production pour l’album avec livret.
- `PUBLIC_SITE_URL` : URL de production Vercel.
- `BLOB_STORE_ID` : ajouté par Vercel lorsque le Blob privé est relié au projet.
- `ALBUM_BLOB_URL` : URL privée de l’archive album seul.
- `EDITION_BLOB_URL` : URL privée de l’archive album + livret.

Le téléchargement privé utilise `@vercel/blob` et l’authentification OIDC du projet. Ne pas ajouter les archives comme fichiers publics.

## Fichiers à déposer dans le Blob privé

- Album seul : les 13 fichiers audio, sans livret.
- Édition avec livret : les mêmes 13 fichiers audio et le PDF du livret.

## État

Les produits et tarifs Stripe de production sont créés et les variables de prix sont configurées dans Vercel. La vente et la livraison automatique ne sont prêtes qu’après le dépôt des deux archives dans le Blob privé et l’ajout de leurs URLs dans les variables Vercel.
