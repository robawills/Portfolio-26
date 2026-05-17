import {type SchemaTypeDefinition} from 'sanity'

import {aboutBuildBlockType} from './blocks/aboutBuildBlock'
import {mediaGroupBlockType} from './blocks/mediaGroupBlock'
import {aboutType} from './aboutType'
import {clientType} from './clientType'
import {expertiseType} from './expertiseType'
import {homeType} from './homeType'
import {projectType} from './projectType'
import {seoType} from './seoType'
import {siteSettingsType} from './siteSettingsType'
import {skillType} from './skillType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    siteSettingsType,
    homeType,
    aboutType,
    projectType,
    skillType,
    expertiseType,
    clientType,
    mediaGroupBlockType,
    aboutBuildBlockType,
    seoType,
  ],
}
