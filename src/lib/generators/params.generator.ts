import { OpenAPIV3 } from 'openapi-types';

function resolveRef(
  ref: string,
  components: OpenAPIV3.ComponentsObject,
): OpenAPIV3.ParameterObject | undefined {
  const parts = ref.split('/');
  if (parts[0] !== '#' || parts[1] !== 'components' || parts[2] !== 'parameters') {
    return undefined;
  }
  const paramName = parts[3];
  return components.parameters?.[paramName] as OpenAPIV3.ParameterObject;
}

export function generateParams(
  operation: OpenAPIV3.OperationObject,
  components: OpenAPIV3.ComponentsObject,
): string {
  const params: string[] = [];

  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if ('$ref' in param) {
        const resolvedParam = resolveRef(param.$ref, components);
        if (resolvedParam) {
          params.push(generateParam(resolvedParam));
        }
      } else {
        params.push(generateParam(param));
      }
    });
  }

  return params.join(', ');
}

function generateParam(param: OpenAPIV3.ParameterObject): string {
  // Implement the logic to generate a parameter string
  // This is a simplified example; adjust according to your needs
  return `${param.name}: ${getParamType(param)}`;
}

function getParamType(param: OpenAPIV3.ParameterObject): string {
  // Implement logic to determine the parameter type
  // This is a simplified example; adjust according to your schema
  if (param.schema) {
    if ('type' in param.schema) {
      return param.schema.type as string;
    }
    if ('$ref' in param.schema) {
      // Handle schema references if needed
      return 'any'; // or implement resolveSchemaRef
    }
  }
  return 'any';
}
