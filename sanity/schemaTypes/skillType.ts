import {defineField, defineType} from 'sanity'
import {
  orderRankField,
  orderRankOrdering,
} from '@sanity/orderable-document-list'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'skill'}),
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
