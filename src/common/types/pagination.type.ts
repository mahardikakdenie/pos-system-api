// src/common/types/pagination.type.ts
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
