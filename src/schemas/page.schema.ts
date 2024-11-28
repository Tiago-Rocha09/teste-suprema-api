import { z } from "zod";
import { ComponentType } from "../types/page.types";

const BaseComponent = z.object({
  type: z.union([
    z.literal(ComponentType.Text),
    z.literal(ComponentType.RichText),
  ]),
  value: z.string(),
});

const ImageComponent = z.object({
  type: z.literal(ComponentType.Image),
  value: z.union([z.string(), z.instanceof(Object)]),
});

const GridComponent = z.object({
  type: z.union([
    z.literal(ComponentType.Grid),
    z.literal(ComponentType.Banner),
  ]),
  children: z.array(z.any()),
});

const Component: z.ZodTypeAny = z.union([
  BaseComponent,
  ImageComponent,
  GridComponent,
]);

export const createPageSchema = z.object({
  name: z.string({
    required_error: "Nome da página é obrigatório",
    invalid_type_error: "O nome da página deve ser uma string",
  }),
  slug: z.string({
    required_error: "Slug é obrigatório",
    invalid_type_error: "O slug deve ser uma string",
  }),
  description: z.string().optional(),
  sections: z.array(z.any()).optional(),
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
export type SectionSchema = z.infer<typeof Component>;
