# Travel Journal PDFs

Drop your travel journal PDF files here. They will be embedded in the journal modals.

## Naming Convention

Name each PDF to match the travel location ID in `src/data/travelLocations.ts`:

| Location | Expected PDF filename |
|----------|----------------------|
| Kyoto | `kyoto-2025.pdf` |
| Lisbon | `lisbon-2024.pdf` |
| Reykjavík | `reykjavik-2023.pdf` |
| Marrakech | `marrakech-2022.pdf` |
| Osaka | `osaka-2021.pdf` |

## Adding a New Travel Journal

1. Create your PDF and drop it in this folder
2. In `src/data/travelLocations.ts`, add a new location entry with `pdfUrl: "/pdfs/travel/your-file.pdf"`
3. The `journalPages` array is optional — it serves as a fallback if no PDF is found

If a location has a `pdfUrl`, the modal will embed the PDF. If not, it falls back to the page-flip journal view.
