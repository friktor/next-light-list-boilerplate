export interface PaginationDto {
  page: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
}

export interface DefaultResponseDto<T, M = undefined> {
  type: string;
  data: T;
  meta: M;
}
