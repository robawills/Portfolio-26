import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      description:
        'Shown in browser tabs and search results. Falls back to the site default if empty. Aim for ~60 characters.',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      description:
        'Used by search engines and social previews. Falls back to the site default if empty. Aim for ~150 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'image',
      title: 'Social share image',
      description:
        'Shown when the page is shared on social networks. 1200×630 works well. Falls back to the site default if empty.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
  ],
  options: {collapsible: true, collapsed: true},
})
