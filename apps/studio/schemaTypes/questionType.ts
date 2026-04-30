import {defineField, defineType} from 'sanity'

export const questionType = defineType({
  name: 'question',
  title: 'Question',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      validation: (rule) => rule.required().regex(/^[a-z0-9_]+$/),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'help',
      title: 'Help text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'inputType',
      title: 'Input type',
      type: 'string',
      options: {
        list: [
          {title: 'Short text', value: 'text'},
          {title: 'Long text', value: 'textarea'},
          {title: 'Select', value: 'select'},
          {title: 'Multiselect', value: 'multiselect'},
          {title: 'Boolean', value: 'boolean'},
          {title: 'Date', value: 'date'},
        ],
      },
      initialValue: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({document}) => !['select', 'multiselect'].includes(document?.inputType as string),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'section',
    },
  },
})
