import { defineType, defineField } from 'sanity'

export const thought = defineType({
  name: 'thought',
  title: 'Thought',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (r) => r.required(),
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'preview',
      title: 'Preview',
      description: 'Short blurb shown on the index. ~1–2 sentences.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Optional. Full post body.',
      type: 'array',
      of: [{ type: 'block' }],
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
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Manual order',
      name: 'manual',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
