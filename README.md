# Makk

Frontend React/Vite de la boutique Makk. Le catalogue est chargé depuis l’API backend.

## Développement

1. Installer les dépendances avec `npm install`.
2. Copier `.env.example` vers `.env.local` si l’API locale n’est pas disponible à `http://localhost:3300/api/v1`.
3. Renseigner `VITE_API_URL` avec la base de l’API, par exemple `https://api.exemple.com/api/v1`.
4. Démarrer avec `npm run dev`.

## Déploiement du frontend

Le projet se déploie comme un site statique. Commande de build : `npm run build`. Le dossier à publier est `dist`.

Configurer `VITE_API_URL` dans l’hébergeur du frontend avant le build avec l’URL HTTPS publique du backend. Cette variable est intégrée au JavaScript client et ne doit contenir aucun secret. Le backend doit autoriser les requêtes CORS depuis le domaine du frontend.

## Publication Facebook

Le frontend et le backend doivent d’abord être hébergés publiquement en HTTPS. Partager ensuite l’URL publique du frontend depuis le compte ou la page Facebook. Les métadonnées Open Graph sont déclarées dans `index.html`; après le choix du domaine, ajouter les valeurs absolues `og:url` et `og:image` correspondant au site déployé.

Le code backend et sa configuration d’hébergement ne sont pas présents dans ce workspace. Le backend doit être déployé séparément avant que le catalogue soit utilisable depuis le site public.
# makk
