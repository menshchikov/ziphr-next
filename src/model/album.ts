import { Photo } from "./photo";

export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface AlbumWithPhotos extends Album{
  photos: Photo[]
}

