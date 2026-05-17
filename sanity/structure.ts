import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

const SINGLETONS = ['home', 'about', 'siteSettings']
const ORDERABLE_TYPES = ['project', 'skill']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.listItem()
        .title('Home')
        .id('home')
        .child(S.document().schemaType('home').documentId('home')),
      S.listItem()
        .title('About')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'skill',
        title: 'Skills',
        S,
        context,
      }),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? ''
        return !SINGLETONS.includes(id) && !ORDERABLE_TYPES.includes(id)
      }),
    ])
