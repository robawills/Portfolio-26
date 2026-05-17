import {defineField, defineType} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      description:
        'The big intro statement at the top of the about page. Plain text.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description:
        'Write the bio as normal prose. Separate paragraphs with a blank line — each block becomes its own paragraph on the page.',
      type: 'text',
      rows: 10,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      description:
        'Names of people / brands worked with. Rendered as an inline list separated by dots.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({title: 'About', subtitle: 'About page'}),
  },
})
