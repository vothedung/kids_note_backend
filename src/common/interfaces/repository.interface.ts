export interface IRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  save(entity: Partial<TEntity>): Promise<TEntity>;
  update(id: string, data: Partial<TEntity>): Promise<TEntity>;
  softDelete(id: string): Promise<void>;
}

export interface PaginatedResult<TEntity> {
  data: TEntity[];
  cursor: string | null;
  hasMore: boolean;
}
