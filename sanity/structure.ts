import type {StructureResolver} from 'sanity/structure'

const SINGLETONS = ['home']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .id('home')
        .child(S.document().schemaType('home').documentId('home')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() ?? ''),
      ),
    ])
