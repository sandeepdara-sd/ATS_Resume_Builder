//resumeTemplate.js

export const generateResumeHTML = (resumeData) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        
        .container {
          width: 100%;
          max-width: 794px;
          margin: 0 auto;
          background-color: white;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }


        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .name {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
          margin-top: 0;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 0.75rem;
          color: #666;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.75rem;
        }

        .contact-link {
          color: #667eea;
          text-decoration: none;
          padding: 2px 8px;
          background-color: rgba(102, 126, 234, 0.1);
          border-radius: 4px;
          border: 1px solid #667eea;
        }

        .contact-link:hover {
          background-color: rgba(102, 126, 234, 0.2);
        }

        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 16px 0;
        }

        .content {
          display: flex;
          flex-direction: column;
        }

        .section {
          margin-bottom: 12px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
          margin-top: 0;
          padding-bottom: 4px;
          border-bottom: 1px solid #e0e0e0;
        }

        .summary-text {
          font-size: 0.8rem;
          line-height: 1.4;
          color: #333;
        }

        .item {
          margin-bottom: 8px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .item-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 2px 0;
        }

        .item-subtitle {
          font-size: 0.85rem;
          font-weight: 500;
          color: #667eea;
          margin: 0;
        }

        .item-date {
          font-size: 0.75rem;
          color: #666;
          white-space: nowrap;
        }

        .item-location {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 6px;
        }

        .item-description {
          font-size: 0.75rem;
          line-height: 1.3;
          color: #333;
          white-space: pre-line;
        }

        .item-gpa, .item-tech, .item-link {
          font-size: 0.75rem;
          margin-bottom: 4px;
        }

        .item-tech strong, .item-link strong, .item-gpa strong {
          font-weight: 600;
        }

        .item-link {
          color: #667eea;
        }

        .project-duration {
          font-size: 0.75rem;
          color: #666;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .skill-chip {
          display: inline-block;
          padding: 2px 8px;
          border: 1px solid #667eea;
          border-radius: 12px;
          font-size: 0.65rem;
          color: #667eea;
          background-color: transparent;
        }

        .hobbies-text {
          font-size: 0.75rem;
          line-height: 1.3;
          color: #333;
        }

        @media print {
  body {
    background-color: white;
    margin: 0;
  }

  .container {
    box-shadow: none;
    padding: 0.4in;
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
            ${resumeData.personalDetails?.linkedin ? `<a target="_blank" href="${resumeData.personalDetails.linkedin}" class="contact-link">LinkedIn</a>` : ''}
            ${resumeData.personalDetails?.github ? `<a target="_blank" href="${resumeData.personalDetails.github}" class="contact-link">GitHub</a>` : ''}
            ${resumeData.personalDetails?.website ? `<a target="_blank" href="${resumeData.personalDetails.website}" class="contact-link">Portfolio</a>` : ''}
          </div>
        </div>

       

        <div class="content">
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

          ${resumeData.projects && resumeData.projects.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Projects</h2>
              ${resumeData.projects.map(project => `
                <div class="item">
                  <div class="item-header">
                    <h3 class="item-title">${project.name || ''}</h3>
                    ${project.duration ? `<div class="project-duration">${project.duration}</div>` : ''}
                  </div>
                  ${project.description ? `<div class="item-description" style="margin-bottom: 4px;">${project.description}</div>` : ''}
                  ${project.technologies ? `<div class="item-tech"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
                  ${project.link ? `<div class="item-link"><strong>Link:</strong> <a href="${project.link}" style="color: inherit;">${project.link}</a></div>` : ''}
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
                  ${edu.gpa ? `<div class="item-gpa"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
                  ${edu.achievements ? `<div class="item-description">${edu.achievements}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.skills && resumeData.skills.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="skills-container">
                ${resumeData.skills.map(skill => `
                  <span class="skill-chip">${skill}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.achievements && resumeData.achievements.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Achievements & Certifications</h2>
              ${resumeData.achievements.map(achievement => `
                <div class="item">
                  <div class="item-header">
                    <h3 class="item-title">${achievement.title || ''}</h3>
                    ${achievement.date ? `<div class="item-date">${formatDate(achievement.date)}</div>` : ''}
                  </div>
                  ${achievement.organization ? `<div class="item-subtitle" style="margin-bottom: 4px;">${achievement.organization}</div>` : ''}
                  ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.hobbies && resumeData.hobbies.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Hobbies & Interests</h2>
              <div class="hobbies-text">${resumeData.hobbies.join(' • ')}</div>
            </div>
          ` : ''}
        </div>
      </div>
    </body>
  </html>
  `;
};

