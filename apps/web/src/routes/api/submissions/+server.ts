import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {getSanityWriteClient} from '$lib/server/sanity'

type SubmissionPayload = {
  answers: Record<string, string | string[] | boolean>
  generated: unknown
  exportMarkdown: string
  exportHtml: string
}

const PROJECT_TYPES = new Set(['vitrine', 'lead_gen', 'ecommerce', 'reservation', 'client_space'])

function addDays(baseDate: Date, days: number): Date {
  const output = new Date(baseDate)
  output.setDate(output.getDate() + days)
  return output
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function getOptionalString(value: unknown): string | undefined {
  const normalized = getString(value)
  return normalized.length > 0 ? normalized : undefined
}

function getOptionalDate(value: unknown): string | undefined {
  const normalized = getString(value)
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : undefined
}

export const POST: RequestHandler = async ({request}) => {
  const payload = (await request.json()) as SubmissionPayload
  const projectName = getString(payload?.answers?.project_name)
  const clientName = getString(payload?.answers?.client_name)

  if (!payload?.answers || !payload.exportMarkdown || !payload.exportHtml) {
    return json({error: 'Payload incomplet'}, {status: 400})
  }

  if (!projectName || !clientName) {
    return json({error: 'Nom du projet et nom du client requis'}, {status: 400})
  }

  try {
    const client = getSanityWriteClient()
    const now = new Date()
    const projectType = getString(payload.answers.project_type)

    const document = {
      _type: 'submission',
      createdAt: now.toISOString(),
      expiresAt: addDays(now, 7).toISOString(),
      status: 'submitted',
      clientName,
      clientCompany: getOptionalString(payload.answers.client_company),
      clientEmail: getOptionalString(payload.answers.client_email),
      clientPhone: getOptionalString(payload.answers.client_phone),
      projectName,
      projectType: PROJECT_TYPES.has(projectType) ? projectType : undefined,
      budgetRange: getOptionalString(payload.answers.budget_range),
      deadline: getOptionalDate(payload.answers.launch_deadline),
      answersJson: JSON.stringify(payload.answers, null, 2),
      generatedJson: JSON.stringify(payload.generated ?? {}, null, 2),
      exportMarkdown: payload.exportMarkdown,
      exportHtml: payload.exportHtml,
    }

    const created = await client.create(document)
    return json({ok: true, id: created._id})
  } catch (error) {
    console.error('Sanity submission failed:', error)
    return json({error: 'Impossible de sauvegarder dans Sanity'}, {status: 502})
  }
}
