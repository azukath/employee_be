export class ResponsePaginationDTO<T> {
  total: number;
  page: number;
  perPage: number;
  data: T[];
}
