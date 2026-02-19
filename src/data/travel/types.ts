// ========================================
// Travel Location Types
// ========================================

export interface JournalPage {
  pageNumber: number;
  title?: string;
  content: string;
  images?: string[];
  type: "text" | "photo" | "sketch" | "mixed";
}

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  coordinates: string;
  dateVisited: string;
  description: string;
  imageUrl: string;
  isHeroTile?: boolean;
  
  // Journal metadata
  climate: string;
  duration: string;
  inventory: string[];
  notes: string;
  
  /** Path to PDF journal in public/pdfs/travel/ */
  pdfUrl?: string;
  
  // Journal pages (fallback if no PDF)
  journalPages: JournalPage[];
}
