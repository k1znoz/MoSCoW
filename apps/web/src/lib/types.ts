export type InputType = 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean' | 'date'

export type Question = {
  key: string
  label: string
  inputType: InputType
  required?: boolean
  options?: string[]
  help?: string
  projectTypes?: string[]
  visibleWhen?: {
    key: string
    equals: string | boolean
  }
}

export type QuestionSection = {
  key: string
  title: string
  questions: Question[]
}

export type Answers = Record<string, string | string[] | boolean>

export type GeneratedDeliverables = {
  sitemap: string[]
  moscow: {
    must: string[]
    should: string[]
    could: string[]
    wont: string[]
  }
  contentChecklist: string[]
  risks: string[]
}
