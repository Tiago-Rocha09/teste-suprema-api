import { Request, Response } from "express";
import {
  createNewPage,
  fetchAllPages,
  updateExistingPage,
  fetchPageById,
  deletePageById,
  fetchPageContentBySlug,
} from "../services/page.service";
import { createPageSchema } from "../schemas/page.schema";
import { transformSectionsData } from "../utils/functions";
import { ZodError } from "zod";

export const getAllPages = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string;
    const pages = await fetchAllPages(searchTerm);
    res.json(pages);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Erro ao buscar páginas." });
  }
};

export const getPageById = async (req: Request, res: Response) => {
  try {
    const page = await fetchPageById(Number(req.params.id));
    res.json(page);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Erro ao buscar a página." });
  }
};

export const getPageContentBySlug = async (req: Request, res: Response) => {
  try {
    const page = await fetchPageContentBySlug(req.params.slug);
    res.json(page);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Erro ao buscar a página." });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const transformedData = transformSectionsData(
      req.body,
      req.files as Express.Multer.File[]
    );

    createPageSchema.parse(transformedData);

    const newPage = await createNewPage(
      transformedData,
      req.files as Express.Multer.File[]
    );
    res.status(201).json(newPage);
  } catch (error) {
    console.log({ error });

    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((issue) => {
        return issue.message;
      });

      res.status(400).json({ errors: formattedErrors });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar a página.";
      res.status(500).json({ message: errorMessage });
    }
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const pageId = req.params.id;
    const transformedData = transformSectionsData(
      req.body,
      req.files as Express.Multer.File[]
    );

    createPageSchema.parse(transformedData);

    const updatedPage = await updateExistingPage(
      pageId,
      transformedData,
      req.files as Express.Multer.File[]
    );
    res.status(200).json(updatedPage);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((issue) => issue.message);
      res.status(400).json({ errors: formattedErrors });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar a página.";
      res.status(500).json({ message: errorMessage });
    }
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await deletePageById(Number(req.params.id));
    res.json(page);
  } catch (error) {
    console.log({ error });
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((issue) => issue.message);
      res.status(400).json({ errors: formattedErrors });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar a página.";
      res.status(500).json({ message: errorMessage });
    }
  }
};
