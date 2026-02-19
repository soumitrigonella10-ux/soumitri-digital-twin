# Essays PDFs

Drop your essay PDF files here. They will be embedded in the essay modals.

## Naming Convention

Name each PDF to match the essay slug in `src/data/essays.ts`:

| Essay | Expected PDF filename |
|-------|----------------------|
| On Taste | `on-taste.pdf` |
| The Architecture of Daily Rituals | `the-architecture-of-daily-rituals.pdf` |
| Against Minimalism (As Religion) | `against-minimalism.pdf` |
| The Digital Twin Hypothesis | `the-digital-twin-hypothesis.pdf` |
| On Clothing as Language | `on-clothing-as-language.pdf` |
| Systems Over Goals | `systems-over-goals.pdf` |
| The Loneliness of Good Taste | `the-loneliness-of-good-taste.pdf` |
| In Defense of Friction | `in-defense-of-friction.pdf` |

## Adding a New Essay

1. Create your PDF and drop it in this folder
2. In `src/data/essays.ts`, add a new essay entry with `pdfUrl: "/pdfs/essays/your-file.pdf"`
3. The `body` field is optional — it serves as a fallback if no PDF is found

If an essay has a `pdfUrl`, the modal will embed the PDF. If not, it falls back to rendering the `body` blocks as before.
