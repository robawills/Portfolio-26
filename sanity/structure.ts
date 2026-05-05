import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

const SINGLETONS = ['home']
const ORDERABLE_TYPES = ['project']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .id('home')
        .child(S.document().schemaType('home').documentId('home')),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? ''
        return !SINGLETONS.includes(id) && !ORDERABLE_TYPES.includes(id)
      }),
    ])
