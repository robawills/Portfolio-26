import { AboutBuild } from "@/components/AboutBuild";
import { ClientMarquee } from "@/components/ClientMarquee";
import { HomeHero } from "@/components/HomeHero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const HOME_QUERY = `{
  "home": *[_type == "home"][0]{
    heroTitle,
    description,
    heroImage{..., asset->{_id, metadata{dimensions}}},
    aboutBuildSignpost,
    aboutBuildDescription
  },
  "projects": *[_type == "project"] | order(orderRank){
    _id,
    title,
    "slug": slug.current,
    descriptionCard,
    "cover": cardImage{..., asset->{_id, metadata{dimensions}}},
    "coverMobile": cardImageMobile{..., asset->{_id, metadata{dimensions}}},
    "skillNames": skills[]->name,
    links[]{_key, title, url}
  },
  "clients": *[_type == "client"] | order(name asc){name}
}`;

type SanityImage = {
  alt?: string;
  asset?: {
    _id: string;
    metadata?: { dimensions?: { width: number; height: number } };
  };
};

type Home = {
  heroTitle?: string;
  description?: string;
  heroImage?: SanityImage;
  aboutBuildSignpost?: string;
  aboutBuildDescription?: string;
};

type Project = {
  _id: string;
  title: string;
  slug: string;
  descriptionCard: string;
  cover?: SanityImage;
  coverMobile?: SanityImage;
  skillNames?: string[];
  links?: { _key: string; title: string; url: string }[];
};

type Client = {
  name?: string;
};

export default async function HomePage() {
  const { home, projects, clients } = await client.fetch<{
    home: Home | null;
    projects: Project[];
    clients: Client[];
  }>(HOME_QUERY);

  const clientNames = clients
    .map((c) => c.name)
    .filter((name): name is string => Boolean(name));

  const projectCards = projects
    .filter((project) => project.cover?.asset)
    .map((project) => ({
      href: `/projects/${project.slug}`,
      title: project.title,
      description: project.descriptionCard,
      image: {
        src: urlFor(project.cover!).width(1600).fit("max").auto("format").url(),
        alt: project.cover!.alt ?? project.title,
      },
      mobileImage: project.coverMobile?.asset
        ? {
            src: urlFor(project.coverMobile)
              .width(900)
              .fit("max")
              .auto("format")
              .url(),
            alt: project.coverMobile.alt ?? project.title,
          }
        : undefined,
      tags: project.skillNames,
      links: (project.links ?? []).map((link) => ({
        label: link.title,
        href: link.url,
      })),
    }));

  return (
    <main>
      <HomeHero
        title={home?.heroTitle ?? "Add a hero title in the Studio"}
        description={home?.description ?? "Add a description in the Studio"}
      />

      {projectCards.length > 0 ? (
        <ProjectGrid projects={projectCards} />
      ) : (
        <p>No projects yet — add one in the Studio.</p>
      )}

      <AboutBuild
        signpost={home?.aboutBuildSignpost ?? undefined}
        description={home?.aboutBuildDescription ?? undefined}
      />

      <ClientMarquee clients={clientNames} />
    </main>
  );
}
