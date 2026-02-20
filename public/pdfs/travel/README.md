# Travel Journal PDFs

Drop your travel journal PDF files here. They will be embedded in the travel log modals.

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
2. In `src/data/travel/`, add a new location entry with `pdfUrl: "/pdfs/travel/your-file.pdf"`
