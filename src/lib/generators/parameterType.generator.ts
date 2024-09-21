import { OpenAPIV3 } from 'openapi-types';
import { schemaTypeGenerator } from './schemaType.generator.js';

export function parameterTypeGenerator(param: OpenAPIV3.ParameterObject): string {
  if (param.schema) {
    if ('$ref' in param.schema) {
      const refName = param.schema.$ref.split('/').pop();
      return `SchemaRefs['${refName}']`;
    } else {
      return schemaTypeGenerator(param.schema);
    }
  }
  return 'any';
}
