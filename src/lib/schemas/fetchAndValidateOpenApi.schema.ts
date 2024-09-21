export async function fetchAndValidateOpenApiSchema(source: string, timeout: number) {
  const response = await fetch(source, {
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const schema = await response.json();

  if (!schema.openapi || !['3.0', '3.1'].some((version) => schema.openapi.startsWith(version))) {
    throw new Error(`Invalid OpenAPI version for ${source}. Expected 3.0 or 3.1.`);
  }

  return schema;
}
