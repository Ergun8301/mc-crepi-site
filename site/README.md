# MC Crépi — site web (4 pages)

Site vitrine statique pour **MC Crépi**, façadier à Lons-le-Saunier (Jura).
Implémentation fidèle des maquettes exportées depuis Claude Design (`project/*.dc.html`),
converties en **HTML / CSS / JS standard** qui fonctionne partout, sans dépendance ni build.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil (hero parallax, chiffres animés, prestations, avant/après, avis) |
| `prestations.html` | Prestations (6 savoir-faire + méthode) |
| `realisations.html` | Réalisations (galerie filtrable + avant/après) |
| `contact.html` | Contact & devis (coordonnées, formulaire, zone d'intervention) |

Fichiers communs : `assets/site.css` (styles de base) et `assets/site.js`
(interactions : header au scroll, menu mobile, parallax, compteurs, slider
avant/après glissable, filtres galerie, envoi du formulaire).

## Ouvrir / mettre en ligne

- **En local** : ouvrez `index.html` dans un navigateur (ou servez le dossier :
  `npx http-server site` puis ouvrez l'adresse indiquée).
- **En ligne** : déposez le contenu du dossier `site/` chez n'importe quel
  hébergeur statique (Netlify, OVH, GitHub Pages, o2switch…). `index.html` est
  la page d'accueil.

## À finaliser avant la mise en production

- **Photos** : les images proviennent d'Unsplash et sont marquées
  « PHOTO À REMPLACER » — à remplacer par les vraies photos de chantier de Zafer.
- **Formulaire de devis** : branché sur [FormSubmit](https://formsubmit.co)
  vers `zaff39@hotmail.fr`. À la **première** soumission réelle (site en ligne),
  FormSubmit envoie un email d'activation à valider une seule fois. Le formulaire
  s'ouvre dans un nouvel onglet à l'envoi puis affiche le message de confirmation.
- **Logo** : le monogramme MC est intégré en SVG (vectoriel) directement dans les
  pages, recolorié orange/noir comme validé dans les échanges.

## Coordonnées (présentes partout)

Tél. **06 87 59 60 47** (`tel:`) · Email **zaff39@hotmail.fr** (`mailto:`) ·
**WhatsApp** `https://wa.me/33687596047` (bouton flottant sur toutes les pages).
