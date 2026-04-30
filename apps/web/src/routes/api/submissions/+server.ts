import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {getSanityWriteClient} from '$lib/server/sanity'

type SubmissionPayload = {
  answers: Record<string, string | string[] | boolean>
  generated: unknown
  exportMarkdown: string
  exportHtml: string
}

function addDays(baseDate: Date, days: number): Date {
  const output = new Date(baseDate)
  output.setDate(output.getDate() + days)
  return output
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export const POST: RequestHandler = async ({request}) => {
  const payload = (await request.json()) as SubmissionPayload

  if (!payload?.answers || !payload.exportMarkdown || !payload.exportHtml) {
    return json({error: 'Payload incomplet'}, {status: 400})
  }

  const client = getSanityWriteClient()
  const now = new Date()

  const document = {
    _type: 'submission',
    createdAt: now.toISOString(),
    expiresAt: addDays(now, 7).toISOString(),
    status: 'submitted',
    clientName: getString(payload.answers.client_name),
    clientCompany: getString(payload.answers.client_company),
    clientEmail: getString(payload.answers.client_email),
    clientPhone: getString(payload.answers.client_phone),
    projectName: getString(payload.answers.project_name),
    projectType: getString(payload.answers.project_type),
    budgetRange: getString(payload.answers.budget_range),
    deadline: getString(payload.answers.launch_deadline),
    answersJson: JSON.stringify(payload.answers, null, 2),
    generatedJson: JSON.stringify(payload.generated ?? {}, null, 2),
    exportMarkdown: payload.exportMarkdown,
    exportHtml: payload.exportHtml,
  }

  const created = await client.create(document)
  return json({ok: true, id: created._id})
}
