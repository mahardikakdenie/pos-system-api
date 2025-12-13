export const generateSlug = (input: string): string => {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

export const entities = (PROJECT_SCHEME: string = '*', selectedEntities: string): string => {
  const fields = selectedEntities ? selectedEntities.split(',').map(e => e.trim()) : [];
  if (fields.length === 0) {
    return PROJECT_SCHEME;
  }

  const baseFields = PROJECT_SCHEME
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const customFields = fields
    .map(f => f.trim())
    .filter(f => f.length > 0);

  const allFields = [...baseFields, ...customFields];
  return allFields.join(',');
}
