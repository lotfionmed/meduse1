import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  content?: {
    definition?: string;
    types?: string[];
    clinicalSigns?: string[];
    diagnosis?: string[];
    treatment?: string;
    audio?: {
      url: string;
      title: string;
    };
    mindMap?: {
      url: string;
      title: string;
    };
  };
}

export interface Chapter {
  id: string;
  title: string;
  courses: Course[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  chapters: Chapter[];
}