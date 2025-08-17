export const generateResumeHTML = (resumeData, selectedTemplate = null) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Helper function to format links - ATS friendly
  const formatLink = (url, type) => {
    if (!url) return '';
    
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

  // Template-specific styles and layouts
  const getTemplateStyles = (templateId) => {
    switch (templateId) {
      case 'classic-executive':
        return {
          fontFamily: '"Times New Roman", "Times", serif',
          headerStyle: `
            text-align: center;
            margin-bottom: ${layout.sectionSpacing};
            padding-bottom: ${layout.itemSpacing};
            border-bottom: 2px solid #000000;
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: bold;
            color: #000000;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            line-height: 1.1;
          `,
          sectionTitleStyle: `
            font-weight: bold;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            padding-bottom: 4px;
            line-height: 1.2;
          `,
          additionalStyles: `
            .executive-subtitle {
              color: #000000;
              margin-bottom: 16px;
              font-size: ${layout.bodySize};
              font-style: italic;
            }
          `
        };

      case 'tech-focused':
        return {
          fontFamily: '"Arial", "Helvetica", sans-serif',
          headerStyle: `
            margin-bottom: ${layout.sectionSpacing};
            position: relative;
            padding-left: 16px;
            border-left: 4px solid #000000;
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            line-height: 1.2;
          `,
          sectionTitleStyle: `
            font-weight: bold;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            text-transform: uppercase;
            line-height: 1.2;
          `,
          additionalStyles: `
            .tech-subtitle {
              color: #333333;
              margin-bottom: 16px;
              font-size: ${layout.bodySize};
              font-weight: bold;
            }
            .tech-experience-item {
              margin-bottom: ${layout.itemSpacing};
              position: relative;
              padding-left: 16px;
              border-left: 2px solid #cccccc;
            }
          `
        };

      case 'fresh-graduate':
        return {
          fontFamily: '"Arial", "Helvetica", sans-serif',
          headerStyle: `
            text-align: center;
            margin-bottom: ${layout.sectionSpacing};
            padding-bottom: ${layout.itemSpacing};
            border-bottom: 2px solid #000000;
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            letter-spacing: 1px;
          `,
          sectionTitleStyle: `
            font-weight: bold;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            padding-bottom: 4px;
          `,
          additionalStyles: `
            .fresh-subtitle {
              color: #333333;
              margin-bottom: 16px;
              font-size: ${layout.bodySize};
              font-style: italic;
            }
            .fresh-section-item {
              margin-bottom: ${layout.itemSpacing};
              padding: 12px;
              border: 1px solid #cccccc;
            }
          `
        };

      case 'minimal-elegant':
        return {
          fontFamily: '"Arial", "Helvetica", sans-serif',
          headerStyle: `
            text-align: center;
            margin-bottom: ${layout.sectionSpacing};
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: normal;
            color: #000000;
            margin-bottom: 16px;
            letter-spacing: 2px;
            font-family: "Times New Roman", serif;
          `,
          sectionTitleStyle: `
            font-weight: normal;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            font-family: "Times New Roman", serif;
            text-align: center;
            position: relative;
            display: inline-block;
            width: 100%;
          `,
          additionalStyles: `
            .minimal-divider {
              width: 60px;
              height: 1px;
              background-color: #000000;
              margin: 0 auto 24px auto;
            }
            .minimal-section-divider {
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 40px;
              height: 1px;
              background-color: #000000;
            }
          `
        };

      default: // modern-professional
        return {
          fontFamily: '"Arial", "Helvetica", sans-serif',
          headerStyle: `
            text-align: center;
            margin-bottom: ${layout.sectionSpacing};
            padding-bottom: ${layout.itemSpacing};
            border-bottom: 1px solid #cccccc;
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            line-height: 1.2;
          `,
          sectionTitleStyle: `
            font-size: ${layout.sectionTitleSize};
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: ${layout.itemSpacing};
            padding-bottom: 4px;
            border-bottom: 1px solid #cccccc;
            line-height: 1.2;
          `,
          additionalStyles: ''
        };
    }
  };

  const templateId = selectedTemplate?.id || 'modern-professional';
  const templateStyles = getTemplateStyles(templateId);

  // Generate template-specific content
  const generateTemplateContent = () => {
    const baseContent = {
      header: `
        <div class="header" style="${templateStyles.headerStyle}">
          <h1 class="name" style="${templateStyles.nameStyle}">
            ${resumeData.personalDetails?.fullName || 'Your Name'}
          </h1>
          ${templateId === 'classic-executive' ? `
            <div class="executive-subtitle">Executive Professional</div>
          ` : templateId === 'tech-focused' ? `
            <div class="tech-subtitle">Software Developer</div>
          ` : templateId === 'fresh-graduate' ? `
            <div class="fresh-subtitle">Fresh Graduate | Aspiring Professional</div>
          ` : ''}
          ${templateId === 'minimal-elegant' ? `<div class="minimal-divider"></div>` : ''}
          
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
      `,
      
      summary: resumeData.summary ? `
        <div class="section">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'fresh-graduate' ? 'CAREER OBJECTIVE' : 
              templateId === 'classic-executive' ? 'Executive Summary' : 'Professional Summary'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${templateId === 'fresh-graduate' ? `
            <div style="border: 1px solid #cccccc; padding: 12px; background-color: #ffffff;">
              <div class="summary-text">${resumeData.summary}</div>
            </div>
          ` : `
            <div class="summary-text">${resumeData.summary}</div>
          `}
        </div>
      ` : '',

      experience: resumeData.experience && resumeData.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'fresh-graduate' ? 'INTERNSHIPS & EXPERIENCE' : 'Professional Experience'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${resumeData.experience.map(exp => `
            <div class="section-item ${templateId === 'tech-focused' ? 'tech-experience-item' : templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}">
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
      ` : '',

      skills: resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'tech-focused' ? 'TECHNICAL SKILLS' : 
              templateId === 'fresh-graduate' ? 'TECHNICAL SKILLS' : 'Core Competencies'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${templateId === 'tech-focused' ? generateTechSkills(resumeData.skills) : 
            templateId === 'fresh-graduate' ? `
              <div style="padding: 12px; border: 1px solid #cccccc;">
                <div class="skills-text">${resumeData.skills.join(' • ')}</div>
              </div>
            ` : `
              <div class="skills-container">
                <div class="skills-text">${resumeData.skills.join(' • ')}</div>
              </div>
            `}
        </div>
      ` : ''
    };

    return baseContent;
  };

  // Generate tech-focused skills categorization
  const generateTechSkills = (skills) => {
    const categories = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Other Skills': []
    };

    const programmingKeywords = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'sql', 'html', 'css'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'bootstrap', 'jquery'];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack', 'babel', 'npm', 'yarn', 'mongodb', 'mysql', 'postgresql'];

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

    return Object.entries(categories)
      .filter(([_, skills]) => skills.length > 0)
      .map(([category, skills]) => `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${layout.bodySize}; font-weight: bold; color: #000000; margin-bottom: 4px;">
            ${category}:
          </div>
          <div style="font-size: ${layout.bodySize}; color: #000000; line-height: 1.4;">
            ${skills.join(' • ')}
          </div>
        </div>
      `).join('');
  };

  const content = generateTemplateContent();

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
          font-family: ${templateStyles.fontFamily};
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
        
        /* Contact Info Styles */
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
        
        /* Template-specific styles */
        ${templateStyles.additionalStyles}
        
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
      </style>
    </head>
    <body>
      <div class="resume-container">
        ${content.header}

        ${content.summary}

        ${templateId === 'fresh-graduate' ? 
          // Education first for fresh graduates
          (resumeData.education && resumeData.education.length > 0 ? `
            <div class="section">
              <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">EDUCATION</h2>
              ${resumeData.education.map(edu => `
                <div class="fresh-section-item">
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
          ` : '') :
          // Experience first for others
          content.experience
        }

        ${content.skills}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              ${templateId === 'fresh-graduate' ? 'ACADEMIC PROJECTS' : 
                templateId === 'classic-executive' ? 'Notable Projects' : 'Key Projects'}
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${resumeData.projects.map(project => `
              <div class="section-item ${templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}">
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

        ${templateId !== 'fresh-graduate' ? 
          // Education for non-fresh graduates
          (resumeData.education && resumeData.education.length > 0 ? `
            <div class="section">
              <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
                Education
                ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
              </h2>
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
          ` : '') :
          content.experience
        }

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              ${templateId === 'classic-executive' ? 'Professional Achievements' : 'Achievements & Certifications'}
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${resumeData.achievements.map(achievement => `
              <div class="section-item ${templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}">
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

        ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
          <div class="section">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              Hobbies & Interests
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${templateId === 'fresh-graduate' ? `
              <div style="padding: 12px; border: 1px solid #cccccc;">
                <div class="hobbies-text">${resumeData.hobbies.join(' • ')}</div>
              </div>
            ` : `
              <div class="hobbies-text">${resumeData.hobbies.join(' • ')}</div>
            `}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};