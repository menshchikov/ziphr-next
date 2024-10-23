import {Album} from "@/model/album";

export interface AlbumsState {
    page: number;
    pages: number;
    filterValue: string;
    // 'userId' | 'title';
    filterType: string;
    allAlbums: Album[];
    filteredAlbums: Album[];
    pageAlbums: Album[];
    userId: string;
}