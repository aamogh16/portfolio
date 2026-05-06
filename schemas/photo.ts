import { defineType, defineField } from 'sanity'

export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'takenAt',
      title: 'Taken at',
      type: 'date',
    }),
    defineField({
      name: 'ratio',
      title: 'Aspect ratio',
      description: 'Controls grid tile shape. Defaults to square.',
      type: 'string',
      initialValue: 'square',
      options: {
        list: [
          { title: 'Square (1:1)', value: 'square' },
          { title: 'Portrait (3:4)', value: 'portrait' },
          { title: 'Landscape (4:3)', value: 'landscape' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'order',
      title: 'Manual order',
      description: 'Lower numbers appear first. Leave blank to sort by date.',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manual',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date taken, newest first',
      name: 'takenDesc',
      by: [{ field: 'takenAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'takenAt', media: 'image' },
  },
})
