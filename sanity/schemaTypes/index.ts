import {type SchemaTypeDefinition} from 'sanity'

import {homeType} from './homeType'
import {projectType} from './projectType'
import {skillType} from './skillType'
import {expertiseType} from './expertiseType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [homeType, projectType, skillType, expertiseType],
}
