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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.pageExists = exports.updatePage = exports.createPage = exports.fetchPage = exports.fetchPages = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const functions_1 = require("../utils/functions");
const fetchPages = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = searchTerm
        ? {
            OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { slug: { contains: searchTerm } },
            ],
        }
        : {};
    const pages = yield prisma_1.default.page.findMany({
        where: whereClause,
    });
    return pages.map((page) => (Object.assign(Object.assign({}, page), { id: page.id.toString() })));
});
exports.fetchPages = fetchPages;
const fetchPage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield prisma_1.default.page.findUnique({
        where: { id },
        include: {
            components: true,
        },
    });
    if (!page) {
        throw new Error("Página não encontrada.");
    }
    const formattedPage = Object.assign(Object.assign({}, page), { id: page.id.toString(), components: page.components.map((component) => {
            var _a;
            return (Object.assign(Object.assign({}, component), { sessionUuid: component.sessionUuid, id: component.id.toString(), parentId: ((_a = component.parentId) === null || _a === void 0 ? void 0 : _a.toString()) || null, pageId: component.pageId.toString() }));
        }) });
    return (0, functions_1.groupComponents)(formattedPage);
});
exports.fetchPage = fetchPage;
const createPage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPage = yield prisma_1.default.page.findUnique({
        where: { slug: data.slug },
    });
    if (existingPage) {
        throw new Error("Já existe uma página com essa slug.");
    }
    const formatComponents = (sections, pageId = null, parentId = null) => {
        return sections.map((section) => {
            const { type, value, children, sessionUuid } = section;
            const formattedSection = {
                type,
                value,
                pageId,
                parentId,
                sessionUuid,
                children: children ? formatComponents(children, pageId) : [],
            };
            return formattedSection;
        });
    };
    const createdPage = yield prisma_1.default.page.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
        },
    });
    const formattedSections = formatComponents(data.sections || [], createdPage.id);
    const createComponents = (sections_1, ...args_1) => __awaiter(void 0, [sections_1, ...args_1], void 0, function* (sections, parentId = null) {
        for (const section of sections) {
            const createdComponent = yield prisma_1.default.component.create({
                data: {
                    type: section.type,
                    value: section.value,
                    pageId: section.pageId,
                    parentId: parentId,
                    sessionUuid: section.sessionUuid,
                },
            });
            if (section.children && section.children.length > 0) {
                yield createComponents(section.children, createdComponent.id);
            }
        }
    });
    yield createComponents(formattedSections);
    return Object.assign(Object.assign({}, createdPage), { id: createdPage.id.toString() });
});
exports.createPage = createPage;
const updatePage = (pageId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, description, sections } = data;
    const existingPage = yield prisma_1.default.page.findUnique({
        where: { slug },
        select: { id: true },
    });
    if (existingPage && Number(existingPage.id) !== pageId) {
        throw new Error("Já existe uma página com essa slug.");
    }
    const updatedPage = yield prisma_1.default.page.update({
        where: { id: pageId },
        data: {
            name,
            slug,
            description,
        },
    });
    const formatComponents = (sections, pageId = null, parentId = null) => {
        return sections.map((section) => {
            const { type, value, children, sessionUuid } = section;
            const formattedSection = {
                type,
                value,
                pageId,
                parentId,
                sessionUuid,
                children: children ? formatComponents(children, pageId) : [],
            };
            return formattedSection;
        });
    };
    const formattedSections = formatComponents(sections || [], BigInt(pageId));
    const createComponents = (sections_1, ...args_1) => __awaiter(void 0, [sections_1, ...args_1], void 0, function* (sections, parentId = null) {
        for (const section of sections) {
            const createdComponent = yield prisma_1.default.component.create({
                data: {
                    type: section.type,
                    value: section.value,
                    pageId,
                    parentId,
                    sessionUuid: section.sessionUuid,
                },
            });
            if (section.children && section.children.length > 0) {
                yield createComponents(section.children, createdComponent.id);
            }
        }
    });
    yield prisma_1.default.component.deleteMany({
        where: { pageId },
    });
    yield createComponents(formattedSections);
    return Object.assign(Object.assign({}, updatedPage), { id: updatedPage.id.toString() });
});
exports.updatePage = updatePage;
const pageExists = (pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield prisma_1.default.page.findUnique({ where: { id: pageId } });
    return !!page;
});
exports.pageExists = pageExists;
const deletePage = (pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield prisma_1.default.page.findUnique({
        where: { id: pageId },
    });
    if (!page) {
        throw new Error("Página não encontrada.");
    }
    yield prisma_1.default.page.delete({
        where: { id: pageId },
    });
    return { message: "Página deletada com sucesso." };
});
exports.deletePage = deletePage;
