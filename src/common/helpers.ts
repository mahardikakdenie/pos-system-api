export const generateSlug = (input: string): string => {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

export const entities = (base: string = '*', extras: string = ''): string => {
  if (!extras.trim()) return base;
  const baseFields = base === '*' ? ['*'] : base.split(',').map(s => s.trim()).filter(Boolean);
  const extraFields = extras.split(/,\s*(?![^()]*\))/)
    .map(s => s.trim())
    .filter(Boolean);

  // Prevent Duplicate if base = '*'
  if (base === '*') {
    return `*,${extraFields.join(',')}`;
  }

  return [...baseFields, ...extraFields].join(',');
};
