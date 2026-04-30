import {defineField, defineType} from 'sanity'

export const questionnaireTemplateType = defineType({
  name: 'questionnaireTemplate',
  title: 'Questionnaire Template',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      initialValue: 'v1',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'question'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'version',
    },
  },
})
