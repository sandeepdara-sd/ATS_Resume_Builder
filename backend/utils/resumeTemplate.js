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

// Modern Professional Template
function generateModernProfessionalHTML(resumeData, formatDate) {
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
          line-height: 1.6;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 20mm;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .name {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
          margin-top: 0;
          letter-spacing: -0.5px;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: #3182ce;
        }

        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 24px 0;
          border-width: 1px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 16px;
          margin-top: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .summary-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #4a5568;
        }

        .item {
          margin-bottom: 16px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 4px 0;
        }

        .item-subtitle {
          font-size: 0.9rem;
          font-weight: 500;
          color: #3182ce;
          margin: 0;
        }

        .item-date {
          font-size: 0.85rem;
          color: #718096;
          white-space: nowrap;
          font-weight: 500;
        }

        .item-location {
          font-size: 0.85rem;
          color: #718096;
          margin-bottom: 8px;
        }

        .item-description {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #4a5568;
          white-space: pre-line;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-chip {
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #4a5568;
          background-color: #f7fafc;
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
                ${project.technologies ? `<div style="font-size: 0.8rem; color: #718096; margin-top: 4px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
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
                ${edu.gpa ? `<div style="font-size: 0.85rem; color: #4a5568;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
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
            <div style="font-size: 0.85rem; line-height: 1.6; color: #4a5568;">
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
          line-height: 1.5;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 25mm;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }

        .name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #000000;
          margin-bottom: 16px;
          margin-top: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 16px;
          font-size: 1rem;
          color: #000000;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
          font-size: 0.9rem;
          color: #000000;
        }

        .section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: #000000;
          margin-bottom: 16px;
          margin-top: 0;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
          padding-bottom: 8px;
        }

        .summary-text {
          font-size: 1rem;
          line-height: 1.6;
          color: #000000;
          text-align: justify;
        }

        .item {
          margin-bottom: 24px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #000000;
          margin: 0 0 4px 0;
        }

        .item-subtitle {
          font-size: 1rem;
          font-weight: bold;
          color: #000000;
          margin: 0;
          font-style: italic;
        }

        .item-date {
          font-size: 1rem;
          color: #000000;
          white-space: nowrap;
          font-weight: bold;
          text-align: right;
        }

        .item-location {
          font-size: 0.9rem;
          color: #000000;
          margin-bottom: 8px;
        }

        .item-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #000000;
          white-space: pre-line;
          text-align: justify;
          margin-top: 8px;
        }

        .skills-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #000000;
        }

        @media print {
          body {
            background-color: white;
            margin: 0;
          }
          .container {
            box-shadow: none;
            padding: 20mm;
            page-break-inside: avoid;
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
                    ${edu.gpa ? `<div style="font-size: 0.9rem; color: #000000;">GPA: ${edu.gpa}</div>` : ''}
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
                ${project.technologies ? `<div style="font-size: 0.9rem; color: #000000; margin-top: 4px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
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
          line-height: 1.6;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 20mm;
          box-sizing: border-box;
        }

        .header {
          margin-bottom: 30px;
          position: relative;
          padding-left: 20px;
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
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
          margin-top: 0;
          font-family: "Inter", sans-serif;
        }

        .job-title {
          color: #00d9ff;
          margin-bottom: 16px;
          font-size: 1.1rem;
          font-weight: 500;
          font-family: "Inter", sans-serif;
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: #00d9ff;
        }

        .section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 16px;
          margin-top: 0;
          font-family: "Inter", sans-serif;
          display: flex;
          align-items: center;
        }

        .section-title::before {
          content: '';
          width: 20px;
          height: 2px;
          background-color: #00d9ff;
          margin-right: 12px;
        }

        .summary-box {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          font-family: "Inter", sans-serif;
        }

        .summary-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #4a5568;
        }

        .item {
          margin-bottom: 20px;
          position: relative;
          padding-left: 20px;
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
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 4px 0;
          font-family: "Inter", sans-serif;
        }

        .item-subtitle {
          font-size: 0.9rem;
          font-weight: 500;
          color: #00d9ff;
          margin: 0;
          font-family: "Inter", sans-serif;
        }

        .item-date {
          background-color: #00d9ff;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .item-location {
          font-size: 0.85rem;
          color: #718096;
          margin-bottom: 8px;
        }

        .item-description {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #4a5568;
          white-space: pre-line;
          font-family: "Inter", sans-serif;
        }

        .skill-category {
          margin-bottom: 16px;
        }

        .skill-category-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          font-family: "Inter", sans-serif;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-chip {
          display: inline-block;
          padding: 4px 12px;
          background-color: #00d9ff;
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          font-family: "Fira Code", monospace;
        }

        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }

        .tech-chip {
          display: inline-block;
          padding: 2px 8px;
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 3px;
          font-size: 0.7rem;
          color: #4a5568;
          font-family: "Fira Code", monospace;
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
                  ${project.duration ? `<div style="color: #718096; font-size: 0.8rem;">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `
                  <div class="tech-chips">
                    ${project.technologies.split(',').map(tech => `<span class="tech-chip">${tech.trim()}</span>`).join('')}
                  </div>
                ` : ''}
                ${project.link ? `<div style="font-size: 0.8rem; color: #00d9ff;">🔗 ${project.link}</div>` : ''}
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
                  <div style="color: #718096; font-size: 0.8rem;">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
                ${edu.gpa ? `<div style="font-size: 0.85rem; color: #4a5568; font-family: 'Inter', sans-serif;">GPA: ${edu.gpa}</div>` : ''}
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
          line-height: 1.6;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 20mm;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #4CAF50;
        }

        .name {
          font-size: 2.4rem;
          font-weight: 700;
          color: #2E7D32;
          margin-bottom: 8px;
          margin-top: 0;
          letter-spacing: 1px;
        }

        .subtitle {
          color: #666666;
          margin-bottom: 16px;
          font-size: 1rem;
          font-style: italic;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 0.9rem;
          color: #555555;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: #4CAF50;
        }

        .section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2E7D32;
          margin-bottom: 16px;
          margin-top: 0;
          display: flex;
          align-items: center;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background-color: #4CAF50;
          margin-right: 12px;
        }

        .objective-box {
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 8px;
          padding: 20px;
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #333333;
          text-align: justify;
        }

        .item {
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid #E0E0E0;
          border-radius: 6px;
          background-color: #FAFAFA;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2E7D32;
          margin: 0 0 4px 0;
        }

        .item-subtitle {
          font-size: 1rem;
          font-weight: 500;
          color: #666666;
          margin: 0;
        }

        .item-date {
          font-size: 0.9rem;
          color: #4CAF50;
          white-space: nowrap;
          font-weight: 600;
        }

        .item-location {
          font-size: 0.9rem;
          color: #888888;
          margin-bottom: 8px;
        }

        .item-description {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #333333;
          white-space: pre-line;
          text-align: justify;
        }

        .skills-box {
          padding: 16px;
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 6px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-chip {
          display: inline-block;
          padding: 8px 16px;
          border: 2px solid #4CAF50;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #2E7D32;
          background-color: white;
          font-weight: 500;
        }

        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }

        .tech-chip {
          display: inline-block;
          padding: 4px 12px;
          background-color: #4CAF50;
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .hobbies-box {
          padding: 16px;
          background-color: #F1F8E9;
          border: 1px solid #C8E6C9;
          border-radius: 6px;
        }

        .hobbies-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #333333;
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
                ${edu.gpa ? `<div style="font-size: 0.9rem; color: #333333; margin-bottom: 8px;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
                ${edu.achievements ? `<div style="font-size: 0.9rem; color: #333333; line-height: 1.6;"><strong>Achievements:</strong> ${edu.achievements}</div>` : ''}
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
                  ${project.duration ? `<div style="color: #888888; font-size: 0.85rem;">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `
                  <div style="margin-bottom: 8px;">
                    <div style="font-size: 0.85rem; color: #666666; margin-bottom: 4px;"><strong>Technologies Used:</strong></div>
                    <div class="tech-chips">
                      ${project.technologies.split(',').map(tech => `<span class="tech-chip">${tech.trim()}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
                ${project.link ? `<div style="font-size: 0.85rem; color: #4CAF50;"><strong>Project Link:</strong> ${project.link}</div>` : ''}
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
              <div style="margin-bottom: 16px; padding: 16px; background-color: #FAFAFA; border-radius: 4px;">
                <h3 style="font-weight: 600; font-size: 0.95rem; color: #2E7D32; margin: 0 0 4px 0;">🏆 ${achievement.title || ''}</h3>
                ${achievement.organization ? `<div style="color: #666666; font-size: 0.9rem; margin-bottom: 4px;">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div style="font-size: 0.9rem; color: #333333;">${achievement.description}</div>` : ''}
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
          line-height: 1.7;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 25mm;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .name {
          font-size: 3rem;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 16px;
          margin-top: 0;
          letter-spacing: 2px;
          font-family: "Playfair Display", serif;
        }

        .divider-line {
          width: 60px;
          height: 1px;
          background-color: #d4af37;
          margin: 0 auto 24px auto;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 16px;
          font-size: 1rem;
          color: #666666;
          font-family: "Lato", sans-serif;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
          font-size: 0.9rem;
          color: #d4af37;
          font-family: "Lato", sans-serif;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 24px;
          margin-top: 0;
          font-family: "Playfair Display", serif;
          text-align: center;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 1px;
          background-color: #d4af37;
        }

        .summary-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #444444;
          max-width: 80%;
          margin: 0 auto;
          font-style: italic;
          font-family: "Lato", sans-serif;
          text-align: center;
        }

        .item {
          margin-bottom: 24px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          font-family: "Playfair Display", serif;
        }

        .item-subtitle {
          font-size: 1rem;
          color: #d4af37;
          font-weight: 500;
          margin: 0;
          font-family: "Lato", sans-serif;
        }

        .item-date {
          font-size: 0.9rem;
          color: #888888;
          white-space: nowrap;
          font-family: "Lato", sans-serif;
          text-align: right;
        }

        .item-description {
          font-size: 1rem;
          line-height: 1.8;
          color: #444444;
          white-space: pre-line;
          text-align: justify;
          font-family: "Lato", sans-serif;
        }

        .skills-text {
          font-size: 1rem;
          line-height: 2;
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
            padding: 20mm;
            page-break-inside: avoid;
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
                  ${project.duration ? `<div style="color: #888888; font-size: 0.9rem; font-family: 'Lato', sans-serif;">${project.duration}</div>` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies ? `<div style="font-size: 0.9rem; color: #d4af37; font-style: italic; font-family: 'Lato', sans-serif;">Technologies: ${project.technologies}</div>` : ''}
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
                ${edu.gpa ? `<div style="font-size: 0.9rem; color: #444444; font-family: 'Lato', sans-serif;">GPA: ${edu.gpa}</div>` : ''}
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
                ${achievement.organization ? `<div style="color: #d4af37; font-size: 0.9rem; margin-bottom: 4px; font-family: 'Lato', sans-serif;">${achievement.organization}</div>` : ''}
                ${achievement.description ? `<div style="font-size: 0.9rem; color: #444444; font-family: 'Lato', sans-serif;">${achievement.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}