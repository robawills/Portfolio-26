import {defineArrayMember, defineField, defineType} from 'sanity'

const SIZE_OPTIONS = [
  {title: 'Full width', value: 'full'},
  {title: 'Half width', value: 'half'},
  {title: 'Max (large square on desktop)', value: 'max'},
  {title: 'Mega', value: 'mega'},
] as const

export const mediaGroupBlockType = defineType({
  name: 'mediaGroupBlock',
  title: 'Media group',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      description:
        'One or two images per group. Use two halves to render them side-by-side, or a single full / max / mega for a standalone image.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mediaGroupItem',
          title: 'Item',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'size',
              title: 'Layout size',
              type: 'string',
              initialValue: 'full',
              options: {
                list: SIZE_OPTIONS.map(({title, value}) => ({title, value})),
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              alt: 'image.alt',
              size: 'size',
            },
            prepare: ({media, alt, size}) => ({
              title: alt || 'Image',
              subtitle: size ? `Size: ${size}` : undefined,
              media,
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(2),
    }),
  ],
  preview: {
    select: {
      first: 'items.0.image',
      count: 'items.length',
    },
    prepare: ({first, count}) => ({
      title: 'Media group',
      subtitle: count ? `${count} item${count === 1 ? '' : 's'}` : 'Empty',
      media: first,
    }),
  },
})
