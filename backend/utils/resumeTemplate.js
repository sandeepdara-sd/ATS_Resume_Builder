export const generateResumeHTML = (resumeData) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Calculate dynamic spacing and font sizes based on content
  const calculateDynamicSpacing = () => {
    let contentSections = 0;
    
    if (resumeData.summary) contentSections++;
    if (resumeData.experience?.length > 0) contentSections++;
    if (resumeData.projects?.length > 0) contentSections++;
    if (resumeData.education?.length > 0) contentSections++;
    if (resumeData.skills?.length > 0) contentSections++;
    if (resumeData.achievements?.length > 0) contentSections++;
    if (resumeData.hobbies?.length > 0) contentSections++;
    
    const baseSpacing = contentSections <= 4 ? '24px' : contentSections <= 6 ? '18px' : '12px';
    const itemSpacing = contentSections <= 4 ? '16px' : contentSections <= 6 ? '12px' : '8px';
    
    return { baseSpacing, itemSpacing };
  };

  const getDynamicFontSizes = () => {
    let totalItems = 0;
    
    if (resumeData.experience) totalItems += resumeData.experience.length;
    if (resumeData.projects) totalItems += resumeData.projects.length;
    if (resumeData.education) totalItems += resumeData.education.length;
    if (resumeData.achievements) totalItems += resumeData.achievements.length;
    
    const isContentHeavy = totalItems > 8;
    
    return {
      nameSize: isContentHeavy ? '28px' : '32px',
      sectionTitleSize: isContentHeavy ? '16px' : '18px',
      itemTitleSize: isContentHeavy ? '14px' : '16px',
      bodySize: isContentHeavy ? '12px' : '14px',
      smallSize: isContentHeavy ? '11px' : '12px'
    };
  };

  const spacing = calculateDynamicSpacing();
  const fonts = getDynamicFontSizes();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resumeData.personalDetails?.fullName || 'Resume'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', 'Arial', sans-serif;
          line-height: 1.4;
          color: #2d3748;
          background-color: white;
          font-size: ${fonts.bodySize};
        }
        
        .resume-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 15mm;
          background: white;
          min-height: 297mm;
        }
        
        .header {
          text-align: center;
          margin-bottom: ${spacing.baseSpacing};
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: ${spacing.itemSpacing};
        }
        
        .name {
          font-size: ${fonts.nameSize};
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .contact-item {
          color: #4a5568;
          font-size: ${fonts.smallSize};
        }
        
        .links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .link-item {
          color: #3182ce;
          font-size: ${fonts.smallSize};
          text-decoration: none;
        }
        
        .section {
          margin-bottom: ${spacing.baseSpacing};
        }
        
        .section-title {
          font-size: ${fonts.sectionTitleSize};
          font-weight: 600;
          color: #2d3748;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: ${spacing.itemSpacing};
          line-height: 1.2;
        }
        
        .section-item {
          margin-bottom: ${spacing.itemSpacing};
        }
        
        .section-item:last-child {
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
          line-height: 1.2;
        }
        
        .item-subtitle {
          color: #3182ce;
          font-weight: 500;
          font-size: ${fonts.bodySize};
          line-height: 1.2;
        }
        
        .item-date {
          color: #718096;
          font-size: ${fonts.smallSize};
          font-weight: 500;
          line-height: 1.2;
        }
        
        .item-location {
          color: #718096;
          font-size: ${fonts.smallSize};
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
        
        .skill-item {
          display: inline-block;
          padding: 4px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: ${fonts.smallSize};
          color: #4a5568;
          background-color: #f7fafc;
          line-height: 1.2;
        }
        
        .summary-text {
          font-size: ${fonts.bodySize};
          line-height: 1.5;
          color: #4a5568;
        }
        
        .hobbies-text {
          font-size: ${fonts.bodySize};
          line-height: 1.4;
          color: #4a5568;
        }
        
        @media print {
          .resume-container {
            margin: 0;
            padding: 10mm;
            box-shadow: none;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <!-- Header -->
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || 'Your Name'}</h1>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span class="contact-item">${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span class="contact-item">${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span class="contact-item">${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="links">
            ${resumeData.personalDetails?.linkedin ? `<span class="link-item">LinkedIn: ${resumeData.personalDetails.linkedin.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.github ? `<span class="link-item">GitHub: ${resumeData.personalDetails.github.replace('https://', '')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span class="link-item">Portfolio: ${resumeData.personalDetails.website.replace('https://', '')}</span>` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${resumeData.summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="summary-text">${resumeData.summary}</div>
        </div>
        ` : ''}

        <!-- Experience -->
        ${resumeData.experience && resumeData.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Professional Experience</h2>
          ${resumeData.experience.map(exp => `
            <div class="section-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.jobTitle}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-date">${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}</div>
              </div>
              ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
              <div class="item-description">${exp.responsibilities}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Core Competencies</h2>
          <div class="skills-container">
            ${resumeData.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Projects -->
        ${resumeData.projects && resumeData.projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Key Projects</h2>
          ${resumeData.projects.map(project => `
            <div class="section-item">
              <div class="item-header">
                <div class="item-title">${project.name}</div>
                ${project.duration ? `<div class="item-date">${project.duration}</div>` : ''}
              </div>
              <div class="item-description">${project.description}</div>
              ${project.technologies ? `<div class="item-location"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${resumeData.education && resumeData.education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${resumeData.education.map(edu => `
            <div class="section-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.institution}</div>
                </div>
                <div class="item-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              </div>
              ${edu.gpa ? `<div class="item-location"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Achievements -->
        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Achievements & Certifications</h2>
          ${resumeData.achievements.map(achievement => `
            <div class="section-item">
              <div class="item-title">${achievement.title}</div>
              ${achievement.organization ? `<div class="item-subtitle">${achievement.organization}</div>` : ''}
              ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Hobbies -->
        ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Hobbies & Interests</h2>
          <div class="hobbies-text">${resumeData.hobbies.join(' • ')}</div>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};