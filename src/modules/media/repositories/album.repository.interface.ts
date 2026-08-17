import { AlbumEntity } from '../entities/album.entity';

export const ALBUM_REPOSITORY = Symbol('ALBUM_REPOSITORY');

export interface CreateAlbumData {
  childId: string;
  name: string;
}

export interface IAlbumRepository {
  findById(id: string): Promise<AlbumEntity | null>;
  findAllByChild(childId: string): Promise<AlbumEntity[]>;
  create(data: CreateAlbumData): Promise<AlbumEntity>;
}
