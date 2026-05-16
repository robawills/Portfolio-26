import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      description:
        'Used in the browser tab title template — e.g. "Project · Site title".',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'defaultMetaTitle',
      title: 'Default meta title',
      description: 'Shown when a page has no SEO title of its own.',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default meta description',
      description: 'Shown when a page has no SEO description of its own.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'defaultShareImage',
      title: 'Default social share image',
      description:
        'Used as the social preview image when a page does not set its own. 1200×630.',
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
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
