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
        'Shown in browser tabs and search results. Falls back to the site default if empty. When set, used verbatim (no site-name suffix). Aim for 30–60 characters.',
      type: 'string',
      validation: (rule) => [
        rule.max(60).warning('Keep under 60 characters for search results.'),
        rule
          .min(30)
          .warning('Aim for at least 30 characters so search results have context.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      description:
        'Used by search engines and social previews. Falls back to the site default if empty. Aim for 70–160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.max(160).warning('Keep under 160 characters; search engines truncate longer.'),
        rule.min(70).warning('Aim for at least 70 characters.'),
      ],
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
