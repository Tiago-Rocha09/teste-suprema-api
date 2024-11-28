"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.createPage = exports.getPageById = exports.getAllPages = void 0;
const page_service_1 = require("../services/page.service");
const page_schema_1 = require("../schemas/page.schema");
const functions_1 = require("../utils/functions");
const zod_1 = require("zod");
const getAllPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm;
        const pages = yield (0, page_service_1.fetchAllPages)(searchTerm);
        res.json(pages);
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ error: "Erro ao buscar páginas." });
    }
});
exports.getAllPages = getAllPages;
const getPageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield (0, page_service_1.fetchPageById)(Number(req.params.id));
        res.json(page);
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ error: "Erro ao buscar a página." });
    }
});
exports.getPageById = getPageById;
const createPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transformedData = (0, functions_1.transformSectionsData)(req.body, req.files);
        page_schema_1.createPageSchema.parse(transformedData);
        const newPage = yield (0, page_service_1.createNewPage)(transformedData, req.files);
        res.status(201).json(newPage);
    }
    catch (error) {
        console.log({ error });
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((issue) => {
                return issue.message;
            });
            res.status(400).json({ errors: formattedErrors });
        }
        else {
            const errorMessage = error instanceof Error ? error.message : "Erro ao criar a página.";
            res.status(500).json({ message: errorMessage });
        }
    }
});
exports.createPage = createPage;
const updatePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageId = req.params.id;
        const transformedData = (0, functions_1.transformSectionsData)(req.body, req.files);
        page_schema_1.createPageSchema.parse(transformedData);
        const updatedPage = yield (0, page_service_1.updateExistingPage)(pageId, transformedData, req.files);
        res.status(200).json(updatedPage);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((issue) => issue.message);
            res.status(400).json({ errors: formattedErrors });
        }
        else {
            const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar a página.";
            res.status(500).json({ message: errorMessage });
        }
    }
});
exports.updatePage = updatePage;
const deletePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield (0, page_service_1.deletePageById)(Number(req.params.id));
        res.json(page);
    }
    catch (error) {
        console.log({ error });
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((issue) => issue.message);
            res.status(400).json({ errors: formattedErrors });
        }
        else {
            const errorMessage = error instanceof Error ? error.message : "Erro ao deletar a página.";
            res.status(500).json({ message: errorMessage });
        }
    }
});
exports.deletePage = deletePage;
