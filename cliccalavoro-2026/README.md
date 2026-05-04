# Clicca Lavoro 2026 — Brief & Moodboard

Sito statico in HTML/CSS/JS che presenta il brief di posizionamento e la moodboard visiva per il rilancio di Clicca Lavoro nel 2026. Pensato per essere caricato su GitHub e pubblicato gratis tramite GitHub Pages, con sistema di commenti per capitolo basato su Giscus (GitHub Discussions). Nessun backend.

## Struttura del progetto

```
cliccalavoro-2026/
├── cliccalavoro-2026.html  ← entry point del progetto
├── README.md               ← questo file
└── assets/
    ├── styles.css          ← tutti gli stili
    ├── app.js              ← TOC attivo + lazy loader Giscus
    ├── giscus.config.js    ← configurazione commenti (DA EDITARE)
    └── logos/
        ├── logo-2000.gif   ← logo storico anni 2000
        └── logo-2015.png   ← logo 2015 (archiviato)
```

Il file principale ha lo stesso nome della cartella, così quando affianchi più progetti riconosci a colpo d'occhio cosa contiene ognuno.

Per tenere più progetti uno accanto all'altro, basta affiancare a questa cartella altre cartelle dello stesso tipo (`altroprogetto-2026/`, `terzo-progetto/`, ecc). Ognuna è un repo o una sottocartella indipendente.

## Deploy su GitHub Pages

### 1. Crea il repo

1. Vai su [github.com/new](https://github.com/new) e crea un repo pubblico, ad esempio `cliccalavoro-2026`.
2. Trascina nel repo tutto il contenuto della cartella (`cliccalavoro-2026.html`, `README.md`, e la sottocartella `assets/` con dentro tutti i file).

### 2. Pubblica il sito

1. Settings → Pages → **Source: Deploy from branch** → **Branch: main / root** → Save.
2. Dopo 1-2 minuti il sito è online a `https://<tuo-utente>.github.io/cliccalavoro-2026/cliccalavoro-2026.html`.

> **Nota sull'URL:** dato che il file non si chiama `index.html`, l'URL del sito include il nome esplicito del file. Se preferisci che l'URL si fermi alla cartella (`https://<tuo-utente>.github.io/cliccalavoro-2026/`), basta creare nella stessa cartella un secondo file chiamato `index.html` con dentro un solo redirect: `<meta http-equiv="refresh" content="0; url=cliccalavoro-2026.html">`. Opzionale.

### 3. Attiva i commenti per capitolo

I commenti usano [Giscus](https://giscus.app), che salva i thread nelle GitHub Discussions del repo. Niente backend, niente database esterni: chi vuole commentare autentica con GitHub.

1. Settings → General → Features → spunta **Discussions**.
2. Vai su [github.com/apps/giscus](https://github.com/apps/giscus), clicca **Install**, seleziona il repo (solo questo).
3. Vai su [giscus.app](https://giscus.app):
    - alla voce **Repository** inserisci `tuo-utente/cliccalavoro-2026`,
    - alla voce **Page ↔ Discussions Mapping** seleziona **Discussion title contains page** *specific term*,
    - alla voce **Discussion Category** seleziona la categoria che vuoi (es. `General` o crea `Brief 2026 — Capitoli`),
    - lingua: `Italiano`.
4. La pagina di Giscus ti mostrerà uno snippet `<script>` con quattro attributi `data-*`. Te ne servono solo 4 valori:
    - `data-repo`
    - `data-repo-id`
    - `data-category`
    - `data-category-id`
5. Apri `assets/giscus.config.js` e sostituisci i quattro placeholder. Esempio di valore reale:

   ```js
   window.GISCUS_CONFIG = {
     repo:        "directperformance/cliccalavoro-2026",
     repoId:      "R_kgDOLxxxxxx",
     category:    "Brief 2026 — Capitoli",
     categoryId:  "DIC_kwDOLxxxxxx",
     theme:       "light",
     lang:        "it"
   };
   ```

6. Carica il file aggiornato. La pagina ora attiva i commenti per ogni capitolo: ogni capitolo ha il suo `data-term` univoco (`capitolo-01-sintesi`, `capitolo-02-eredita`, ecc.) e quindi una propria discussione separata su GitHub. Lato GitHub vedrai una nuova Discussion per ciascun capitolo che riceve il primo commento.

## Editare il documento

Il contenuto è tutto in `cliccalavoro-2026.html`. Per modificarlo:

- **Aggiungere o cambiare testo:** modifica direttamente `cliccalavoro-2026.html`. Ogni capitolo è una `<section class="chapter" id="...">`.
- **Cambiare palette o colori:** modifica le CSS variables in cima a `assets/styles.css` (sezione `:root`). Tutti gli elementi si aggiornano automaticamente.
- **Cambiare i simboli:** i sei concept del capitolo 10 sono SVG inline dentro `cliccalavoro-2026.html`. Si possono modificare direttamente o sostituire con varianti.
- **Aggiungere un nuovo capitolo:** copia la struttura di una `<section class="chapter">`, aggiorna l'`id` e il `data-term` del blocco discussione, aggiungi la voce nel `<ul class="toc">` in cima.

Nessun build step richiesto: è HTML statico. Basta un editor di testo e il browser per la preview.

## Testare in locale (opzionale)

Per evitare problemi di CORS aprendo i file in locale, conviene avviare un server statico:

```bash
cd cliccalavoro-2026
python3 -m http.server 8000
# poi vai su http://localhost:8000/cliccalavoro-2026.html
```

Oppure, se hai Node:

```bash
npx serve .
```

## Struttura tecnica

- **HTML:** statico, una pagina sola, 12 sezioni.
- **CSS:** un singolo file (`styles.css`), sistema basato su CSS custom properties.
- **JS:** un singolo file (`app.js`) per l'highlight della TOC e il lazy-loading di Giscus. Niente framework, niente build.
- **Font:** Inter + JetBrains Mono caricati da Google Fonts via `<link>`.
- **Commenti:** Giscus (GitHub Discussions) caricato solo on-demand al click sul bottone.

## Licenza

Documento di lavoro interno. Non distribuire senza autorizzazione.
