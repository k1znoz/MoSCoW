import {defineField, defineType} from 'sanity'

export const submissionType = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Submitted', value: 'submitted'},
          {title: 'Handled', value: 'handled'},
        ],
      },
      initialValue: 'submitted',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientCompany',
      title: 'Client company',
      type: 'string',
    }),
    defineField({
      name: 'clientEmail',
      title: 'Client email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'clientPhone',
      title: 'Client phone',
      type: 'string',
    }),
    defineField({
      name: 'projectName',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      options: {
        list: [
          {title: 'Vitrine', value: 'vitrine'},
          {title: 'Lead gen', value: 'lead_gen'},
          {title: 'E-commerce', value: 'ecommerce'},
          {title: 'Reservation', value: 'reservation'},
          {title: 'Espace client', value: 'client_space'},
        ],
      },
    }),
    defineField({
      name: 'budgetRange',
      title: 'Budget range',
      type: 'string',
    }),
    defineField({
      name: 'deadline',
      title: 'Deadline',
      type: 'date',
    }),
    defineField({
      name: 'answersJson',
      title: 'Answers JSON',
      type: 'text',
      rows: 16,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'generatedJson',
      title: 'Generated JSON',
      type: 'text',
      rows: 16,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'exportMarkdown',
      title: 'Export markdown',
      type: 'text',
      rows: 20,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'exportHtml',
      title: 'Export HTML',
      type: 'text',
      rows: 20,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'adminHandledAt',
      title: 'Admin handled at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'projectName',
      subtitle: 'clientName',
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      return {
        title,
        subtitle: `${subtitle ?? 'Unknown client'} - ${status ?? 'submitted'}`,
      }
    },
  },
})
