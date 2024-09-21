import { OpenAPIV3 } from 'openapi-types';
import { parameterTypeGenerator } from './parameterType.generator.js';
import { requestBodyGenerator } from './requestBody.generator.js';
import { responseSchemaGenerator } from './responseSchema.generator.js';

export function functionGenerator(
  path: string,
  method: OpenAPIV3.HttpMethods,
  operation: OpenAPIV3.OperationObject,
  components: OpenAPIV3.ComponentsObject | undefined,
): string {
  const functionName = operation.operationId || `${method}${path.replace(/\W+/g, '_')}`;
  const parameters = operation.parameters || [];
  const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject | undefined;

  let paramString = parameters
    .map((param) => {
      const p = param as OpenAPIV3.ParameterObject;
      return `${p.name}: ${parameterTypeGenerator(p)}`;
    })
    .join(', ');

  if (requestBody) {
    paramString += paramString ? ', ' : '';
    paramString += `body: ${requestBodyGenerator(requestBody, components)}`;
  }

  const responseSchema = responseSchemaGenerator(operation, components);

  return `
  async ${functionName}(${paramString}): Promise<${responseSchema}> {
    const baseUrl = this.baseUrls['${operation.tags?.[0] || 'default'}'];
    if (!baseUrl) {
      throw new Error('Base URL not set for ${operation.tags?.[0] || 'default'}');
    }
    const url = new URL(\`\${baseUrl}\${this.generatePath('${path}', { ${parameters.map((p) => (p as OpenAPIV3.ParameterObject).name).join(', ')} })}\`);
    ${generateQueryParams(parameters)}
    const response = await fetch(url.toString(), {
      method: '${method.toUpperCase()}',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      ${requestBody ? 'body: JSON.stringify(body),' : ''}
    });

    const data = await response.json();
    return this.validateResponse ? ${responseSchema}.parse(data) : data;
  }`;
}

function generateQueryParams(
  parameters: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>,
): string {
  const queryParams = parameters.filter(
    (p) => 'in' in p && p.in === 'query',
  ) as OpenAPIV3.ParameterObject[];
  if (queryParams.length === 0) return '';

  return queryParams
    .map(
      (param) =>
        `if (${param.name} !== undefined) url.searchParams.append('${param.name}', ${param.name}.toString());`,
    )
    .join('\n    ');
}
