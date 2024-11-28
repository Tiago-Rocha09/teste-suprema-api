import { Component, Page } from "@prisma/client";
import prisma from "../prisma/prisma";
import { CreatePageSchema } from "../schemas/page.schema";
import { groupComponents } from "../utils/functions";

export const fetchPages = async (searchTerm?: string) => {
  const whereClause = searchTerm
    ? {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { slug: { contains: searchTerm } },
        ],
      }
    : {};

  const pages = await prisma.page.findMany({
    where: whereClause,
  });

  return pages.map((page: Page) => ({
    ...page,
    id: page.id.toString(),
  }));
};

export const selectPages = async () => {
  const pages = await prisma.page.findMany();

  return pages.map((page: Page) => ({
    label: page.name,
    value: page.slug,
  }));
};

export const fetchPage = async (id: number) => {
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      components: true,
    },
  });

  if (!page) {
    throw new Error("Página não encontrada.");
  }
  const formattedPage = {
    ...page,
    id: page.id.toString(),
    components: page.components.map((component: Component) => ({
      ...component,
      sessionUuid: component.sessionUuid,
      id: component.id.toString(),
      parentId: component.parentId?.toString() || null,
      pageId: component.pageId.toString(),
    })),
  };
  return groupComponents(formattedPage);
};

export const fetchPageContent = async (slug: string) => {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      components: true,
    },
  });

  if (!page) {
    throw new Error("Página não encontrada.");
  }
  const formattedPage = {
    ...page,
    id: page.id.toString(),
    components: page.components.map((component: Component) => ({
      ...component,
      sessionUuid: component.sessionUuid,
      id: component.id.toString(),
      parentId: component.parentId?.toString() || null,
      pageId: component.pageId.toString(),
    })),
  };
  return groupComponents(formattedPage);
};

export const createPage = async (data: CreatePageSchema) => {
  const existingPage = await prisma.page.findUnique({
    where: { slug: data.slug },
  });
  if (existingPage) {
    throw new Error("Já existe uma página com essa slug.");
  }

  const formatComponents = (
    sections: any[],
    pageId: bigint | null = null,
    parentId: bigint | null = null
  ): any[] => {
    return sections.map((section) => {
      const { type, value, children, sessionUuid, order } = section;

      const formattedSection = {
        type,
        value,
        pageId,
        parentId,
        sessionUuid,
        order,
        children: children ? formatComponents(children, pageId) : [],
      };

      return formattedSection;
    });
  };

  const createdPage = await prisma.page.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  });

  const formattedSections = formatComponents(
    data.sections || [],
    createdPage.id
  );

  const createComponents = async (
    sections: any[],
    parentId: bigint | null = null
  ) => {
    for (const section of sections) {
      const createdComponent = await prisma.component.create({
        data: {
          type: section.type,
          value: section.value,
          pageId: section.pageId,
          parentId: parentId,
          order: section.order,
          sessionUuid: section.sessionUuid,
        },
      });

      if (section.children && section.children.length > 0) {
        await createComponents(section.children, createdComponent.id);
      }
    }
  };

  await createComponents(formattedSections);

  return { ...createdPage, id: createdPage.id.toString() };
};

export const updatePage = async (pageId: number, data: CreatePageSchema) => {
  const { name, slug, description, sections } = data;

  const existingPage = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingPage && Number(existingPage.id) !== pageId) {
    throw new Error("Já existe uma página com essa slug.");
  }

  const updatedPage = await prisma.page.update({
    where: { id: pageId },
    data: {
      name,
      slug,
      description,
    },
  });

  const formatComponents = (
    sections: any[],
    pageId: bigint | null = null,
    parentId: bigint | null = null
  ): any[] => {
    return sections.map((section) => {
      const { type, value, children, sessionUuid, order } = section;

      const formattedSection = {
        type,
        value,
        pageId,
        parentId,
        sessionUuid,
        order,
        children: children ? formatComponents(children, pageId) : [],
      };

      return formattedSection;
    });
  };

  const formattedSections = formatComponents(sections || [], BigInt(pageId));

  const createComponents = async (
    sections: any[],
    parentId: bigint | null = null
  ) => {
    for (const section of sections) {
      const createdComponent = await prisma.component.create({
        data: {
          type: section.type,
          value: section.value,
          pageId,
          parentId,
          order: section.order,
          sessionUuid: section.sessionUuid,
        },
      });

      if (section.children && section.children.length > 0) {
        await createComponents(section.children, createdComponent.id);
      }
    }
  };

  await prisma.component.deleteMany({
    where: { pageId },
  });

  await createComponents(formattedSections);

  return { ...updatedPage, id: updatedPage.id.toString() };
};

export const pageExists = async (pageId: number) => {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  return !!page;
};

export const deletePage = async (pageId: number) => {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
  });

  if (!page) {
    throw new Error("Página não encontrada.");
  }

  await prisma.page.delete({
    where: { id: pageId },
  });

  return { message: "Página deletada com sucesso." };
};
