import {defineField, defineType} from 'sanity'

export const expertiseType = defineType({
  name: 'Expertise',
  title: 'Expertise',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
