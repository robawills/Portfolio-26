import {defineField, defineType} from 'sanity'

export const homeType = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
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
    defineField({
      name: 'aboutBuildSignpost',
      title: 'About build — signpost',
      description:
        'Small label above the build description (e.g. "About", "Stack"). Defaults to "About" if empty.',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'aboutBuildDescription',
      title: 'About build — description',
      description:
        'Paragraph describing how the site is built. Shown below the project grid.',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.max(800),
    }),
  ],
  preview: {
    select: {title: 'heroTitle', media: 'heroImage'},
    prepare: ({title, media}) => ({title: title || 'Home', subtitle: 'Home page', media}),
  },
})
