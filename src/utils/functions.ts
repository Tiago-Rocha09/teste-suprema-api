import {
  fileNameFromUrl,
  fileUrl,
  uploadToS3,
} from "../gateways/fileUpload.gateway";
import { ComponentType } from "../types/page.types";

export const transformSectionsData = (
  body: any,
  files: Express.Multer.File[]
) => {
  const { name, slug, description, sections } = body;

  const processSections = (sections: any, path: string = "sections") => {
    return sections.map((section: any, index: number) => {
      const currentPath = `${path}[${index}]`;

      if (section.type === ComponentType.Image) {
        const file = files.find((file) =>
          file.fieldname.startsWith(`${currentPath}[value]`)
        );

        return {
          ...section,
          value: file || section.value,
        };
      }

      if (
        (section.type === ComponentType.Grid ||
          section.type === ComponentType.Banner) &&
        Array.isArray(section.children)
      ) {
        return {
          ...section,
          children: processSections(
            section.children,
            `${currentPath}[children]`
          ),
        };
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

function transformPageComponents(components: any) {
  const formatComponent = (component: any) => ({
    id: component.sessionUuid,
    component: {
      id: component.sessionUuid,
      type: component.type,
      value: component.children?.length ? null : component.value,
      children: component.children?.length
        ? component.children.map(formatComponent)
        : null,
    },
  });

  return components.map(formatComponent);
}

export const groupComponents = (page: any) => {
  const componentsById = new Map<string, any>();

  page.components.forEach((component: any) => {
    const modifiedComponent = {
      ...component,
      children: [],
    };

    if (component.type === "image" && component.value) {
      modifiedComponent.value = fileUrl(component.value);
    }

    componentsById.set(component.id, modifiedComponent);
  });

  const groupedComponents: any = [];
  page.components.forEach((component: any) => {
    if (component.parentId) {
      const parent = componentsById.get(component.parentId);
      if (parent) {
        parent.children.push(componentsById.get(component.id));
      }
    } else {
      groupedComponents.push(componentsById.get(component.id));
    }
  });

  const transformComponents = transformPageComponents(groupedComponents);
  delete page.components;
  return {
    ...page,
    section: transformComponents,
  };
};

export const formatSectionsToDB = async (sections: any) => {
  const formattedSections: any = [];

  if (sections) {
    for (const section of sections) {
      if (section.type === "image" && section.value.buffer) {
        const fileName = await uploadToS3(section.value);
        formattedSections.push({
          type: "image",
          sessionUuid: section.sessionUuid,
          value: fileName,
        });
      } else if (
        section.type === "image" &&
        typeof section.value === "string"
      ) {
        formattedSections.push({
          type: "image",
          sessionUuid: section.sessionUuid,
          value: fileNameFromUrl(section.value),
        });
      } else if (section.children && section.children.length > 0) {
        const formattedChildren: any = [];
        for (const child of section.children) {
          if (child.type === "image" && child.value.buffer) {
            const childFileName = await uploadToS3(child.value);
            formattedChildren.push({
              type: "image",
              sessionUuid: child.sessionUuid,
              value: childFileName,
            });
          } else if (
            child.type === "image" &&
            typeof child.value === "string"
          ) {
            formattedChildren.push({
              type: "image",
              sessionUuid: child.sessionUuid,
              value: fileNameFromUrl(child.value),
            });
          } else {
            formattedChildren.push(child);
          }
        }
        formattedSections.push({
          ...section,
          children: formattedChildren,
        });
      } else {
        formattedSections.push(section);
      }
    }
  }
  return formattedSections;
};
