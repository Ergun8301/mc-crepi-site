# Guide de maintenance — site MC Crépi

Ce site est en **HTML / CSS / JS standard**, sans build ni framework. Tout se
modifie avec un simple éditeur de texte (VS Code recommandé, gratuit). Le rendu
et les animations produits par Claude Design sont conservés à l'identique.

> Règle d'or : modifiez **le texte et les liens**, jamais la structure ni les
> `style="…"` autour, sauf si vous savez ce que vous faites.

---

## Arborescence du projet

```
repo/
├── site/                     ← LE SITE (c'est ce dossier qui est publié)
│   ├── index.html            → page Accueil
│   ├── prestations.html      → page Prestations
│   ├── realisations.html     → page Réalisations
│   ├── contact.html          → page Contact & devis
│   ├── assets/
│   │   ├── site.css          → styles communs (couleurs, base)
│   │   ├── site.js           → animations & interactions communes
│   │   └── images/           → (vide) vos futures photos de chantier
│   ├── README.md             → présentation + mise en ligne
│   └── MAINTENANCE.md        → ce guide
├── netlify.toml              → config de déploiement Netlify
├── project/                  ← maquettes d'origine Claude Design (.dc.html) — archive, ne pas publier
└── chats/                    ← historique de conception — archive
```

Seul le dossier **`site/`** est mis en ligne. `project/` et `chats/` sont gardés
comme archive de référence.

La couleur orange de la marque est définie **une seule fois**, en haut de
`assets/site.css` : `--accent: #F28C28;`. La changer là met à jour tout le site.

---

## 1) Remplacer les photos

Les images sont aujourd'hui des visuels temporaires Unsplash (étiquetés
« PHOTO À REMPLACER » sur le site). Pour mettre vos vraies photos :

