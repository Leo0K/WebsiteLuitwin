const CALENDLY = 'https://calendly.com/luitwin/30min';
const answers = [null, null, null, null, null, null];

const qLabels = ['Data sources', 'Volume', 'Freshness', 'IT capacity', 'Sensitivity', 'AI goal'];
const scoreLabels = [
  ['Minimal', 'Low', 'Medium', 'High'],
  ['Minimal', 'Low', 'Medium', 'High'],
  ['Monthly', 'Weekly', 'Daily', 'Real-time'],
  ['Nobody', 'Occasional', 'Regular', 'Internal'],
  ['Low', 'Moderate', 'High', 'Very high'],
  ['Reports', 'Forecasts', 'Knowledge', 'Automation']
];

const recs = [
  {
    min: 0,
    max: 4,
    tagStyle: 'color:#60d098;border-color:rgba(96,208,152,0.3)',
    label: 'Recommendation',
    title: 'SharePoint + Power BI',
    body: 'Your company is at the beginning of its data journey. This is the right moment for a solid first step. SharePoint is already included in many M365 licenses and solves the core problem: one source of truth instead of multiple Excel versions. Power BI connects directly and enables first dashboards without introducing a full database platform.',
    tags: ['SharePoint', 'OneDrive', 'Power BI', 'M365', 'No data engineer needed'],
    ctaText: 'In a free call, I can show how to build a working data foundation within a few weeks.',
    barColor: '#60d098'
  },
  {
    min: 5,
    max: 9,
    tagStyle: 'color:#60a8f0;border-color:rgba(96,168,240,0.3)',
    label: 'Recommendation',
    title: 'Azure SQL + dbt + Power BI',
    body: 'You are ready for a real database structure. Azure SQL is managed, scalable and a practical fit for structured business data. dbt makes transformations versioned and maintainable instead of hiding logic in Excel files. Power BI remains the reporting layer on top, supported by first automated pipelines.',
    tags: ['Azure SQL', 'dbt Core', 'Power BI', 'Power Automate', 'Structured foundation'],
    ctaText: 'I can show what this would look like concretely for your current stack.',
    barColor: '#60a8f0'
  },
  {
    min: 10,
    max: 14,
    tagStyle: 'color:#a888f0;border-color:rgba(168,136,240,0.3)',
    label: 'Recommendation',
    title: 'Azure Data Lake + dbt + ADF',
    body: 'You likely have multiple data sources, meaningful data volume and already some IT support. A proper data foundation becomes useful here: Azure Data Lake Gen2 for storage, dbt for transformations and Azure Data Factory for automated pipelines. This can enable analytical AI such as sales forecasting, anomaly detection or predictive maintenance.',
    tags: ['Azure Data Lake Gen2', 'dbt', 'Azure Data Factory', 'Power BI', 'Medallion architecture'],
    ctaText: 'Together we can design an architecture that fits your size and budget.',
    barColor: '#a888f0'
  },
  {
    min: 15,
    max: 99,
    tagStyle: 'color:#f0a830;border-color:rgba(240,168,48,0.3)',
    label: 'Recommendation',
    title: 'Full Cloud Architecture',
    body: 'Your company has more complex requirements: many sources, high volume, real-time needs or highly sensitive data. This calls for a considered architecture, for example Azure Synapse or Databricks as a platform, Azure Data Factory for ingestion and strong IAM and governance from the start.',
    tags: ['Azure Synapse / Databricks', 'ADF', 'IAM & Governance', 'GDPR concept', 'Strategic support'],
    ctaText: 'This is exactly the type of project where experienced guidance can reduce risk and accelerate delivery.',
    barColor: '#f0a830'
  }
];

document.querySelectorAll('.opts').forEach(group => {
  group.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = parseInt(group.dataset.q, 10);
      group.querySelectorAll('.opt').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      answers[q] = parseInt(btn.dataset.v, 10);
      document.getElementById('qb' + q).classList.add('answered');
      updateProgress();
      const done = answers.filter(a => a !== null).length;
      if (done === 6) setTimeout(showResult, 300);
    });
  });
});

function updateProgress() {
  const done = answers.filter(a => a !== null).length;
  document.getElementById('prog-fill').style.width = done / 6 * 100 + '%';
  document.getElementById('prog-count').textContent = done + ' / 6';
}

function showResult() {
  const score = answers.reduce((s, v) => s + v, 0);
  const rec = recs.find(r => score >= r.min && score <= r.max) || recs[recs.length - 1];
  const el = document.getElementById('result');
  const tagsHtml = rec.tags.map(t => `<span class="tag" style="${rec.tagStyle}">${t}</span>`).join('');
  const barsHtml = answers.map((v, i) => `
    <div class="score-row">
      <span class="score-name">${qLabels[i]}</span>
      <div class="score-bar-wrap"><div class="score-bar" style="width:${Math.round(v / 3 * 100)}%; background:${rec.barColor}"></div></div>
      <span class="score-val">${scoreLabels[i][v]}</span>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="result-panel">
      <div class="result-header"><div class="result-label">${rec.label}</div><div class="result-title">${rec.title}</div></div>
      <div class="result-body">${rec.body}</div>
      <div class="result-scores"><div class="score-label">Your profile</div>${barsHtml}</div>
      <div class="result-tags">${tagsHtml}</div>
      <div class="result-cta">
        <p class="cta-text"><strong>Next step:</strong> ${rec.ctaText}</p>
        <a class="cta-btn" href="${CALENDLY}" target="_blank" rel="noopener">Book a free call<span class="cta-arrow">→</span></a>
      </div>
    </div>
  `;
  el.classList.add('show');
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}
