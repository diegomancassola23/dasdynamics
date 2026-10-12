# Punti aperti

## Decisioni di Diego

- **Repo remoto e hosting**: Diego darà il repo git. Consiglio: **GitHub Pages** (workflow già pronto, gratis, nessuna risorsa Azure da curare) con dominio **dasdynamics.dev** (HTTPS obbligatorio, tema da sviluppatore); .it come seconda scelta. Prima verificare di chi è dasdynamics.com: se è libero o acquistabile a poco, prenderlo e reindirizzarlo.
- **About**: il profilo LinkedIn non ha la sezione Informazioni; testo da far confermare a Diego.
- **Articolo Super User**: bozza da completare da Diego (come ci si è arrivati, numeri, cosa significa).
- **Nome di persona nell'articolo Copilot Chat** (`extending-copilot-chat-d365fo`): tolto per la regola «niente nomi di persona nelle pagine»; ora la riga ringrazia «a fellow community member». Si può ripristinare se Diego lo chiede.
- **Errori d'inglese verbatim nello stesso articolo** (es. «give me a couple of true suggestions»): lasciati come su LinkedIn; da correggere se Diego vuole.
- **Dettagli del caso di supporto nelle bozze**: numeratori continui dopo 10.0.47 (build, correzione, causa) e InventSum mancanti (numero dell'issue, «da 10.0.40») vengono dal caso con Microsoft; Diego conferma che si possono pubblicare.
- **DynamicsMinds «terza volta»**: l'articolo Super User dice «my third DynamicsMinds»; da confermare.
- **Data `updated: 2026-10-10`** sulle note riscritte: da allineare alla data vera del go-live.

## Decisioni prese (09/10/2026)

- Concetto grafico: **Home classica + archivio** (mockup in `docs/mockup/`).
- Nome: **dasdynamics** = «D as Dynamics», la D è Diego; payoff «D as Dynamics. D as Diego.». dasdynamics.com risulta già registrato (Namecheap): verificare se è di Diego; liberi .dev/.it/.io/.net (da confermare dal registrar).
- Logo: **monogramma D**.
- Foto: ritratto 800×758 preso dal profilo Blogger (`public/images/portrait.jpg`).
- Super User Dynamics 365 Community 2026 Season 2: confermato da Diego, va in un articolo dedicato.
- Articoli in evidenza: campo `pinned: true`.
- La cartella locale resta `C:\repos\dynamicsdreams` finché Diego non dà il repo remoto.

## Sito costruito (notte 09→10/10/2026, ramo `site`)

Scelte prese dall'esecutore, da confermare:

- **Astro 7** con il processore Markdown `unified` (non Sätteri, il nuovo predefinito) per un piccolo plugin che trasforma `## In D365FO today` nel riquadro scuro del mockup.
- **X++** evidenziato con la grammatica C# (Shiki non ha X++).
- **Filtri senza JavaScript**: per filone e per verdetto sono pagine vere (`/articles/track/<filone>/`, `/archive/<verdetto>/`); la ricerca nell'archivio compare solo con JavaScript attivo (script inline piccolo).
- **Copertine generate** (10/10): stesso modello notturno per ogni articolo (`src/lib/cover.mjs`), JPEG per le anteprime social con `npm run covers`; il campo `cover` non esiste più. Le copertine originali di LinkedIn sono state tolte il 12/10 su decisione di Diego: resta solo la grafica comune (i file sono nella storia di git).
- **Selettore EN / IT** del mockup tolto finché l'italiano non è pubblicato. Il bottone «Subscribe» porta all'RSS.
- **Credenziale Super User** in home e in About; il link all'articolo appare solo quando l'articolo non è più bozza.
- **GitHub** tolto dai link di About: manca l'indirizzo del profilo.

Da fare / da decidere:

- Dominio (oggi segnaposto `dasdynamics.dev` in `site.config.mjs`) e hosting: GitHub Pages pronto, Azure Static Web Apps descritto nel README.
- Articolo Super User: completare i segnaposto `[Diego: …]` (forum, numeri, link al thread SHA-1), poi `draft: false`.
- Testo di About da confermare (oggi una versione del testo del mockup).
- ~~`src/data/editorial.json`~~: fatto il 09/10 (15 ritirati, 3 uniti, 3 ponti «Then → now»).
- Indirizzo del profilo GitHub, se va messo.

## Idee di Diego

- Dal 09/10/2026 gli articoli nuovi nascono sul sito, non più su LinkedIn (LinkedIn porta sunto e link).
- Tema del sito: D365FO e IA, con un carattere unico. Nome: dasdynamics.
- Scrivere un articolo nuovo deve essere semplice.
- 10/10/2026: l'anteprima è «troppo professionale». Il tema è Dynamics Dreams: resta professionale, ma deve far intuire il concetto di sogno.
- 10/10/2026: copertine tutte nello stesso stile, d'ora in poi, come una firma in linea con il sito; uniformare anche quelle esistenti. Proposte nel mockup «dasdynamics · sogni» (tre direzioni + serie di copertine), decide Diego.

## Da fare

- Copertine degli articoli: tornate il 10/10 (9 PNG originali da LinkedIn, 0,2–1,4 MB l'una, circa 9 MB in tutto). La home ne carica sette: valutare una versione WebP più leggera per le card, tenendo l'originale per l'articolo e l'anteprima social.
- Google: Search Console, sitemap, dati strutturati Person, link dal profilo LinkedIn e dal vecchio blog al sito nuovo.
- Vecchio blog Blogger: avviso in testa a ogni post con il link alla versione nuova. Consiglio: non cancellare il blog (ha anni di link in entrata); avviso + link canonico verso la nota nuova, quando il dominio è deciso.
- 21+2 note «to-review»: compilarle e provarle su una versione attuale (un giro su una dev box) per assegnare il verdetto finale.
- Prima di andare online: cambiare il dominio in `site.config.mjs`, togliere le bozze non pronte, Search Console con la sitemap, link al sito nel profilo LinkedIn (sezione Informazioni e «sito web»).
- Post LinkedIn brevi: raccolti il 09/10 in `sources/linkedin-posts/posts.md` (19 post tuoi, 2024–2026). Proposti come articoli nuovi, in bozza: licenze ISV SHA-256 in 10.0.49; numeratori continui dopo 10.0.47 (cronologia dell'incidente); InventSum mancanti «by design»; F&O nel Power Platform admin center. Il post Super User alimenta l'articolo dedicato; DynamicsMinds (tre edizioni) va nell'About.
- Puntamenti (indagine Google del 10/10, dettaglio in `docs/LINKS-INVENTORY.md`): al vecchio blog punta un solo link esterno (forum Dynamics Community, post SSRS→Excel del 2014); agli articoli LinkedIn nessuno. Da aggiornare a dominio deciso: profilo LinkedIn (sito, Informazioni, In primo piano), GitHub `diegomancassola23` e README di `d365fo.MCP`, profilo Dynamics Community. Il vecchio account GitHub `diegomancassola` esce secondo sul nome con dati vecchi: aggiornarlo o archiviarlo (decide Diego). Una riga in coda a ogni articolo LinkedIn con il link al sito.
- Post di commiato per Blogger e avviso per ogni post: bozza in `docs/blogger-farewell.md`, da pubblicare a dominio deciso.
