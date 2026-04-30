import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-01-01',
  useCdn: false,
})

const query = '*[_type == "submission" && dateTime(expiresAt) < dateTime(now())]._id'
const ids = await client.fetch(query)

if (!ids.length) {
  console.log('No expired submissions found.')
  process.exit(0)
}

const transaction = ids.reduce((trx, id) => trx.delete(id), client.transaction())
await transaction.commit()

console.log(`Deleted ${ids.length} expired submission(s).`)
