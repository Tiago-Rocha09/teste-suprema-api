"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPageSchema = void 0;
const zod_1 = require("zod");
const page_types_1 = require("../types/page.types");
const BaseComponent = zod_1.z.object({
    type: zod_1.z.union([
        zod_1.z.literal(page_types_1.ComponentType.Text),
        zod_1.z.literal(page_types_1.ComponentType.RichText),
    ]),
    value: zod_1.z.string(),
});
const ImageComponent = zod_1.z.object({
    type: zod_1.z.literal(page_types_1.ComponentType.Image),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.instanceof(Object)]),
});
const GridComponent = zod_1.z.object({
    type: zod_1.z.union([
        zod_1.z.literal(page_types_1.ComponentType.Grid),
        zod_1.z.literal(page_types_1.ComponentType.Banner),
    ]),
    children: zod_1.z.array(zod_1.z.any()),
});
const Component = zod_1.z.union([
    BaseComponent,
    ImageComponent,
    GridComponent,
]);
exports.createPageSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Nome da página é obrigatório",
        invalid_type_error: "O nome da página deve ser uma string",
    }),
    slug: zod_1.z.string({
        required_error: "Slug é obrigatório",
        invalid_type_error: "O slug deve ser uma string",
    }),
    description: zod_1.z.string().optional(),
    sections: zod_1.z.array(zod_1.z.any()).optional(),
});
