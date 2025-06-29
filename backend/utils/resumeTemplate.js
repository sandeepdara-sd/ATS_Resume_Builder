//resumeTemplate.js

import { templateComponents } from '../templates/index.js';

export const generateResumeHTML = (resumeData) => {
  const selectedTemplate = resumeData.selectedTemplate || { id: 'modern-professional' };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Template-specific HTML generation
  switch (selectedTemplate.id) {
    case 'classic-executive':
      return generateClassicExecutiveHTML(resumeData, formatDate);
    case 'tech-focused':
      return generateTechFocusedHTML(resumeData, formatDate);
    case 'fresh-graduate':
      return generateFreshGraduateHTML(resumeData, formatDate);
    case 'minimal-elegant':
      return generateMinimalElegantHTML(resumeData, formatDate);
    case 'modern-professional':
    default:
      return generateModernProfessionalHTML(resumeData, formatDate);
  }
};

// Helper function to calculate dynamic spacing based on content
function calculateDynamicSpacing(resumeData) {
  let contentSections = 0;
  
  if (resumeData.summary) contentSections++;
  if (resumeData.experience?.length > 0) contentSections++;
  if (resumeData.projects?.length > 0) contentSections++;
  if (resumeData.education?.length > 0) contentSections++;
  if (resumeData.skills?.length > 0) contentSections++;
  if (resumeData.achievements?.length > 0) contentSections++;
  if (resumeData.hobbies?.length > 0) contentSections++;
  
  // Calculate dynamic spacing based on number of sections
  const baseSpacing = contentSections <= 4 ? 24 : contentSections <= 6 ? 18 : 12;
  const itemSpacing = contentSections <= 4 ? 16 : contentSections <= 6 ? 12 : 8;
  
  return { baseSpacing, itemSpacing };
}

// Helper function to get dynamic font sizes
function getDynamicFontSizes(resumeData) {
  let totalItems = 0;
  
  if (resumeData.experience) totalItems += resumeData.experience.length;
  if (resumeData.projects) totalItems += resumeData.projects.length;
  if (resumeData.education) totalItems += resumeData.education.length;
  if (resumeData.achievements) totalItems += resumeData.achievements.length;
  
  // Adjust font sizes based on content density
  const isContentHeavy = totalItems > 8;
  
  return {
    nameSize: isContentHeavy ? '2rem' : '2.2rem',
    sectionTitleSize: isContentHeavy ? '1rem' : '1.1rem',
    itemTitleSize: isContentHeavy ? '0.9rem' : '1rem',
    bodySize: isContentHeavy ? '0.8rem' : '0.85rem',
    smallSize: isContentHeavy ? '0.75rem' : '0.8rem'
  };
}

