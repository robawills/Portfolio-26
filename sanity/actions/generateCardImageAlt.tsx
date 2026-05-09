import {SparklesIcon} from '@sanity/icons'
import {useState} from 'react'
import {type DocumentActionComponent, useClient} from 'sanity'

type ProjectDoc = {
  cardImage?: {asset?: {_ref?: string}}
}

export const generateCardImageAlt: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion: 'vX'})
  const [loading, setLoading] = useState(false)

  const doc = (props.draft ?? props.published) as ProjectDoc | null
  const hasImage = Boolean(doc?.cardImage?.asset?._ref)

  return {
    label: loading ? 'Generating alt…' : 'Generate card image alt',
    icon: SparklesIcon,
    disabled: !hasImage || loading,
    onHandle: async () => {
      setLoading(true)
      try {
        await client.agent.action.transform({
          schemaId: '_.schemas.default',
          documentId: props.id,
          instruction:
            'Write concise, descriptive alt text for accessibility (max 120 characters). Describe the visual content matter-of-factly. Do not start with "Image of" or "A picture of".',
          target: {
            path: ['cardImage', 'alt'],
            operation: {type: 'image-description'},
          },
        })
      } finally {
        setLoading(false)
        props.onComplete()
      }
    },
  }
}
