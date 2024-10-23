import {Photo} from "@/model/photo";

export interface State {
    page: number;
    pages: number;
    filterValue: string;
    filterType: string;
    pagePhotos: Photo[];
    allPhotos: Photo[];
    queryKey: string;
}