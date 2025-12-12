type FieldName = string;
type DataRow = Record<FieldName, string>;

export type PartialPayload = Record<FieldName, string | undefined | null>;

export interface MergeOptions {
  profileFields: readonly FieldName[];
  fetchExistingData: (missingFields: string[]) => Promise<DataRow | null>;
}

const pickValidFields = (
  obj: Record<string, unknown>,
  allowedFields: readonly string[],
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const field of allowedFields) {
    const value = obj[field];
    if (typeof value === 'string' && value !== '') {
      result[field] = value;
    }
  }
  return result;
};

/**
 * Merges a partial payload with existing data retrieved from an external source (e.g., a database)
 * to produce a complete, validated record containing only non-empty string values for allowed fields.
 *
 * This utility supports partial updates: the caller may provide only the fields they wish to modify.
 * Any missing or empty fields (undefined, null, or empty string) are fetched from the existing record.
 *
 * @param partialPayload - An object containing optional fields. Values may be string, null, or undefined.
 *                         Only non-empty strings are considered valid input; null, undefined, and empty strings
 *                         are treated as "not provided" and will be replaced with existing values.
 * @param options - Configuration object:
 *   - `profileFields`: an array of field names that are permitted in the final output.
 *   - `fetchExistingData`: an async function that accepts an array of missing field names and returns
 *                          a data record for those fields, or null if no existing data is found.
 *
 * @returns A promise that resolves to a record containing only the allowed fields with non-empty string values.
 *
 * @example
 * const payload = { username: 'new_user' };
 * const result = await mergeWithExisting(payload, {
 *   profileFields: ['username', 'name', 'avatar'],
 *   fetchExistingData: async (missing) => ({ name: 'John Doe', avatar: '...' }),
 * });
 * // result = { username: 'new_user', name: 'John Doe', avatar: '...' }
 */
export const mergeWithExisting = async (
  partialPayload: PartialPayload,
  options: MergeOptions,
): Promise<Record<FieldName, string>> => {
  const { profileFields, fetchExistingData } = options;

  const validKeys = Object.keys(partialPayload).filter((key) => {
    const value = partialPayload[key];
    return value !== undefined && value !== null && value !== '';
  });

  const missingFields = profileFields.filter(
    (field) => !validKeys.includes(field),
  );
  if (missingFields.length === 0) {
    return pickValidFields(partialPayload, profileFields);
  }

  const existingData = await fetchExistingData(missingFields);
  const merged = { ...(existingData ?? {}), ...partialPayload };

  return pickValidFields(merged, profileFields);
};
