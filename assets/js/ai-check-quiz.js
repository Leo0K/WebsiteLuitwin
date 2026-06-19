const CALENDLY = 'https://calendly.com/luitwin/30min';

      const answers = [null, null, null, null, null, null];

      const qLabels = ['Datenquellen', 'Volumen', 'Aktualität', 'IT-Kapazität', 'Sensibilität', 'KI-Ziel'];
      const scoreLabels = [
        ['Minimal', 'Niedrig', 'Mittel', 'Hoch'],
        ['Minimal', 'Niedrig', 'Mittel', 'Hoch'],
        ['Monatlich', 'Wöchentlich', 'Täglich', 'Echtzeit'],
        ['Niemand', 'Gelegentlich', 'Fest', 'Intern'],
        ['Kaum', 'Mäßig', 'Hoch', 'Sehr hoch'],
        ['Berichte', 'Prognosen', 'Wissen', 'Automation']
      ];

      const recs = [
        {
          min: 0,
          max: 4,
          accent: '#60d098',
          tagStyle: 'color:#60d098;border-color:rgba(96,208,152,0.3)',
          label: 'Empfehlung',
          title: 'SharePoint + Power BI',
          body: 'Euer Unternehmen steht am Anfang der Digitalisierung — das ist der richtige Moment für einen soliden ersten Schritt. SharePoint ist in fast jeder M365-Lizenz bereits enthalten und löst das eigentliche Problem: eine einzige Quelle der Wahrheit, keine drei verschiedenen Excel-Versionen mehr. Power BI verbindet sich direkt und liefert erste Dashboards ohne Datenbank. Kein Overkill, kein System das niemand betreibt.',
          tags: ['SharePoint', 'OneDrive', 'Power BI', 'M365', 'Kein Data Engineer nötig'],
          ctaText: 'In einem kostenlosen Gespräch zeige ich euch wie ihr in 2 Wochen eine funktionierende Datenbasis habt.',
          barColor: '#60d098'
        },
        {
          min: 5,
          max: 9,
          accent: '#60a8f0',
          tagStyle: 'color:#60a8f0;border-color:rgba(96,168,240,0.3)',
          label: 'Empfehlung',
          title: 'Azure SQL + dbt + Power BI',
          body: 'Ihr seid bereit für eine echte Datenbankstruktur. Azure SQL ist managed, DSGVO-konform auf EU-Servern und skaliert problemlos mit. dbt ermöglicht es, Datentransformationen als versionierten SQL-Code zu schreiben — nachvollziehbar, wartbar, kein verstecktes Excel-Wissen mehr. Power BI als Reporting-Layer obendrauf. Erste automatische Pipelines mit Power Automate oder einem einfachen Python-Script.',
          tags: ['Azure SQL', 'dbt Core', 'Power BI', 'Power Automate', 'DSGVO-konform'],
          ctaText: 'Ich zeige euch wie das konkret für euren Stack aussieht — in einem kostenlosen Erstgespräch.',
          barColor: '#60a8f0'
        },
        {
          min: 10,
          max: 14,
          accent: '#a888f0',
          tagStyle: 'color:#a888f0;border-color:rgba(168,136,240,0.3)',
          label: 'Empfehlung',
          title: 'Azure Data Lake + dbt + ADF',
          body: 'Ihr habt mehrere Datenquellen, nennenswerte Datenmenge und wahrscheinlich schon einen IT-Partner. Hier lohnt sich ein richtiges Datenfundament: Azure Data Lake Gen2 als Storage, dbt für die Transformation, Azure Data Factory für automatisierte Pipelines. Power BI als Reporting-Layer. Diese Architektur macht analytische KI — Absatzprognose, Anomalieerkennung, Predictive Maintenance — in wenigen Monaten möglich.',
          tags: ['Azure Data Lake Gen2', 'dbt', 'Azure Data Factory', 'Power BI', 'Medallion-Architektur'],
          ctaText: 'Gemeinsam entwickeln wir eine Architektur die zu eurer Größe und eurem Budget passt.',
          barColor: '#a888f0'
        },
        {
          min: 15,
          max: 99,
          accent: '#f0a830',
          tagStyle: 'color:#f0a830;border-color:rgba(240,168,48,0.3)',
          label: 'Empfehlung',
          title: 'Vollständige Cloud-Architektur',
          body: 'Euer Unternehmen hat komplexe Anforderungen: viele Quellen, hohes Volumen, Echtzeit-Bedarf oder stark regulierte Daten. Hier braucht es eine durchdachte Architektur — Azure Synapse oder Databricks als Plattform, Azure Data Factory für Ingestion, ein starkes IAM- und Datenschutzkonzept von Anfang an. Das ist der Punkt wo ein erfahrener Begleiter den Unterschied zwischen einem erfolgreichen Projekt und einem gescheiterten macht.',
          tags: ['Azure Synapse / Databricks', 'ADF', 'IAM & Governance', 'DSGVO-Konzept', 'Strategische Begleitung'],
          ctaText: 'Das ist genau die Art von Projekt bei dem ich begleite — von der Architektur bis zur ersten produktiven KI.',
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
            if (done === 6) {
              setTimeout(showResult, 300);
            }
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
            <div class="score-bar-wrap">
              <div class="score-bar" style="width:${Math.round(v / 3 * 100)}%; background:${rec.barColor}"></div>
            </div>
            <span class="score-val">${scoreLabels[i][v]}</span>
          </div>
        `).join('');

        el.innerHTML = `
          <div class="result-panel">
            <div class="result-header">
              <div class="result-label">${rec.label}</div>
              <div class="result-title">${rec.title}</div>
            </div>
            <div class="result-body">${rec.body}</div>
            <div class="result-scores">
              <div class="score-label">Euer Profil</div>
              ${barsHtml}
            </div>
            <div class="result-tags">${tagsHtml}</div>
            <div class="result-cta">
              <p class="cta-text"><strong>Nächster Schritt:</strong> ${rec.ctaText}</p>
              <a class="cta-btn" href="${CALENDLY}" target="_blank" rel="noopener">Kostenloses Gespräch buchen<span class="cta-arrow">→</span></a>
            </div>
          </div>
        `;

        el.classList.add('show');
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
