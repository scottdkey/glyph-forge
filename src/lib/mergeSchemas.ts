import { OpenAPIV3 } from 'openapi-types';

export interface MergedSchemas extends Omit<OpenAPIV3.Document, 'components' | 'paths'> {
  components: OpenAPIV3.ComponentsObject;
  paths: OpenAPIV3.PathsObject;
}

export function mergeSchemas(schemas: OpenAPIV3.Document[]): MergedSchemas {
  const mergedComponents: OpenAPIV3.ComponentsObject = {};
  const mergedPaths: OpenAPIV3.PathsObject = {};

  schemas.forEach((schema, index) => {
    if (schema.components) {
      Object.entries(schema.components).forEach(([key, value]) => {
        if (!mergedComponents[key as keyof OpenAPIV3.ComponentsObject]) {
          mergedComponents[key as keyof OpenAPIV3.ComponentsObject] = {};
        }
        Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
          const componentObject = mergedComponents[
            key as keyof OpenAPIV3.ComponentsObject
          ] as Record<string, unknown>;
          const uniqueKey = componentObject[subKey] ? `${subKey}_${index + 1}` : subKey;
          componentObject[uniqueKey] = subValue;
        });
      });
    }

    if (schema.paths) {
      Object.entries(schema.paths).forEach(([pathKey, pathValue]) => {
        const uniquePathKey = mergedPaths[pathKey] ? `${pathKey}_${index + 1}` : pathKey;
        mergedPaths[uniquePathKey] = pathValue as OpenAPIV3.PathItemObject;
      });
    }
  });

  // Extract openapi and info from the first schema
  const { openapi, info } = schemas[0];

  return { components: mergedComponents, paths: mergedPaths, openapi, info };
}
