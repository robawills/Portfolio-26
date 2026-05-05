import {defineArrayMember, defineField, defineType, type ReferenceFilterResolver} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

const excludeSelectedRefs: ReferenceFilterResolver = ({parent}) => {
  const refs = Array.isArray(parent)
    ? parent.flatMap((item) => {
        const ref = (item as {_ref?: string})._ref
        return ref ? [ref] : []
      })
    : []
  return refs.length ? {filter: '!(_id in $refs)', params: {refs}} : {}
}

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'project'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
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
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'skill'}],
          options: {filter: excludeSelectedRefs},
        }),
      ],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'Expertise'}],
          options: {filter: excludeSelectedRefs},
        }),
      ],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({scheme: ['http', 'https', 'mailto']}),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'images.0'},
  },
})
