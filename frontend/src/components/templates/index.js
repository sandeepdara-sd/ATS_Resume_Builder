import ModernProfessionalTemplate from './ModernProfessionalTemplate';
import ClassicExecutiveTemplate from './ClassicExecutiveTemplate';
import TechFocusedTemplate from './TechFocusedTemplate';
import FreshGraduateTemplate from './FreshGraduateTemplate';
import MinimalElegantTemplate from './MinimalElegantTemplate';

export const templateComponents = {
  'modern-professional': ModernProfessionalTemplate,
  'classic-executive': ClassicExecutiveTemplate,
  'tech-focused': TechFocusedTemplate,
  'fresh-graduate': FreshGraduateTemplate,
  'minimal-elegant': MinimalElegantTemplate
};

export { default as TemplateSelector } from './TemplateSelector';