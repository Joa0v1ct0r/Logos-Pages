
export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  long_description?: string;
  technologies: string[];
  cover_image_url: string;
  project_url: string;
  is_active: boolean;
  order_index: number;
  status: 'Public' | 'Private' | 'Confidential';
  demo_type: 'video' | 'scroll';
  demo_video_url?: string;
  demo_images?: string[];
  objectives?: string;
  problem_solved?: string;
  differentials?: string;
  developed_items?: Array<{ title: string; description: string }>;
  whatsapp_message?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta_url?: string;
  is_active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}
