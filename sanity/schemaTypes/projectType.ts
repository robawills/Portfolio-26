import {
  defineArrayMember,
  defineField,
  defineType,
  type ReferenceFilterResolver,
} from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

const excludeSelectedRefs: ReferenceFilterResolver = ({ parent }) => {
  const refs = Array.isArray(parent)
    ? parent.flatMap((item) => {
        const ref = (item as { _ref?: string })._ref;
        return ref ? [ref] : [];
      })
    : [];
  return refs.length ? { filter: "!(_id in $refs)", params: { refs } } : {};
};

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "project" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionCard",
      title: "Card Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "cardImage",
      title: "Card image",
      description: "Shown only on the home page project cards.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardImageMobile",
      title: "Card image (mobile)",
      description:
        "Portrait variant shown on the home page project cards on mobile (<768px). Falls back to the main card image if empty.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "Ordered page builder. Add Media groups and About / Build sections in any order; reorder by dragging.",
      type: "array",
      of: [
        defineArrayMember({ type: "mediaGroupBlock" }),
        defineArrayMember({ type: "aboutBuildBlock" }),
      ],
    }),
    // Legacy fields kept on the schema so the Studio recognises pre-existing
    // data on older project documents. Copy any content into the Body field
    // above, then clear these. They're no longer used by the rendered page.
    defineField({
      name: "build",
      title: "Build (legacy)",
      type: "text",
      rows: 4,
      deprecated: {
        reason: "Moved into Body → About / Build section. Clear once migrated.",
      },
    }),
    defineField({
      name: "images",
      title: "Images (legacy)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
      deprecated: {
        reason: "Moved into Body → Media group. Clear once migrated.",
      },
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "skill" }],
          options: { filter: excludeSelectedRefs },
        }),
      ],
      options: { layout: "tags" },
    }),
    defineField({
      name: "expertise",
      title: "Expertise",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "Expertise" }],
          options: { filter: excludeSelectedRefs },
        }),
      ],
      options: { layout: "tags" },
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "link",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: { select: { title: "title", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "cardImage" },
  },
});
