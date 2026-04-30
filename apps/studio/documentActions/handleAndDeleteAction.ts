import type {SanityClient} from '@sanity/client'
import type {DocumentActionComponent} from 'sanity'
import {useClient} from 'sanity'

function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'})
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function openHtmlInNewTab(html: string): void {
  const popup = window.open('', '_blank', 'noopener,noreferrer')
  if (!popup) {
    return
  }

  popup.document.open()
  popup.document.write(html)
  popup.document.close()
}

async function deleteSubmission(client: SanityClient, id: string): Promise<void> {
  const publishedId = id.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`

  await Promise.allSettled([client.delete(publishedId), client.delete(draftId)])
}

export const handleAndDeleteAction: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion: '2025-01-01'})

  if (props.type !== 'submission') {
    return null
  }

  return {
    label: 'Handle export and delete',
    tone: 'critical',
    onHandle: async () => {
      const snapshot = props.published || props.draft
      if (!snapshot) {
        props.onComplete()
        return
      }

      const projectName = String(snapshot.projectName || 'submission')
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, '-')
      const date = new Date().toISOString().slice(0, 10)
      const markdown = String(snapshot.exportMarkdown || '')
      const html = String(snapshot.exportHtml || '')

      if (markdown) {
        downloadTextFile(`${projectName}-${date}.md`, markdown)
      }

      if (html) {
        openHtmlInNewTab(html)
      }

      const shouldDelete = window.confirm(
        'Les exports ont ete prepares. Confirmer la suppression immediate de cette submission?'
      )

      if (!shouldDelete) {
        props.onComplete()
        return
      }

      await deleteSubmission(client, props.id)
      props.onComplete()
    },
  }
}
