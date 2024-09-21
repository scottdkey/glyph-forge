import { OpenAPIV3 } from 'openapi-types';

export function generateHeaders(operation: OpenAPIV3.OperationObject): string {
  const headers: string[] = [
    "'Content-Type': 'application/json'",
    'Authorization: `Bearer ${token}`',
  ];

  if (operation.parameters) {
    const headerParams = operation.parameters.filter(
      (param): param is OpenAPIV3.ParameterObject => !('$ref' in param) && param.in === 'header',
    );

    headerParams.forEach((param) => {
      headers.push(`'${param.name}': ${param.name}`);
    });
  }

  return `{
    ${headers.join(',\n    ')}
  }`;
}
