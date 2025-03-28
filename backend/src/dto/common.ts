export const PAGE_ITEMS_LIMIT = 10;

export interface PaginationDto {
  page: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
}

export interface DefaultResponseDto<T = any, M = {}> {
  type: string;
  data: T;
  meta: M;
}
