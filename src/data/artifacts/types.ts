export type FrameType = 'hero' | 'standard' | 'mini' | 'tiny' | 'wide';
export type OffsetType = 'offset-up' | 'offset-down' | 'pull-left' | 'pull-right' | 'none';
export type BorderStyle = 'polaroid' | 'thin' | 'shadow' | 'none';
export type InspirationTemplateType = 'image' | 'music' | 'quote' | 'video';

export interface Artifact {
  id: string;
  title: string;
  medium: string;
  date: string;
  dimensions?: string;
  frameType: FrameType;
  offsetType: OffsetType;
  borderStyle: BorderStyle;
  hasWashiTape?: boolean;
  rotation?: string;
  paperNote?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  imagePath?: string;
  backgroundColor?: string;
  description?: string;
}

export interface InspirationFragment {
  id: string;
  type: InspirationTemplateType;
  content: string;
  source?: string;
  subtitle?: string;
  backgroundColor?: string;
  accentColor?: string;
}
