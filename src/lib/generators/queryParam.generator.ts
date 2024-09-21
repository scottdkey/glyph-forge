import { OpenAPIV3 } from 'openapi-types';

export function queryParamGenerator(
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
