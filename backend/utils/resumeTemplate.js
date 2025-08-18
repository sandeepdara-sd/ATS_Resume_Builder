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

  // Calculate optimal layout based on content density
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
      nameSize: isContentDense ? '20px' : '24px',
      sectionTitleSize: isContentDense ? '12px' : '14px',
      itemTitleSize: isContentDense ? '11px' : '12px',
      bodySize: isContentDense ? '9px' : '10px',
      smallSize: isContentDense ? '8px' : '9px',
      lineHeight: isContentDense ? '1.3' : '1.4'
    };
  };

  // Template-specific styles and layouts
  const getTemplateStyles = (templateId) => {
    const layout = calculateOptimalLayout();
    
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
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            line-height: 1.1;
          `,
          sectionTitleStyle: `
            font-weight: bold;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
            line-height: 1.2;
          `,
          additionalStyles: `
            .executive-subtitle {
              color: #000000;
              margin-bottom: 12px;
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
            padding-left: 12px;
            border-left: 3px solid #000000;
          `,
          nameStyle: `
            font-size: ${layout.nameSize};
            font-weight: bold;
            color: #000000;
            margin-bottom: 6px;
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
              margin-bottom: 12px;
              font-size: ${layout.bodySize};
              font-weight: bold;
            }
            .tech-experience-item {
              margin-bottom: ${layout.itemSpacing};
              position: relative;
              padding-left: 12px;
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
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          `,
          sectionTitleStyle: `
            font-weight: bold;
            margin-bottom: ${layout.itemSpacing};
            color: #000000;
            font-size: ${layout.sectionTitleSize};
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          `,
          additionalStyles: `
            .fresh-subtitle {
              color: #333333;
              margin-bottom: 12px;
              font-size: ${layout.bodySize};
              font-style: italic;
            }
            .fresh-section-item {
              margin-bottom: ${layout.itemSpacing};
              padding: 8px;
              border: 1px solid #cccccc;
              background-color: #ffffff;
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
            margin-bottom: 12px;
            letter-spacing: 1.5px;
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
              width: 50px;
              height: 1px;
              background-color: #000000;
              margin: 0 auto 16px auto;
            }
            .minimal-section-divider {
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 30px;
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
            margin-bottom: 6px;
            letter-spacing: 0.3px;
            line-height: 1.2;
          `,
          sectionTitleStyle: `
            font-size: ${layout.sectionTitleSize};
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: ${layout.itemSpacing};
            padding-bottom: 3px;
            border-bottom: 1px solid #cccccc;
            line-height: 1.2;
          `,
          additionalStyles: ''
        };
    }
  };

  const templateId = selectedTemplate?.id || 'modern-professional';
  const templateStyles = getTemplateStyles(templateId);
  const layout = calculateOptimalLayout();

  // Generate tech-focused skills categorization
  const generateTechSkills = (skills, layout) => {
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
        <div style="margin-bottom: 8px;">
          <div style="font-size: ${layout.bodySize}; font-weight: bold; color: #000000; margin-bottom: 3px;">
            ${category}:
          </div>
          <div style="font-size: ${layout.bodySize}; color: #000000; line-height: 1.4;">
            ${skills.join(' • ')}
          </div>
        </div>
      `).join('');
  };

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
          
          <div class="contact-info" style="margin-bottom: 8px; text-align: center;">
            ${resumeData.personalDetails?.email ? `<span style="color: #333333; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">${resumeData.personalDetails.email}</span>` : ''}
            ${resumeData.personalDetails?.phone ? `<span style="color: #333333; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">${resumeData.personalDetails.phone}</span>` : ''}
            ${resumeData.personalDetails?.location ? `<span style="color: #333333; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">${resumeData.personalDetails.location}</span>` : ''}
          </div>
          
          <div class="links" style="margin-top: 6px; text-align: center;">
            ${resumeData.personalDetails?.linkedin ? `<span style="color: #000000; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">LinkedIn: ${formatLink(resumeData.personalDetails.linkedin, 'linkedin')}</span>` : ''}
            ${resumeData.personalDetails?.github ? `<span style="color: #000000; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">GitHub: ${formatLink(resumeData.personalDetails.github, 'github')}</span>` : ''}
            ${resumeData.personalDetails?.website ? `<span style="color: #000000; font-size: ${layout.smallSize}; margin: 0 12px; display: inline-block;">Portfolio: ${formatLink(resumeData.personalDetails.website, 'website')}</span>` : ''}
          </div>
        </div>
      `,
      
      summary: resumeData.summary ? `
        <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'fresh-graduate' ? 'CAREER OBJECTIVE' : 
              templateId === 'classic-executive' ? 'Executive Summary' : 'Professional Summary'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${templateId === 'fresh-graduate' ? `
            <div class="fresh-section-item" style="padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;">
              <div class="summary-text" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify;">${resumeData.summary}</div>
            </div>
          ` : `
            <div class="summary-text" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify;">${resumeData.summary}</div>
          `}
        </div>
      ` : '',

      experience: resumeData.experience && resumeData.experience.length > 0 ? `
        <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'fresh-graduate' ? 'INTERNSHIPS & EXPERIENCE' : 'Professional Experience'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${resumeData.experience.map(exp => `
            <div class="section-item ${templateId === 'tech-focused' ? 'tech-experience-item' : templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}" style="margin-bottom: ${layout.itemSpacing}; page-break-inside: avoid; ${templateId === 'fresh-graduate' ? 'padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;' : ''}">
              <div class="item-header" style="margin-bottom: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="vertical-align: top; width: 70%;">
                      <div class="item-title" style="font-size: ${layout.itemTitleSize}; font-weight: bold; color: #000000; line-height: 1.2; margin-bottom: 3px;">${exp.jobTitle}</div>
                      <div class="item-subtitle" style="color: #333333; font-weight: bold; font-size: ${layout.bodySize}; line-height: 1.2; margin-bottom: 3px;">${exp.company}</div>
                      ${exp.location ? `<div class="item-location" style="color: #666666; font-size: ${layout.smallSize}; font-style: italic;">${exp.location}</div>` : ''}
                    </td>
                    <td style="vertical-align: top; text-align: right; width: 30%;">
                      <div class="item-date" style="color: #666666; font-size: ${layout.smallSize}; font-weight: normal; line-height: 1.2;">${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)}</div>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="item-description" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify; margin-top: 6px; white-space: pre-line;">${exp.responsibilities}</div>
            </div>
          `).join('')}
        </div>
      ` : '',

      skills: resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
          <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
            ${templateId === 'tech-focused' ? 'TECHNICAL SKILLS' : 
              templateId === 'fresh-graduate' ? 'TECHNICAL SKILLS' : 'Core Competencies'}
            ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
          </h2>
          ${templateId === 'tech-focused' ? generateTechSkills(resumeData.skills, layout) : 
            templateId === 'fresh-graduate' ? `
              <div class="fresh-section-item" style="padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;">
                <div class="skills-text" style="font-size: ${layout.bodySize}; color: #000000; line-height: 1.5;">${resumeData.skills.join(' • ')}</div>
              </div>
            ` : `
              <div class="skills-container" style="line-height: 1.6;">
                <div class="skills-text" style="font-size: ${layout.bodySize}; color: #000000; line-height: 1.5;">${resumeData.skills.join(' • ')}</div>
              </div>
            `}
        </div>
      ` : ''
    };

    return baseContent;
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
        /* ATS-Friendly Reset and Base Styles */
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
          margin: 0;
          padding: 0;
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
          box-sizing: border-box;
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
          margin-bottom: 8px;
        }
        
        .item-title {
          font-size: ${layout.itemTitleSize};
          font-weight: bold;
          color: #000000;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        
        .item-subtitle {
          color: #333333;
          font-weight: bold;
          font-size: ${layout.bodySize};
          line-height: 1.2;
          margin-bottom: 3px;
        }
        
        .item-date {
          color: #666666;
          font-size: ${layout.smallSize};
          font-weight: normal;
          line-height: 1.2;
        }
        
        .item-location {
          color: #666666;
          font-size: ${layout.smallSize};
          margin-bottom: 3px;
          font-style: italic;
        }
        
        .item-description {
          font-size: ${layout.bodySize};
          line-height: ${layout.lineHeight};
          color: #000000;
          text-align: justify;
          margin-top: 6px;
          white-space: pre-line;
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
          line-height: ${layout.lineHeight};
          color: #000000;
          text-align: justify;
        }
        
        /* Hobbies Text */
        .hobbies-text {
          font-size: ${layout.bodySize};
          line-height: 1.4;
          color: #000000;
        }
        
        /* Table styles for proper alignment */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          padding: 0;
        }
        
        td {
          vertical-align: top;
          padding: 0;
          margin: 0;
        }
        
        /* Contact Info Styles */
        .contact-info span {
          white-space: nowrap;
        }
        
        .links span {
          white-space: nowrap;
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
            <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
              <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">EDUCATION</h2>
              ${resumeData.education.map(edu => `
                <div class="fresh-section-item" style="margin-bottom: ${layout.itemSpacing}; padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;">
                  <div class="item-header" style="margin-bottom: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="vertical-align: top; width: 70%;">
                          <div class="item-title" style="font-size: ${layout.itemTitleSize}; font-weight: bold; color: #000000; line-height: 1.2; margin-bottom: 3px;">${edu.degree}</div>
                          <div class="item-subtitle" style="color: #333333; font-weight: bold; font-size: ${layout.bodySize}; line-height: 1.2; margin-bottom: 3px;">${edu.institution}</div>
                          ${edu.location ? `<div class="item-location" style="color: #666666; font-size: ${layout.smallSize}; font-style: italic;">${edu.location}</div>` : ''}
                        </td>
                        <td style="vertical-align: top; text-align: right; width: 30%;">
                          <div class="item-date" style="color: #666666; font-size: ${layout.smallSize}; line-height: 1.2;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  ${edu.gpa ? `<div style="font-size: ${layout.bodySize}; color: #000000; margin-bottom: 6px;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
                  ${edu.achievements ? `<div class="item-description" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify;"><strong>Achievements:</strong> ${edu.achievements}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : '') :
          // Experience first for others
          content.experience
        }

        ${content.skills}

        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              ${templateId === 'fresh-graduate' ? 'ACADEMIC PROJECTS' : 
                templateId === 'classic-executive' ? 'Notable Projects' : 'Key Projects'}
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${resumeData.projects.map(project => `
              <div class="section-item ${templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}" style="margin-bottom: ${layout.itemSpacing}; page-break-inside: avoid; ${templateId === 'fresh-graduate' ? 'padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;' : ''}">
                <div class="item-header" style="margin-bottom: 8px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="vertical-align: top; width: 70%;">
                        <div class="item-title" style="font-size: ${layout.itemTitleSize}; font-weight: bold; color: #000000; line-height: 1.2;">${project.name}</div>
                      </td>
                      <td style="vertical-align: top; text-align: right; width: 30%;">
                        ${project.duration ? `<div class="item-date" style="color: #666666; font-size: ${layout.smallSize}; line-height: 1.2;">${project.duration}</div>` : ''}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="item-description" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify; margin-bottom: 6px;">${project.description}</div>
                ${project.technologies ? `<div style="font-size: ${layout.smallSize}; color: #666666; margin-bottom: 4px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
                ${project.link ? `<div style="font-size: ${layout.smallSize}; color: #000000;"><strong>Link:</strong> ${formatLink(project.link, 'website')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${templateId !== 'fresh-graduate' ? 
          // Education for non-fresh graduates
          (resumeData.education && resumeData.education.length > 0 ? `
            <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
              <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
                Education
                ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
              </h2>
              ${resumeData.education.map(edu => `
                <div class="section-item" style="margin-bottom: ${layout.itemSpacing}; page-break-inside: avoid;">
                  <div class="item-header" style="margin-bottom: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="vertical-align: top; width: 70%;">
                          <div class="item-title" style="font-size: ${layout.itemTitleSize}; font-weight: bold; color: #000000; line-height: 1.2; margin-bottom: 3px;">${edu.degree}</div>
                          <div class="item-subtitle" style="color: #333333; font-weight: bold; font-size: ${layout.bodySize}; line-height: 1.2; margin-bottom: 3px;">${edu.institution}</div>
                          ${edu.location ? `<div class="item-location" style="color: #666666; font-size: ${layout.smallSize}; font-style: italic;">${edu.location}</div>` : ''}
                        </td>
                        <td style="vertical-align: top; text-align: right; width: 30%;">
                          <div class="item-date" style="color: #666666; font-size: ${layout.smallSize}; line-height: 1.2;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  ${edu.gpa ? `<div style="font-size: ${layout.bodySize}; color: #000000; margin-bottom: 6px;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
                  ${edu.achievements ? `<div class="item-description" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify;">${edu.achievements}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : '') :
          content.experience
        }

        ${resumeData.achievements && resumeData.achievements.length > 0 ? `
          <div class="section" style="margin-bottom: ${layout.sectionSpacing}; page-break-inside: avoid;">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              ${templateId === 'classic-executive' ? 'Professional Achievements' : 'Achievements & Certifications'}
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${resumeData.achievements.map(achievement => `
              <div class="section-item ${templateId === 'fresh-graduate' ? 'fresh-section-item' : ''}" style="margin-bottom: ${layout.itemSpacing}; page-break-inside: avoid; ${templateId === 'fresh-graduate' ? 'padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;' : ''}">
                <div class="item-header" style="margin-bottom: 8px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="vertical-align: top; width: 70%;">
                        <div class="item-title" style="font-size: ${layout.itemTitleSize}; font-weight: bold; color: #000000; line-height: 1.2;">${achievement.title}</div>
                        ${achievement.organization ? `<div class="item-subtitle" style="color: #333333; font-weight: bold; font-size: ${layout.bodySize}; line-height: 1.2; margin-top: 3px;">${achievement.organization}</div>` : ''}
                      </td>
                      <td style="vertical-align: top; text-align: right; width: 30%;">
                        ${achievement.date ? `<div class="item-date" style="color: #666666; font-size: ${layout.smallSize}; line-height: 1.2;">${formatDate(achievement.date)}</div>` : ''}
                      </td>
                    </tr>
                  </table>
                </div>
                ${achievement.description ? `<div class="item-description" style="font-size: ${layout.bodySize}; line-height: ${layout.lineHeight}; color: #000000; text-align: justify; margin-bottom: 6px;">${achievement.description}</div>` : ''}
                ${achievement.link ? `<div style="font-size: ${layout.smallSize}; color: #000000;"><strong>Link:</strong> ${formatLink(achievement.link, 'website')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
          <div class="section" style="page-break-inside: avoid;">
            <h2 class="section-title" style="${templateStyles.sectionTitleStyle}">
              Hobbies & Interests
              ${templateId === 'minimal-elegant' ? '<div class="minimal-section-divider"></div>' : ''}
            </h2>
            ${templateId === 'fresh-graduate' ? `
              <div class="fresh-section-item" style="padding: 12px; border: 1px solid #cccccc; background-color: #ffffff;">
                <div class="hobbies-text" style="font-size: ${layout.bodySize}; line-height: 1.4; color: #000000;">${resumeData.hobbies.join(' • ')}</div>
              </div>
            ` : `
              <div class="hobbies-text" style="font-size: ${layout.bodySize}; line-height: 1.4; color: #000000;">${resumeData.hobbies.join(' • ')}</div>
            `}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};