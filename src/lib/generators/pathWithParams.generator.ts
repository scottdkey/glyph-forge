export function pathWithParamsGenerator(path: string): string {
  return path.replace(/{(\w+)}/g, '${$1}');
}
