// This file exports template components for server-side rendering
// Since we're generating HTML on the server, we don't need React components here
// The actual template rendering is handled in utils/resumeTemplate.js

export const templateComponents = {
  'modern-professional': 'ModernProfessionalTemplate',
  'classic-executive': 'ClassicExecutiveTemplate', 
  'tech-focused': 'TechFocusedTemplate',
  'fresh-graduate': 'FreshGraduateTemplate',
  'minimal-elegant': 'MinimalElegantTemplate'
};