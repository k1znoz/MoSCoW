import type {Answers, GeneratedDeliverables, QuestionSection} from './types'

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function answerToString(value: string | string[] | boolean | undefined): string {
  if (Array.isArray(value)) {
    return value.join(', ') || '-'
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }

  return value?.trim() ? value : '-'
}

function sectionToMarkdown(section: QuestionSection, answers: Answers): string {
  const lines = section.questions.map((question) => {
    const value = answerToString(answers[question.key])
    return `- **${question.label}**: ${value}`
  })

  return `## ${section.title}\n${lines.join('\n')}`
}

export function buildMarkdown(
  sections: QuestionSection[],
  answers: Answers,
  generated: GeneratedDeliverables
): string {
  const now = new Date().toISOString()
  const nonEmptySections = sections.filter((section) => section.questions.length > 0)
  const sectionBlocks = nonEmptySections.map((section) => sectionToMarkdown(section, answers)).join('\n\n')

  return [
    '# Dossier de cadrage client',
    `- Date: ${now}`,
    `- Projet: ${answerToString(answers.project_name)}`,
    `- Client: ${answerToString(answers.client_name)}`,
    '',
    sectionBlocks,
    '',
    '## Sitemap propose',
    ...generated.sitemap.map((entry) => `- ${entry}`),
    '',
    '## Backlog MoSCoW',
    '### Must',
    ...generated.moscow.must.map((entry) => `- ${entry}`),
    '### Should',
    ...generated.moscow.should.map((entry) => `- ${entry}`),
    '### Could',
    ...generated.moscow.could.map((entry) => `- ${entry}`),
    '### Wont',
    ...generated.moscow.wont.map((entry) => `- ${entry}`),
    '',
    '## Checklist contenu',
    ...generated.contentChecklist.map((entry) => `- ${entry}`),
    '',
    '## Risques',
    ...generated.risks.map((entry) => `- ${entry}`),
    '',
  ].join('\n')
}

export function buildPrintableHtml(
  sections: QuestionSection[],
  answers: Answers,
  generated: GeneratedDeliverables
): string {
  const sectionHtml = sections
    .filter((section) => section.questions.length > 0)
    .map((section) => {
      const rows = section.questions
        .map((question) => {
          const value = answerToString(answers[question.key])
          return `<tr><th>${escapeHtml(question.label)}</th><td>${escapeHtml(value)}</td></tr>`
        })
        .join('')

      return `<section><h2>${escapeHtml(section.title)}</h2><table>${rows}</table></section>`
    })
    .join('')

  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dossier client - ${escapeHtml(answerToString(answers.project_name))}</title>
<style>
  :root { color-scheme: light; }
  body { font-family: Georgia, 'Times New Roman', serif; margin: 28px; color: #1f2328; }
  h1, h2, h3 { margin: 0 0 12px; }
  h1 { font-size: 28px; }
  h2 { font-size: 20px; margin-top: 26px; border-bottom: 1px solid #d0d7de; padding-bottom: 6px; }
  h3 { font-size: 16px; margin-top: 18px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th, td { text-align: left; border-bottom: 1px solid #eaeef2; padding: 8px 6px; vertical-align: top; }
  th { width: 34%; font-weight: 600; }
  ul { padding-left: 18px; }
  .meta { margin-bottom: 18px; color: #59636e; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
  <h1>Dossier de cadrage client</h1>
  <p class="meta">Projet: ${escapeHtml(answerToString(answers.project_name))} | Client: ${escapeHtml(
    answerToString(answers.client_name)
  )}</p>
  ${sectionHtml}
  <section>
    <h2>Sitemap propose</h2>
    ${list(generated.sitemap)}
  </section>
  <section>
    <h2>Backlog MoSCoW</h2>
    <h3>Must</h3>${list(generated.moscow.must)}
    <h3>Should</h3>${list(generated.moscow.should)}
    <h3>Could</h3>${list(generated.moscow.could)}
    <h3>Wont</h3>${list(generated.moscow.wont)}
  </section>
  <section>
    <h2>Checklist contenu</h2>
    ${list(generated.contentChecklist)}
  </section>
  <section>
    <h2>Risques</h2>
    ${list(generated.risks)}
  </section>
</body>
</html>`
}
