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
exports.deletePageById = exports.updateExistingPage = exports.createNewPage = exports.fetchPageById = exports.fetchAllPages = void 0;
const page_repository_1 = require("../repositories/page.repository");
const functions_1 = require("../utils/functions");
const fetchAllPages = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, page_repository_1.fetchPages)(searchTerm);
});
exports.fetchAllPages = fetchAllPages;
const fetchPageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield (0, page_repository_1.fetchPage)(id);
    if (!page)
        throw new Error("Página não encontrada.");
    return page;
});
exports.fetchPageById = fetchPageById;
const createNewPage = (data, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, description, sections } = data;
    const formattedSections = yield (0, functions_1.formatSectionsToDB)(sections);
    const pageData = {
        name,
        slug,
        description,
        sections: formattedSections,
    };
    return yield (0, page_repository_1.createPage)(pageData);
});
exports.createNewPage = createNewPage;
const updateExistingPage = (pageId, data, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, description, sections } = data;
    const existingPage = yield (0, page_repository_1.pageExists)(Number(pageId));
    if (!existingPage) {
        throw new Error("Página não encontrada.");
    }
    const formattedSections = yield (0, functions_1.formatSectionsToDB)(sections);
    const pageData = {
        name,
        slug,
        description,
        sections: formattedSections,
    };
    return yield (0, page_repository_1.updatePage)(Number(pageId), pageData);
});
exports.updateExistingPage = updateExistingPage;
const deletePageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, page_repository_1.deletePage)(id);
    if (!result)
        throw new Error("Página não encontrada.");
    return result;
});
exports.deletePageById = deletePageById;
