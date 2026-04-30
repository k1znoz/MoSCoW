import {createClient} from '@sanity/client'
import {env} from '$env/dynamic/private'

export function getSanityWriteClient() {
  const projectId = env.SANITY_PROJECT_ID
  const dataset = env.SANITY_DATASET
  const token = env.SANITY_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing SANITY_PROJECT_ID, SANITY_DATASET or SANITY_WRITE_TOKEN')
  }

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2025-01-01',
    useCdn: false,
  })
}
