# Vérification bénéficiaire CSU

Mini application web : on saisit un code d'immatriculation (ex. `P6204F8290`) et la fiche du bénéficiaire s'affiche (identité, couverture, validité, adhésion).

Par défaut, l'accès est **libre**. Un mot de passe peut être ajouté à tout moment, sans toucher au code, via la variable `ACCES_MOT_DE_PASSE` chez l'hébergeur.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | La page (saisie du code, affichage de la fiche ; écran de mot de passe seulement s'il est activé) |
| `api/beneficiaire.js` | Relais qui interroge l'API CSU (évite le blocage CORS) et vérifie le mot de passe s'il est activé |
| `server.js` | Serveur pour tester sur votre ordinateur (facultatif) |
| `vercel.json` | En-têtes de sécurité (pas d'indexation Google, pas d'intégration dans d'autres sites) |

## Mise en ligne : GitHub + Vercel

### 1. Mettre le code sur GitHub
1. Sur github.com, cliquez **New repository**, nommez-le `verif-csu` et cochez **Private**.
2. Cliquez **uploading an existing file** et glissez tout le contenu du dossier, y compris le dossier `api`.
3. Cliquez **Commit changes**.

### 2. Déployer sur Vercel
1. Allez sur vercel.com et connectez-vous avec votre compte GitHub (l'offre gratuite « Hobby » suffit).
2. Cliquez **Add New… → Project**, puis **Import** à côté de `verif-csu`.
3. Cliquez **Deploy**. Aucune variable n'est nécessaire.
4. Après environ une minute, Vercel donne l'adresse du site, du type `https://verif-csu-xxxx.vercel.app`.

### 3. Utilisation
- Ouvrez l'adresse et saisissez les codes.
- Le lien `https://votre-site.vercel.app/?code=P6204F8290` ouvre directement une fiche.

### Mettre à jour l'application
Modifiez les fichiers sur GitHub : Vercel remet automatiquement le site en ligne à chaque modification.

## Activer un mot de passe (facultatif)

1. Vercel → votre projet → **Settings → Environment Variables**.
2. **Key** : `ACCES_MOT_DE_PASSE` — **Value** : le mot de passe choisi (au moins 12 caractères) → **Save**.
3. **Deployments → ⋯ → Redeploy**.

La page demandera alors le mot de passe avant toute recherche. Pour revenir à l'accès libre, supprimez la variable puis redéployez.

## Tester sur votre ordinateur (facultatif)

Il faut Node.js 18 ou plus récent (nodejs.org). Dans un terminal ouvert dans le dossier :

```
node server.js
```

Avec un mot de passe (Windows, cmd) : `set ACCES_MOT_DE_PASSE=monmotdepasse&& node server.js`

Puis ouvrez http://localhost:3000. N'ouvrez pas `index.html` en double-cliquant : la page doit passer par le relais.

## Sécurité

- Sans mot de passe, toute personne qui connaît l'adresse du site et un code peut voir la fiche correspondante (téléphone, pièce d'identité). Ne diffusez l'adresse qu'aux personnes concernées.
- Gardez le dépôt GitHub en **Private**.
- Le site n'est pas indexé par les moteurs de recherche.
