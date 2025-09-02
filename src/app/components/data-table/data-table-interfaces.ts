export interface DataTableFilter<T = string> {
  filter?: T,
  offset: number,
  take: number
}
