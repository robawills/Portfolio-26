import {
  defineArrayMember,
  defineField,
  defineType,
  type ReferenceFilterResolver,
} from 'sanity'

const excludeSelectedRefs: ReferenceFilterResolver = ({parent}) => {
  const refs = Array.isArray(parent)
    ? parent.flatMap((item) => {
        const ref = (item as {_ref?: string})._ref
        return ref ? [ref] : []
      })
    : []
  return refs.length ? {filter: '!(_id in $refs)', params: {refs}} : {}
}

export const aboutBuildBlockType = defineType({
  name: 'aboutBuildBlock',
  title: 'About / Build section',
  type: 'object',
  fields: [
    defineField({
      name: 'signpost',
      title: 'Signpost',
      description: 'Small label above the description. Defaults to "Build".',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required().max(2000),
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
  ],
  preview: {
    select: {
      signpost: 'signpost',
      description: 'description',
    },
    prepare: ({signpost, description}) => ({
      title: signpost || 'Build',
      subtitle: description?.slice(0, 80),
    }),
  },
})