1. Déposez vos photos dans `site/assets/images/` (ex. `facade-lons-01.jpg`).
   Conseil : format **JPG**, largeur ~1600 px, poids < 400 Ko (compressez sur
   [squoosh.app](https://squoosh.app)).
2. Dans le fichier `.html` concerné, repérez la balise `<img …>` et remplacez
   l'adresse Unsplash par le chemin local :

   ```html
   <!-- avant -->
   <img src="https://images.unsplash.com/photo-1600585154526-...&fit=crop" alt="Façade rénovée…">
   <!-- après -->
   <img src="assets/images/facade-lons-01.jpg" alt="Façade rénovée à Lons-le-Saunier">
   ```
3. Mettez à jour le texte `alt="…"` (description de la photo — utile pour Google).
4. Supprimez le petit bandeau « PHOTO À REMPLACER » juste sous l'image
   (la ligne `<div …>PHOTO À REMPLACER</div>` ou `PHOTO D'ILLUSTRATION — À REMPLACER`).

**Où se trouve chaque photo :**

| Page | Section | Ce que montre l'image |
|---|---|---|
| `index.html` | Hero (haut de page) | grande façade d'accueil |
| `index.html` | Prestations (6 cartes) | 1 photo par savoir-faire |
| `index.html` | Réalisations (avant/après + 2 cartes) | rénovation, neuf, ITE |
| `prestations.html` | 6 blocs prestation | 1 photo par prestation |
| `realisations.html` | Galerie (8 vignettes) + avant/après | chantiers |

> La galerie et les libellés de `realisations.html` (titre, ville, année) se
> trouvent aussi dans le HTML, juste sous chaque `<img>`.

L'image « avant/après » utilise **deux fois la même photo** : la version
« avant » est simplement assombrie automatiquement par un filtre. Remplacez la
même adresse aux deux endroits (`id="mc-ba"`).

---

## 2) Modifier les textes

Ouvrez le fichier `.html` de la page, cherchez le texte à changer (Ctrl+F) et
éditez-le **entre les balises**. Ne touchez pas à ce qu'il y a dans les
guillemets `style="…"`.

```html
<h2 …>Six savoir-faire,<br>une seule exigence.</h2>
        ▲ modifiez uniquement ce texte
```

- Les **titres de pages** (onglet du navigateur) et descriptions Google sont en
  haut de chaque fichier, dans `<title>…</title>` et
  `<meta name="description" …>`.
- Le `<br>` force un retour à la ligne : gardez-le ou retirez-le selon le rendu.

---

## 3) Changer le numéro de téléphone / WhatsApp

Le numéro apparaît sous **trois formes**. Pour tout changer d'un coup, faites un
« Rechercher / Remplacer dans tous les fichiers » (VS Code : `Ctrl+Maj+H`) sur
le dossier `site/`, pour chacune des trois formes :

| Rechercher | Remplacer par (exemple 06 11 22 33 44) | Rôle |
|---|---|---|
| `06 87 59 60 47` | `06 11 22 33 44` | numéro affiché (19×) |
| `+33687596047`   | `+33611223344`   | lien « Appeler » `tel:` (15×) |
| `33687596047`    | `33611223344`    | lien WhatsApp `wa.me/…` (13×) |

> ⚠️ Faites la forme `+33687596047` **avant** `33687596047`, sinon la première
> serait déjà transformée. Le WhatsApp = indicatif pays **33** + le numéro sans
> le 0 initial (06… → 336…).

L'**email** `zaff39@hotmail.fr` se change de la même façon (17×), y compris dans
l'adresse du formulaire (voir point suivant).

---

## Le formulaire de devis (contact.html)

- Il envoie les demandes à **zaff39@hotmail.fr** via le service gratuit
  [FormSubmit](https://formsubmit.co) — aucun serveur à gérer.
- **Activation (une seule fois)** : à la première demande envoyée depuis le site
  **en ligne**, FormSubmit envoie à Zafer un email « Confirm your email » : il
  faut cliquer le lien une fois. Ensuite les demandes arrivent directement.
- Pour changer l'adresse de réception : dans `contact.html`, remplacez
  `action="https://formsubmit.co/zaff39@hotmail.fr"` par la nouvelle adresse.

---

## 4) Mettre à jour le site (GitHub + Netlify)

**Mise en place (une seule fois) :**
1. Poussez le dépôt sur GitHub.
2. Sur [Netlify](https://app.netlify.com) → *Add new site* → *Import from Git* →
   choisissez le dépôt. Le fichier `netlify.toml` indique déjà de publier le
   dossier `site/` : laissez les réglages par défaut, cliquez *Deploy*.
3. (Option) *Domain settings* pour brancher un nom de domaine
   (ex. `mccrepi.fr`).

**À chaque modification ensuite :**
```bash
git add .
git commit -m "Mise à jour des photos / textes"
git push
```
Netlify redéploie **automatiquement** en ~30 s. Rien d'autre à faire.

> Astuce : pour tester avant de publier, ouvrez simplement le fichier
> `site/index.html` dans votre navigateur, ou lancez `npx http-server site`.

---

## 5) Faire évoluer le site plus tard (sans repartir de zéro)

- **Ajouter une réalisation** : dans `realisations.html`, dupliquez un bloc
  `<div class="mc-item" data-cat="…">…</div>` existant et changez photo, titre,
  ville, année. Le `data-cat` doit valoir `reno`, `neuf` ou `murs` pour que les
  filtres fonctionnent.
- **Ajouter une page** : dupliquez un fichier `.html` existant (il contient déjà
  le même en-tête, pied de page et bouton WhatsApp), renommez-le, puis ajoutez
  son lien dans le menu (`<nav>`) et le pied de page des **quatre** pages.
- **Header / footer / bouton WhatsApp** sont copiés dans chaque page (site
  statique). Une modification de menu doit donc être reportée sur les 4 fichiers
  — un « Rechercher/Remplacer dans tous les fichiers » suffit.
- **Charte graphique** : couleur d'accent dans `assets/site.css` (`--accent`),
  polices via le lien Google Fonts en haut de chaque page (Archivo + Inter).
- Gardez le dossier `project/` (maquettes d'origine) : il documente le rendu
  cible si un doute survient.

Pour une évolution plus lourde (blog, espace client, multilingue), ce socle
statique peut être repris tel quel dans un générateur comme **Astro** ou
**Eleventy** sans réécrire le design.
