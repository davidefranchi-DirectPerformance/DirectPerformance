# Magellano.ai — Mockup Sito

Mockup statico del sito magellano.ai, pronto per GitHub Pages.

## Struttura file

```
magellano-site/
├── index.html        ← pagina principale
├── css/
│   └── style.css     ← tutti gli stili
├── js/
│   └── script.js     ← navbar, accordion, tab, animazioni
└── README.md
```

## Come pubblicare su GitHub Pages

1. Crea un nuovo repository su github.com (es. `magellano-site`)
2. Carica tutti i file mantenendo la struttura delle cartelle
3. Vai in **Settings → Pages**
4. In "Source" seleziona **Deploy from a branch**
5. Scegli branch `main`, cartella `/ (root)`
6. Clicca **Save**

Il sito sarà live su: `https://[tuo-username].github.io/magellano-site/`

## Note sviluppo

- Palette colori: navy `#132b48`, teal `#06c7b2` (da directperformance.it)
- Font: Inter (Google Fonts)
- Nessuna dipendenza esterna oltre al font
- Mobile responsive con breakpoint a 768px e 480px
- Il form contatti è placeholder — da collegare a un backend o servizio (es. Formspree, Netlify Forms)
- I loghi nei case study sono placeholder da sostituire con immagini reali
