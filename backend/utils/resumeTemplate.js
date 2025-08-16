export const generateResumeHTML = (resumeData) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Helper function to format links - ATS friendly
  const formatLink = (url, type) => {
    if (!url) return '';
    
    // Remove protocol for cleaner display but keep full URL for ATS parsing
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    switch (type) {
      case 'linkedin':
        if (cleanUrl.includes('linkedin.com')) {
          return cleanUrl;
        }
        return `linkedin.com/in/${cleanUrl}`;
      case 'github':
        if (cleanUrl.includes('github.com')) {
          return cleanUrl;
        }
        return `github.com/${cleanUrl}`;
      case 'website':
        return cleanUrl;
      default:
        return cleanUrl;
    }
  };

  // Calculate optimal spacing based on content density
  const calculateOptimalLayout = () => {
    let totalSections = 0;
    let totalItems = 0;
    
    if (resumeData.summary) totalSections++;
    if (resumeData.experience?.length > 0) {
      totalSections++;
      totalItems += resumeData.experience.length;
    }
    if (resumeData.projects?.length > 0) {
      totalSections++;
      totalItems += resumeData.projects.length;
    }
    if (resumeData.education?.length > 0) {
      totalSections++;
      totalItems += resumeData.education.length;
    }
    if (resumeData.skills?.length > 0) totalSections++;
    if (resumeData.achievements?.length > 0) {
      totalSections++;
      totalItems += resumeData.achievements.length;
    }
    if (resumeData.hobbies?.length > 0) totalSections++;
    
    // Determine if content is dense
    const isContentDense = totalSections > 6 || totalItems > 12;
    
    return {
      sectionSpacing: isContentDense ? '16px' : '20px',
      itemSpacing: isContentDense ? '10px' : '14px',
      nameSize: isContentDense ? '24px' : '28px',
      sectionTitleSize: isContentDense ? '14px' : '16px',
      itemTitleSize: isContentDense ? '13px' : '14px',
      bodySize: isContentDense ? '11px' : '12px',
      smallSize: isContentDense ? '10px' : '11px',
      lineHeight: isContentDense ? '1.3' : '1.4'
    };
  };

  const layout = calculateOptimalLayout();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resumeData.personalDetails?.fullName || 'Resume'}</title>
      <style>
        /* ATS-Friendly Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* ATS-Optimized Body Styles */
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: ${layout.bodySize};
          line-height: ${layout.lineHeight};
          color: #000000;
          background-color: #ffffff;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Container - ATS Friendly Dimensions */
        .resume-container {
          width: 8.5in;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
          background: #ffffff;
          min-height: 11in;
          position: relative;
        }
        
        /* Header Section - ATS Optimized */
        .header {
          text-align: center;
          margin-bottom: ${layout.sectionSpacing};
          padding-bottom: ${layout.itemSpacing};
          border-bottom: 1px solid #cccccc;
        }
        
        .name {
          font-size: ${layout.nameSize};
          font-weight: bold;
          color: #000000;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: none;
          line-height: 1.2;
        }
        
        .contact-info {
          margin-bottom: 6px;
        }
        
        .contact-item {
          color: #333333;
          font-size: ${layout.smallSize};
          margin: 0 8px;
          display: inline;
        }
        
        .contact-item:first-child {
          margin-left: 0;
        }
        
        .links {
          margin-top: 4px;
        }
        
        .link-item {
          color: #000000;
          font-size: ${layout.smallSize};
          margin: 0 8px;
          display: inline;
          text-decoration: none;
        }
        
        .link-item:first-child {
          margin-left: 0;
        }
        
        /* Section Styles - ATS Friendly */
        .section {
          margin-bottom: ${layout.sectionSpacing};
          page-break-inside: avoid;
        }
        
        .section:last-child {
          margin-bottom: 0;
        }
        
        .section-title {
          font-size: ${layout.sectionTitleSize};
          font-weight: bold;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: ${layout.itemSpacing};
          padding-bottom: 4px;
          border-bottom: 1px solid #cccccc;
          line-height: 1.2;
        }
        
        /* Item Styles */
        .section-item {
          margin-bottom: ${layout.itemSpacing};
          page-break-inside: avoid;
        }
        
        .section-item:last-child {
          margin-bottom: 0;
        }
        
        .item-header {
          margin-bottom: 6px;
        }
        
        .item-title {
          font-size: ${layout.itemTitleSize};
          font-weight: bold;
          color: #000000;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        
        .item-subtitle {
          color: #333333;
          font-weight: bold;
          font-size: ${layout.bodySize};
          line-height: 1.2;
          margin-bottom: 2px;
        }
        
        .item-date {
          color: #666666;
          font-size: ${layout.smallSize};
          font-weight: normal;
          float: right;
          line-height: 1.2;
        }
        
        .item-location {
          color: #666666;
          font-size: ${layout.smallSize};
          margin-bottom: 4px;
          font-style: italic;
        }
        
        .item-description {
          font-size: ${layout.bodySize};
          line-height: ${layout.lineHeight};
          color: #000000;
          text-align: justify;
          margin-top: 4px;
        }
        
        /* Skills Section - ATS Optimized */
        .skills-container {
          line-height: 1.6;
        }
        
        .skills-text {
          font-size: ${layout.bodySize};
          color: #000000;
          line-height: 1.5;
        }
        
        /* Summary Text */
        .summary-text {
          font-size: ${layout.bodySize};
          line-height: 1.5;
          color: #000000;
          text-align: justify;
        }
        
        /* Hobbies Text */
        .hobbies-text {
          font-size: ${layout.bodySize};
          line-height: 1.4;
          color: #000000;
        }
        
        /* Clear floats */
        .clearfix::after {
          content: "";
          display: table;
          clear: both;
        }
        
        /* Print Optimization */
        @media print {
          .resume-container {
            margin: 0;
            padding: 0.5in;
            box-shadow: none;
            width: 8.5in;
            max-width: 8.5in;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .section {
            page-break-inside: avoid;
          }
          
          .section-item {
            page-break-inside: avoid;
          }
          
          .item-header {
            page-break-inside: avoid;
          }
        }
        
        /* Page Setup */
        @page {
          margin: 0.5in;
          size: letter;
        }
        
        /* ATS-Friendly Table Styles (if needed) */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: ${layout.itemSpacing};
        }
        
        td, th {
          padding: 4px 8px;
          text-align: left;
          border: none;
          font-size: ${layout.bodySize};
        }
        
        /* Ensure no background colors that might interfere with ATS */
        .no-background {
          background: transparent !important;
          background-color: transparent !important;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <!-- Header Section -->
        <div class="header">
          <h1 class="name">${resumeData.personalDetails?.fullName || 'Your Name'}</h1>
          
          <div class="contact-info">
            ${resumeData.personalDetails?.email ? `<span class="contact-item">${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span class="contact-item">${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span class="contact-item">${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="links">
            ${resumeData.personalDetails?.linkedin ? `<span class="link-item">LinkedIn: ${formatLink(resumeData.personalDetails.linkedin, 'linkedin')}</span>` : ''}
            ${resumeData.personalDetails?.github ? `<span class="link-item">GitHub: ${formatLink(resumeData.personalDetails.github, 'github')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span class="link-item">Portfolio: ${formatLink(resumeData.personalDetails.website, 'website')}</span>` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${resumeData.summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="summary-text">${resumeData.summary}</div>
        </div>
        ` : ''}

        <!-- Professional Experience -->
        ${resumeData.experience && resumeData.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Professional Experience</h2>
          ${resumeData.experience.map(exp => `
            <div class="section-item">
              <div class="item-header clearfix">
                <div class="item-title">${exp.jobTitle}</div>
                <div class="item-date">${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}</div>
              </div>
              <div class="item-subtitle">${exp.company}</div>
              ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
              <div class="item-description">${exp.responsibilities}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Core Competencies / Skills -->
        ${resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Core Competencies</h2>
          <div class="skills-container">
            <div class="skills-text">${resumeData.skills.join(' • ')}</div>
          </div>
        </div>
        ` : ''}

        <!-- Key Projects -->
        ${resumeData.projects && resumeData.projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Key Projects</h2>
          ${resumeData.projects.map(project => `
            <div class="section-item">
              <div class="item-header clearfix">
                <div class="item-title">${project.name}</div>
                ${project.duration ? `<div class="item-date">${project.duration}</div>` : ''}
              </div>
              <div class="item-description">${project.description}</div>
              ${project.technologies ? `<div class="item-location"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
              ${project.link ? `<div class="item-location"><strong>Link:</strong> ${formatLink(project.link, 'website')}</div>` : ''}
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
              <div class="item-header clearfix">
                <div class="item-title">${edu.degree}</div>
                <div class="item-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              </div>
              <div class="item-subtitle">${edu.institution}</div>
              ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
              ${edu.gpa ? `<div class="item-location"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
              ${edu.achievements ? `<div class="item-description">${edu.achievements}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Achievements & Certifications -->
        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Achievements & Certifications</h2>
          ${resumeData.achievements.map(achievement => `
            <div class="section-item">
              <div class="item-header clearfix">
                <div class="item-title">${achievement.title}</div>
                ${achievement.date ? `<div class="item-date">${formatDate(achievement.date)}</div>` : ''}
              </div>
              ${achievement.organization ? `<div class="item-subtitle">${achievement.organization}</div>` : ''}
              ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
              ${achievement.link ? `<div class="item-location"><strong>Link:</strong> ${formatLink(achievement.link, 'website')}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Hobbies & Interests -->
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