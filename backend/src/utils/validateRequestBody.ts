export function validateRequestBody(body: any, requiredFields: string[], optionalFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `Campo ${field} é obrigatório.`;
    }
  }
  for (const field of optionalFields) {
    if (body[field] === undefined) {
      continue;
    }
  }

  return null;
}