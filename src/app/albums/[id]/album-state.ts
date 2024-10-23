import {Photo} from "@/model/photo";

export interface AlbumState {
    page: number;
    pages: number;
    photos: Photo[];
    filteredPhotos: Photo[];
    pagePhotos: Photo[];
    filter: string;
}