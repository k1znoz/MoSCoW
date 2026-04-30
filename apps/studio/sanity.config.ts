import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {handleAndDeleteAction} from './documentActions/handleAndDeleteAction'

export default defineConfig({
  name: 'default',
  title: 'MoSCoW',

  projectId: 'x1n0fmhe',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  document: {
    actions: (previousActions, context) => {
      if (context.schemaType === 'submission') {
        return [handleAndDeleteAction, ...previousActions]
      }

      return previousActions
    },
  },

  schema: {
    types: schemaTypes,
  },
})
