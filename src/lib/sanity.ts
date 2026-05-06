import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET ?? 'production'

export const sanityEnabled = Boolean(projectId)

export const client: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: true,
      perspective: 'published',
    })
  : null

const builder: ImageUrlBuilder | null = client ? imageUrlBuilder(client) : null

export function urlFor(source: unknown) {
  if (!builder) throw new Error('Sanity client not configured')
  // The builder accepts asset references, image objects, or plain documents.
  return builder.image(source as Parameters<ImageUrlBuilder['image']>[0])
}
