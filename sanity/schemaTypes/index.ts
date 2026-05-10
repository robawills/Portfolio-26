import {type SchemaTypeDefinition} from 'sanity'

import {clientType} from './clientType'
import {expertiseType} from './expertiseType'
import {homeType} from './homeType'
import {projectType} from './projectType'
import {skillType} from './skillType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [homeType, projectType, skillType, expertiseType, clientType],
}
