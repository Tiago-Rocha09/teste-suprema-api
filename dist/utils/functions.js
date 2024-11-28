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
exports.formatSectionsToDB = exports.groupComponents = exports.transformSectionsData = void 0;
const fileUpload_gateway_1 = require("../gateways/fileUpload.gateway");
const page_types_1 = require("../types/page.types");
const transformSectionsData = (body, files) => {
    const { name, slug, description, sections } = body;
    const processSections = (sections, path = "sections") => {
        return sections.map((section, index) => {
            const currentPath = `${path}[${index}]`;
            if (section.type === page_types_1.ComponentType.Image) {
                const file = files.find((file) => file.fieldname.startsWith(`${currentPath}[value]`));
                return Object.assign(Object.assign({}, section), { value: file || section.value });
            }
            if ((section.type === page_types_1.ComponentType.Grid ||
                section.type === page_types_1.ComponentType.Banner) &&
                Array.isArray(section.children)) {
                return Object.assign(Object.assign({}, section), { children: processSections(section.children, `${currentPath}[children]`) });
            }
            return section;
        });
    };
    const formattedSections = processSections(sections || []);
    return {
        name,
        slug,
        description,
        sections: formattedSections,
    };
};
exports.transformSectionsData = transformSectionsData;
function transformPageComponents(components) {
    const formatComponent = (component) => {
        var _a, _b;
        return ({
            id: component.sessionUuid,
            component: {
                id: component.sessionUuid,
                type: component.type,
                value: ((_a = component.children) === null || _a === void 0 ? void 0 : _a.length) ? null : component.value,
                children: ((_b = component.children) === null || _b === void 0 ? void 0 : _b.length)
                    ? component.children.map(formatComponent)
                    : null,
            },
        });
    };
    return components.map(formatComponent);
}
const groupComponents = (page) => {
    const componentsById = new Map();
    page.components.forEach((component) => {
        const modifiedComponent = Object.assign(Object.assign({}, component), { children: [] });
        if (component.type === "image" && component.value) {
            modifiedComponent.value = (0, fileUpload_gateway_1.fileUrl)(component.value);
        }
        componentsById.set(component.id, modifiedComponent);
    });
    const groupedComponents = [];
    page.components.forEach((component) => {
        if (component.parentId) {
            const parent = componentsById.get(component.parentId);
            if (parent) {
                parent.children.push(componentsById.get(component.id));
            }
        }
        else {
            groupedComponents.push(componentsById.get(component.id));
        }
    });
    const transformComponents = transformPageComponents(groupedComponents);
    delete page.components;
    return Object.assign(Object.assign({}, page), { section: transformComponents });
};
exports.groupComponents = groupComponents;
const formatSectionsToDB = (sections) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedSections = [];
    if (sections) {
        for (const section of sections) {
            if (section.type === "image" && section.value.buffer) {
                const fileName = yield (0, fileUpload_gateway_1.uploadToS3)(section.value);
                formattedSections.push({
                    type: "image",
                    sessionUuid: section.sessionUuid,
                    value: fileName,
                });
            }
            else if (section.type === "image" &&
                typeof section.value === "string") {
                formattedSections.push({
                    type: "image",
                    sessionUuid: section.sessionUuid,
                    value: (0, fileUpload_gateway_1.fileNameFromUrl)(section.value),
                });
            }
            else if (section.children && section.children.length > 0) {
                const formattedChildren = [];
                for (const child of section.children) {
                    if (child.type === "image" && child.value.buffer) {
                        const childFileName = yield (0, fileUpload_gateway_1.uploadToS3)(child.value);
                        formattedChildren.push({
                            type: "image",
                            sessionUuid: child.sessionUuid,
                            value: childFileName,
                        });
                    }
                    else if (child.type === "image" &&
                        typeof child.value === "string") {
                        formattedChildren.push({
                            type: "image",
                            sessionUuid: child.sessionUuid,
                            value: (0, fileUpload_gateway_1.fileNameFromUrl)(child.value),
                        });
                    }
                    else {
                        formattedChildren.push(child);
                    }
                }
                formattedSections.push(Object.assign(Object.assign({}, section), { children: formattedChildren }));
            }
            else {
                formattedSections.push(section);
            }
        }
    }
    return formattedSections;
});
exports.formatSectionsToDB = formatSectionsToDB;
