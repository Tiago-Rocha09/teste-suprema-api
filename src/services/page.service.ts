import { uploadToS3 } from "../gateways/fileUpload.gateway";
import {
  fetchPages,
  fetchPage,
  createPage,
  pageExists,
  updatePage,
  deletePage,
  fetchPageContent,
  selectPages,
} from "../repositories/page.repository";
import { CreatePageSchema } from "../schemas/page.schema";
import { formatSectionsToDB } from "../utils/functions";

export const fetchAllPages = async (searchTerm?: string) => {
  return await fetchPages(searchTerm);
};

export const selectAllPages = async () => {
  return await selectPages();
};

export const fetchPageById = async (id: number) => {
  const page = await fetchPage(id);
  if (!page) throw new Error("Página não encontrada.");
  return page;
};

export const fetchPageContentBySlug = async (slug: string) => {
  const page = await fetchPageContent(slug);
  if (!page) throw new Error("Página não encontrada.");
  return page;
};

export const createNewPage = async (
  data: CreatePageSchema,
  files: Express.Multer.File[]
) => {
  const { name, slug, description, sections } = data;

  const formattedSections: any = await formatSectionsToDB(sections);
  console.log({ formattedSections });
  const pageData = {
    name,
    slug,
    description,
    sections: formattedSections,
  };

  return await createPage(pageData);
};

export const updateExistingPage = async (
  pageId: string,
  data: CreatePageSchema,
  files: Express.Multer.File[]
) => {
  const { name, slug, description, sections } = data;

  const existingPage = await pageExists(Number(pageId));
  if (!existingPage) {
    throw new Error("Página não encontrada.");
  }

  const formattedSections: any = await formatSectionsToDB(sections);
  console.log({ formattedSections });
  const pageData = {
    name,
    slug,
    description,
    sections: formattedSections,
  };

  return await updatePage(Number(pageId), pageData);
};

export const deletePageById = async (id: number) => {
  const result = await deletePage(id);
  if (!result) throw new Error("Página não encontrada.");
  return result;
};
