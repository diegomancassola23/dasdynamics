# Punti aperti

## Decisioni di Diego

- **Repo remoto e hosting**: Diego darà il repo git. Proposta: GitHub Pages o Azure Static Web Apps con dominio proprio (es. dynamicsdreams.dev / .com, da verificare la disponibilità).
- **About**: il profilo LinkedIn non ha la sezione Informazioni; testo da far confermare a Diego.
- **Articolo Super User**: bozza da completare da Diego (come ci si è arrivati, numeri, cosa significa).

## Decisioni prese (09/10/2026)

- Concetto grafico: **Home classica + archivio** (mockup in `docs/mockup/`).
- Nome: **dasdynamics** = «D as Dynamics», la D è Diego; payoff «D as Dynamics. D as Diego.». dasdynamics.com risulta già registrato (Namecheap): verificare se è di Diego; liberi .dev/.it/.io/.net (da confermare dal registrar).
- Logo: **monogramma D**.
- Foto: ritratto 800×758 preso dal profilo Blogger (`public/images/portrait.jpg`).
- Super User Dynamics 365 Community 2026 Season 2: confermato da Diego, va in un articolo dedicato.
- Articoli in evidenza: campo `pinned: true`.
- La cartella locale resta `C:epos\dynamicsdreams` finché Diego non dà il repo remoto.

## Sito costruito (notte 09→10/10/2026, ramo `site`)

Scelte prese dall'esecutore, da confermare:

- **Astro 7** con il processore Markdown `unified` (non Sätteri, il nuovo predefinito) per un piccolo plugin che trasforma `## In D365FO today` nel riquadro scuro del mockup.
- **X++** evidenziato con la grammatica C# (Shiki non ha X++).
- **Filtri senza JavaScript**: per filone e per verdetto sono pagine vere (`/articles/track/<filone>/`, `/archive/<verdetto>/`); la ricerca nell'archivio compare solo con JavaScript attivo (script inline piccolo).
- **Campo `cover`** opzionale nel frontmatter: la parola grande sulla copertina della card (es. «APIM»); senza, il codice del filone.
- **Selettore EN / IT** del mockup tolto finché l'italiano non è pubblicato. Il bottone «Subscribe» porta all'RSS.
- **Credenziale Super User** in home e in About; il link all'articolo appare solo quando l'articolo non è più bozza.
- **GitHub** tolto dai link di About: manca l'indirizzo del profilo.
- **Fixture**: quattro file `zz-fixture-*` (un articolo in serie, tre note: valid, changed, historical); il verdetto `to-review` non ha una fixture. Vanno cancellati all'unione con `content`.

Da fare / da decidere:

- Dominio (oggi segnaposto `dasdynamics.dev` in `site.config.mjs`) e hosting: GitHub Pages pronto, Azure Static Web Apps descritto nel README.
- Articolo Super User: completare i segnaposto `[Diego: …]` (forum, numeri, link al thread SHA-1), poi `draft: false`.
- Testo di About da confermare (oggi una versione del testo del mockup).
- `src/data/editorial.json`: il ramo `content` riempie ritirate, unite e i ponti «Then → now».
- Indirizzo del profilo GitHub, se va messo.

## Idee di Diego

- Dal 09/10/2026 gli articoli nuovi nascono sul sito, non più su LinkedIn (LinkedIn porta sunto e link).
- Tema del sito: D365FO e IA, con un carattere unico. Nome: dasdynamics.
- Scrivere un articolo nuovo deve essere semplice.

## Da fare

- Google: Search Console, sitemap, dati strutturati Person, link dal profilo LinkedIn e dal vecchio blog al sito nuovo.
- Vecchio blog Blogger: avviso in testa a ogni post con il link alla versione nuova.
- Post LinkedIn brevi: raccoglierli e proporre quelli da trasformare in articoli (il browser si è bloccato al primo tentativo).