// Modern Professional Template
function generateModernProfessionalHTML(resumeData, formatDate) {
  const spacing = calculateDynamicSpacing(resumeData);
  const fonts = getDynamicFontSizes(resumeData);
  
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #2d3748;
          line-height: 1.4;
        }
        
        .container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background-color: white;
          padding: 15mm;
          box-sizing: border-box;
          min-height: auto;
          display: flex;
          flex-direction: column;
        }

        .header {
          text-align: center;
          margin-bottom: ${spacing.baseSpacing}px;
        }

        .name {
          font-size: ${fonts.nameSize};
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 6px;
          margin-top: 0;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
          font-size: ${fonts.smallSize};
          color: #4a5568;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: ${fonts.smallSize};
          color: #3182ce;
        }

        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: ${spacing.itemSpacing}px 0;
          border-width: 1px;
        }

        .section {
          margin-bottom: ${spacing.baseSpacing}px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: ${fonts.sectionTitleSize};
          font-weight: 600;
          color: #2d3748;
          margin-bottom: ${spacing.itemSpacing}px;
          margin-top: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .summary-text {
          font-size: ${fonts.bodySize};
          line-height: 1.5;
          color: #4a5568;
        }

        .item {
          margin-bottom: ${spacing.itemSpacing}px;
        }

        .item:last-child {
          margin-bottom: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .item-title {
          font-size: ${fonts.itemTitleSize};
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 3px 0;
          line-height: 1.2;
        }

        .item-subtitle {
          font-size: ${fonts.bodySize};
          font-weight: 500;
          color: #3182ce;
          margin: 0;
          line-height: 1.2;
        }

        .item-date {
          font-size: ${fonts.smallSize};
          color: #718096;
          white-space: nowrap;
          font-weight: 500;
          line-height: 1.2;
        }

        .item-location {
          font-size: ${fonts.smallSize};
          color: #718096;
          margin-bottom: 6px;
        }

        .item-description {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #4a5568;
          white-space: pre-line;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-chip {
          display: inline-block;
          padding: 3px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: ${fonts.smallSize};
          color: #4a5568;
          background-color: #f7fafc;
          line-height: 1.2;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 10mm;
            page-break-inside: avoid;
            min-height: auto;
          }
          .section {
            page-break-inside: avoid;
          }
          .item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || ''}</h1>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span>${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span>${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span>${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="contact-links">
            ${resumeData.personalDetails?.linkedin ? `<span>LinkedIn: ${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.github ? `<span>GitHub: ${resumeData.personalDetails.github.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span>Portfolio: ${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        <div class="divider"></div>

        ${resumeData.summary ? `
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary-text">${resumeData.summary}</div>
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${exp.jobTitle || ''}</h3>
                    <div class="item-subtitle">${exp.company || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                ${exp.responsibilities ? `<div class="item-description">${exp.responsibilities}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Core Competencies</h2>
            <div class="skills-container">
              ${resumeData.skills.map(skill => `
                <span class="skill-chip">${skill}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Key Projects</h2>
            ${resumeData.projects.map(project => `
              <div class="item">
                <div class="item-header">
                  <h3 class="item-title">${project.name || ''}</h3>
                  ${project.duration ? `<div class="item-date">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `<div style="font-size: ${fonts.smallSize}; color: #718096; margin-top: 3px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${edu.degree || ''}</h3>
                    <div class="item-subtitle">${edu.institution || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
                ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
                ${edu.gpa ? `<div style="font-size: ${fonts.bodySize}; color: #4a5568;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Achievements & Certifications</h2>
            ${resumeData.achievements.map(achievement => `
              <div class="item">
                <h3 class="item-title">${achievement.title || ''}</h3>
                ${achievement.organization ? `<div class="item-subtitle">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Hobbies & Interests</h2>
            <div style="font-size: ${fonts.bodySize}; line-height: 1.4; color: #4a5568;">
              ${resumeData.hobbies.join(' • ')}
            </div>
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}

// Classic Executive Template
function generateClassicExecutiveHTML(resumeData, formatDate) {
  const spacing = calculateDynamicSpacing(resumeData);
  const fonts = getDynamicFontSizes(resumeData);
  
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Times New Roman", serif;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #000000;
          line-height: 1.3;
        }
        
        .container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background-color: white;
          padding: 15mm;
          box-sizing: border-box;
          min-height: auto;
        }

        .header {
          text-align: center;
          margin-bottom: ${spacing.baseSpacing}px;
          border-bottom: 2px solid #000;
          padding-bottom: ${spacing.itemSpacing}px;
        }

        .name {
          font-size: ${fonts.nameSize === '2rem' ? '2.2rem' : '2.5rem'};
          font-weight: bold;
          color: #000000;
          margin-bottom: 12px;
          margin-top: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.1;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 12px;
          font-size: ${fonts.bodySize};
          color: #000000;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          font-size: ${fonts.smallSize};
          color: #000000;
        }

        .section {
          margin-bottom: ${spacing.baseSpacing}px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: ${fonts.sectionTitleSize === '1rem' ? '1.2rem' : '1.3rem'};
          font-weight: bold;
          color: #000000;
          margin-bottom: ${spacing.itemSpacing}px;
          margin-top: 0;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
          padding-bottom: 6px;
          line-height: 1.2;
        }

        .summary-text {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #000000;
          text-align: justify;
        }

        .item {
          margin-bottom: ${spacing.itemSpacing}px;
        }

        .item:last-child {
          margin-bottom: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .item-title {
          font-size: ${fonts.itemTitleSize};
          font-weight: bold;
          color: #000000;
          margin: 0 0 3px 0;
          line-height: 1.2;
        }

        .item-subtitle {
          font-size: ${fonts.bodySize};
          font-weight: bold;
          color: #000000;
          margin: 0;
          font-style: italic;
          line-height: 1.2;
        }

        .item-date {
          font-size: ${fonts.bodySize};
          color: #000000;
          white-space: nowrap;
          font-weight: bold;
          text-align: right;
          line-height: 1.2;
        }

        .item-location {
          font-size: ${fonts.smallSize};
          color: #000000;
          margin-bottom: 6px;
        }

        .item-description {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #000000;
          white-space: pre-line;
          text-align: justify;
          margin-top: 6px;
        }

        .skills-text {
          font-size: ${fonts.bodySize};
          line-height: 1.6;
          color: #000000;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 10mm;
            page-break-inside: avoid;
            min-height: auto;
          }
          .section {
            page-break-inside: avoid;
          }
          .item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || ''}</h1>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span>${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span>${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span>${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="contact-links">
            ${resumeData.personalDetails?.linkedin ? `<span>LinkedIn: ${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span>Portfolio: ${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="section">
            <h2 class="section-title">Executive Summary</h2>
            <div class="summary-text">${resumeData.summary}</div>
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div style="flex: 1;">
                    <h3 class="item-title">${exp.jobTitle || ''}</h3>
                    <div class="item-subtitle">${exp.company || ''}</div>
                    ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.responsibilities ? `<div class="item-description">${exp.responsibilities}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Core Competencies</h2>
            <div class="skills-text">${resumeData.skills.join(' • ')}</div>
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${edu.degree || ''}</h3>
                    <div class="item-subtitle">${edu.institution || ''}, ${edu.location || ''}</div>
                    ${edu.gpa ? `<div style="font-size: ${fonts.smallSize}; color: #000000;">GPA: ${edu.gpa}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Professional Achievements</h2>
            ${resumeData.achievements.map(achievement => `
              <div class="item">
                <h3 class="item-title">${achievement.title || ''}</h3>
                ${achievement.organization ? `<div class="item-subtitle">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Notable Projects</h2>
            ${resumeData.projects.map(project => `
              <div class="item">
                <h3 class="item-title">${project.name || ''}</h3>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `<div style="font-size: ${fonts.smallSize}; color: #000000; margin-top: 3px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}

// Tech Focused Template
function generateTechFocusedHTML(resumeData, formatDate) {
  const spacing = calculateDynamicSpacing(resumeData);
  const fonts = getDynamicFontSizes(resumeData);
  
  // Categorize skills for better organization
  const categorizeSkills = (skills) => {
    const categories = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Other Skills': []
    };

    const programmingKeywords = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails'];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack', 'babel', 'npm', 'yarn'];

    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (programmingKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Programming Languages'].push(skill);
      } else if (frameworkKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Frameworks & Libraries'].push(skill);
      } else if (toolKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Tools & Technologies'].push(skill);
      } else {
        categories['Other Skills'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = resumeData.skills ? categorizeSkills(resumeData.skills) : {};

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Fira Code", "Monaco", "Consolas", monospace;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #2d3748;
          line-height: 1.4;
        }
        
        .container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background-color: white;
          padding: 15mm;
          box-sizing: border-box;
          min-height: auto;
        }

        .header {
          margin-bottom: ${spacing.baseSpacing}px;
          position: relative;
          padding-left: 16px;
        }

        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #00d9ff;
          border-radius: 2px;
        }

        .name {
          font-size: ${fonts.nameSize};
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 6px;
          margin-top: 0;
          font-family: "Inter", sans-serif;
          line-height: 1.1;
        }

        .job-title {
          color: #00d9ff;
          margin-bottom: 12px;
          font-size: ${fonts.itemTitleSize};
          font-weight: 500;
          font-family: "Inter", sans-serif;
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
          font-size: ${fonts.smallSize};
          color: #4a5568;
        }

        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: ${fonts.smallSize};
          color: #00d9ff;
        }

        .section {
          margin-bottom: ${spacing.baseSpacing}px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: ${fonts.sectionTitleSize};
          font-weight: 600;
          color: #1a202c;
          margin-bottom: ${spacing.itemSpacing}px;
          margin-top: 0;
          font-family: "Inter", sans-serif;
          display: flex;
          align-items: center;
          line-height: 1.2;
        }

        .section-title::before {
          content: '';
          width: 16px;
          height: 2px;
          background-color: #00d9ff;
          margin-right: 10px;
        }

        .summary-box {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 12px;
          font-family: "Inter", sans-serif;
        }

        .summary-text {
          font-size: ${fonts.bodySize};
          line-height: 1.5;
          color: #4a5568;
        }

        .item {
          margin-bottom: ${spacing.itemSpacing}px;
          position: relative;
          padding-left: 16px;
        }

        .item:last-child {
          margin-bottom: 0;
        }

        .item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background-color: #e2e8f0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .item-title {
          font-size: ${fonts.itemTitleSize};
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 3px 0;
          font-family: "Inter", sans-serif;
          line-height: 1.2;
        }

        .item-subtitle {
          font-size: ${fonts.bodySize};
          font-weight: 500;
          color: #00d9ff;
          margin: 0;
          font-family: "Inter", sans-serif;
          line-height: 1.2;
        }

        .item-date {
          background-color: #00d9ff;
          color: white;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: ${fonts.smallSize};
          font-weight: 500;
          white-space: nowrap;
          line-height: 1.2;
        }

        .item-location {
          font-size: ${fonts.smallSize};
          color: #718096;
          margin-bottom: 6px;
        }

        .item-description {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #4a5568;
          white-space: pre-line;
          font-family: "Inter", sans-serif;
        }

        .skill-category {
          margin-bottom: 12px;
        }

        .skill-category-title {
          font-size: ${fonts.bodySize};
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 6px;
          font-family: "Inter", sans-serif;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-chip {
          display: inline-block;
          padding: 3px 10px;
          background-color: #00d9ff;
          color: white;
          border-radius: 4px;
          font-size: ${fonts.smallSize};
          font-weight: 500;
          font-family: "Fira Code", monospace;
          line-height: 1.2;
        }

        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-bottom: 6px;
        }

        .tech-chip {
          display: inline-block;
          padding: 2px 6px;
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 3px;
          font-size: ${fonts.smallSize};
          color: #4a5568;
          font-family: "Fira Code", monospace;
          line-height: 1.2;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 10mm;
            page-break-inside: avoid;
            min-height: auto;
          }
          .section {
            page-break-inside: avoid;
          }
          .item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || ''}</h1>
          <div class="job-title">Software Developer</div>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span>📧 ${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span>📱 ${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span>📍 ${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="contact-links">
            ${resumeData.personalDetails?.github ? `<span>🔗 ${resumeData.personalDetails.github.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.linkedin ? `<span>💼 ${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span>🌐 ${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="section">
            <h2 class="section-title">ABOUT</h2>
            <div class="summary-box">
              <div class="summary-text">${resumeData.summary}</div>
            </div>
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">TECHNICAL SKILLS</h2>
            ${Object.entries(skillCategories).map(([category, skills]) => 
              skills.length > 0 ? `
                <div class="skill-category">
                  <div class="skill-category-title">${category}:</div>
                  <div class="skills-container">
                    ${skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
                  </div>
                </div>
              ` : ''
            ).join('')}
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">EXPERIENCE</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${exp.jobTitle || ''}</h3>
                    <div class="item-subtitle">${exp.company || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.location ? `<div class="item-location">📍 ${exp.location}</div>` : ''}
                ${exp.responsibilities ? `<div class="item-description">${exp.responsibilities}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">PROJECTS</h2>
            ${resumeData.projects.map(project => `
              <div class="item">
                <div class="item-header">
                  <h3 class="item-title">🚀 ${project.name || ''}</h3>
                  ${project.duration ? `<div style="color: #718096; font-size: ${fonts.smallSize};">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `
                  <div class="tech-chips">
                    ${project.technologies.split(',').map(tech => `<span class="tech-chip">${tech.trim()}</span>`).join('')}
                  </div>
                ` : ''}
                ${project.link ? `<div style="font-size: ${fonts.smallSize}; color: #00d9ff;">🔗 ${project.link}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">EDUCATION</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">🎓 ${edu.degree || ''}</h3>
                    <div class="item-subtitle">${edu.institution || ''}</div>
                  </div>
                  <div style="color: #718096; font-size: ${fonts.smallSize};">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
                ${edu.gpa ? `<div style="font-size: ${fonts.bodySize}; color: #4a5568; font-family: 'Inter', sans-serif;">GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">ACHIEVEMENTS</h2>
            ${resumeData.achievements.map(achievement => `
              <div class="item">
                <h3 class="item-title">🏆 ${achievement.title || ''}</h3>
                ${achievement.organization ? `<div class="item-subtitle">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}

// Fresh Graduate Template
function generateFreshGraduateHTML(resumeData, formatDate) {
  const spacing = calculateDynamicSpacing(resumeData);
  const fonts = getDynamicFontSizes(resumeData);
  
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Roboto", "Arial", sans-serif;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #333333;
          line-height: 1.4;
        }
        
        .container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background-color: white;
          padding: 15mm;
          box-sizing: border-box;
          min-height: auto;
        }

        .header {
          text-align: center;
          margin-bottom: ${spacing.baseSpacing}px;
          padding-bottom: ${spacing.itemSpacing}px;
          border-bottom: 3px solid #4CAF50;
        }

        .name {
          font-size: ${fonts.nameSize === '2rem' ? '2.2rem' : '2.4rem'};
          font-weight: 700;
          color: #2E7D32;
          margin-bottom: 6px;
          margin-top: 0;
          letter-spacing: 1px;
          line-height: 1.1;
        }

        .subtitle {
          color: #666666;
          margin-bottom: 12px;
          font-size: ${fonts.bodySize};
          font-style: italic;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
          font-size: ${fonts.smallSize};
          color: #555555;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: ${fonts.smallSize};
          color: #4CAF50;
        }

        .section {
          margin-bottom: ${spacing.baseSpacing}px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: ${fonts.sectionTitleSize};
          font-weight: 600;
          color: #2E7D32;
          margin-bottom: ${spacing.itemSpacing}px;
          margin-top: 0;
          display: flex;
          align-items: center;
          line-height: 1.2;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 16px;
          background-color: #4CAF50;
          margin-right: 10px;
        }

        .objective-box {
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 6px;
          padding: 16px;
        }

        .summary-text {
          font-size: ${fonts.bodySize};
          line-height: 1.5;
          color: #333333;
          text-align: justify;
        }

        .item {
          margin-bottom: ${spacing.itemSpacing}px;
          padding: 12px;
          border: 1px solid #E0E0E0;
          border-radius: 6px;
          background-color: #FAFAFA;
        }

        .item:last-child {
          margin-bottom: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .item-title {
          font-size: ${fonts.itemTitleSize};
          font-weight: 600;
          color: #2E7D32;
          margin: 0 0 3px 0;
          line-height: 1.2;
        }

        .item-subtitle {
          font-size: ${fonts.bodySize};
          font-weight: 500;
          color: #666666;
          margin: 0;
          line-height: 1.2;
        }

        .item-date {
          font-size: ${fonts.smallSize};
          color: #4CAF50;
          white-space: nowrap;
          font-weight: 600;
          line-height: 1.2;
        }

        .item-location {
          font-size: ${fonts.smallSize};
          color: #888888;
          margin-bottom: 6px;
        }

        .item-description {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #333333;
          white-space: pre-line;
          text-align: justify;
        }

        .skills-box {
          padding: 12px;
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 6px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-chip {
          display: inline-block;
          padding: 6px 12px;
          border: 2px solid #4CAF50;
          border-radius: 16px;
          font-size: ${fonts.smallSize};
          color: #2E7D32;
          background-color: white;
          font-weight: 500;
          line-height: 1.2;
        }

        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-bottom: 6px;
        }

        .tech-chip {
          display: inline-block;
          padding: 3px 8px;
          background-color: #4CAF50;
          color: white;
          border-radius: 10px;
          font-size: ${fonts.smallSize};
          font-weight: 500;
          line-height: 1.2;
        }

        .hobbies-box {
          padding: 12px;
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 6px;
        }

        .hobbies-text {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #333333;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 10mm;
            page-break-inside: avoid;
            min-height: auto;
          }
          .section {
            page-break-inside: avoid;
          }
          .item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || ''}</h1>
          <div class="subtitle">Fresh Graduate | Aspiring Professional</div>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span>✉ ${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span>☎ ${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span>📍 ${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="contact-links">
            ${resumeData.personalDetails?.linkedin ? `<span>LinkedIn: ${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.github ? `<span>GitHub: ${resumeData.personalDetails.github.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span>Portfolio: ${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="section">
            <h2 class="section-title">CAREER OBJECTIVE</h2>
            <div class="objective-box">
              <div class="summary-text">${resumeData.summary}</div>
            </div>
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">EDUCATION</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${edu.degree || ''}</h3>
                    <div class="item-subtitle">${edu.institution || ''}</div>
                    ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
                ${edu.gpa ? `<div style="font-size: ${fonts.bodySize}; color: #333333; margin-bottom: 6px;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
                ${edu.achievements ? `<div style="font-size: ${fonts.bodySize}; color: #333333; line-height: 1.4;"><strong>Achievements:</strong> ${edu.achievements}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">ACADEMIC PROJECTS</h2>
            ${resumeData.projects.map(project => `
              <div class="item">
                <div class="item-header">
                  <h3 class="item-title">${project.name || ''}</h3>
                  ${project.duration ? `<div style="color: #888888; font-size: ${fonts.smallSize};">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `
                  <div style="margin-bottom: 6px;">
                    <div style="font-size: ${fonts.smallSize}; color: #666666; margin-bottom: 3px;"><strong>Technologies Used:</strong></div>
                    <div class="tech-chips">
                      ${project.technologies.split(',').map(tech => `<span class="tech-chip">${tech.trim()}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
                ${project.link ? `<div style="font-size: ${fonts.smallSize}; color: #4CAF50;"><strong>Project Link:</strong> ${project.link}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">TECHNICAL SKILLS</h2>
            <div class="skills-box">
              <div class="skills-container">
                ${resumeData.skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">INTERNSHIPS & EXPERIENCE</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${exp.jobTitle || ''}</h3>
                    <div class="item-subtitle">${exp.company || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                ${exp.responsibilities ? `<div class="item-description">${exp.responsibilities}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">ACHIEVEMENTS & CERTIFICATIONS</h2>
            ${resumeData.achievements.map(achievement => `
              <div style="margin-bottom: 12px; padding: 12px; background-color: #FAFAFA; border-radius: 4px;">
                <h3 style="font-weight: 600; font-size: ${fonts.itemTitleSize}; color: #2E7D32; margin: 0 0 3px 0;">🏆 ${achievement.title || ''}</h3>
                ${achievement.organization ? `<div style="color: #666666; font-size: ${fonts.bodySize}; margin-bottom: 3px;">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div style="font-size: ${fonts.bodySize}; color: #333333;">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
          <div class="section">
            <h2 class="section-title">HOBBIES & INTERESTS</h2>
            <div class="hobbies-box">
              <div class="hobbies-text">${resumeData.hobbies.join(' • ')}</div>
            </div>
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}

// Minimal Elegant Template
function generateMinimalElegantHTML(resumeData, formatDate) {
  const spacing = calculateDynamicSpacing(resumeData);
  const fonts = getDynamicFontSizes(resumeData);
  
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Playfair Display", "Georgia", serif;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #2c2c2c;
          line-height: 1.5;
        }
        
        .container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          background-color: white;
          padding: 20mm;
          box-sizing: border-box;
          min-height: auto;
        }

        .header {
          text-align: center;
          margin-bottom: ${spacing.baseSpacing + 8}px;
        }

        .name {
          font-size: ${fonts.nameSize === '2rem' ? '2.5rem' : '3rem'};
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 12px;
          margin-top: 0;
          letter-spacing: 2px;
          font-family: "Playfair Display", serif;
          line-height: 1.1;
        }

        .divider-line {
          width: 50px;
          height: 1px;
          background-color: #d4af37;
          margin: 0 auto 20px auto;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 12px;
          font-size: ${fonts.bodySize};
          color: #666666;
          font-family: "Lato", sans-serif;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          font-size: ${fonts.smallSize};
          color: #d4af37;
          font-family: "Lato", sans-serif;
        }

        .section {
          margin-bottom: ${spacing.baseSpacing + 8}px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: ${fonts.sectionTitleSize === '1rem' ? '1.3rem' : '1.5rem'};
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: ${spacing.itemSpacing + 8}px;
          margin-top: 0;
          font-family: "Playfair Display", serif;
          text-align: center;
          position: relative;
          display: inline-block;
          width: 100%;
          line-height: 1.2;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 1px;
          background-color: #d4af37;
        }

        .summary-text {
          font-size: ${fonts.itemTitleSize};
          line-height: 1.6;
          color: #444444;
          max-width: 85%;
          margin: 0 auto;
          font-style: italic;
          font-family: "Lato", sans-serif;
          text-align: center;
        }

        .item {
          margin-bottom: ${spacing.itemSpacing + 4}px;
        }

        .item:last-child {
          margin-bottom: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .item-title {
          font-size: ${fonts.itemTitleSize};
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 3px 0;
          font-family: "Playfair Display", serif;
          line-height: 1.2;
        }

        .item-subtitle {
          font-size: ${fonts.bodySize};
          color: #d4af37;
          font-weight: 500;
          margin: 0;
          font-family: "Lato", sans-serif;
          line-height: 1.2;
        }

        .item-date {
          font-size: ${fonts.smallSize};
          color: #888888;
          white-space: nowrap;
          font-family: "Lato", sans-serif;
          text-align: right;
          line-height: 1.2;
        }

        .item-description {
          font-size: ${fonts.bodySize};
          line-height: 1.6;
          color: #444444;
          white-space: pre-line;
          text-align: justify;
          font-family: "Lato", sans-serif;
        }

        .skills-text {
          font-size: ${fonts.bodySize};
          line-height: 1.8;
          color: #444444;
          font-family: "Lato", sans-serif;
          text-align: center;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 15mm;
            page-break-inside: avoid;
            min-height: auto;
          }
          .section {
            page-break-inside: avoid;
          }
          .item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || ''}</h1>
          <div class="divider-line"></div>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span>${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span>${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span>${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="contact-links">
            ${resumeData.personalDetails?.linkedin ? `<span>${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span>${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary-text">${resumeData.summary}</div>
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${exp.jobTitle || ''}</h3>
                    <div class="item-subtitle">${exp.company || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} — ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                    ${exp.location ? `<br>${exp.location}` : ''}
                  </div>
                </div>
                ${exp.responsibilities ? `<div class="item-description">${exp.responsibilities}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Core Competencies</h2>
            <div class="skills-text">${resumeData.skills.join(' • ')}</div>
          </div>
        ` : ''}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Notable Projects</h2>
            ${resumeData.projects.map(project => `
              <div class="item">
                <div class="item-header">
                  <h3 class="item-title">${project.name || ''}</h3>
                  ${project.duration ? `<div style="color: #888888; font-size: ${fonts.smallSize}; font-family: 'Lato', sans-serif;">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `<div style="font-size: ${fonts.smallSize}; color: #d4af37; font-style: italic; font-family: 'Lato', sans-serif;">Technologies: ${project.technologies}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <h3 class="item-title">${edu.degree || ''}</h3>
                    <div class="item-subtitle">${edu.institution || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}
                    ${edu.location ? `<br>${edu.location}` : ''}
                  </div>
                </div>
                ${edu.gpa ? `<div style="font-size: ${fonts.smallSize}; color: #444444; font-family: 'Lato', sans-serif;">GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Achievements</h2>
            ${resumeData.achievements.map(achievement => `
              <div class="item">
                <h3 class="item-title">${achievement.title || ''}</h3>
                ${achievement.organization ? `<div style="color: #d4af37; font-size: ${fonts.smallSize}; margin-bottom: 3px; font-family: 'Lato', sans-serif;">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div style="font-size: ${fonts.smallSize}; color: #444444; font-family: 'Lato', sans-serif;">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}