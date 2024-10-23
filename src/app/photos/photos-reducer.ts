import {State} from "./photos-state";
import {Photo} from "@/model/photo";
import {ACTIONS} from "./photos-actions";

export const PAGE_SIZE = 8;

export function reducer(state: State, action: any) {
    switch (action.type) {
        case ACTIONS.setPage: {
            const start = (action.page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            let pagePhotos;
            if (action.filterType === 'title' && action.filterValue) {
                const filtered = state.allPhotos.filter(p => p.title.toLowerCase().includes(action.filterValue.toLowerCase()));
                pagePhotos = filtered.slice(start, end);
            } else {
                pagePhotos = state.allPhotos.slice(start, end);
            }
            return {
                ...state,
                page: action.page,
                pagePhotos: pagePhotos,
            };
        }
        case ACTIONS.setFilter: {
            let pagePhotos = state.pagePhotos, pages = state.pages;
            if (action.filterType === 'title' && state.filterType == 'title') {
                const filtered = state.allPhotos.filter(p => p.title.toLowerCase().includes(action.filterValue.toLowerCase()));
                pagePhotos = filtered.slice(0, PAGE_SIZE);
                pages = Math.ceil(filtered.length / PAGE_SIZE);
            }
            return {
                ...state,
                filterValue: action.filterValue,
                filterType: action.filterType,
                queryKey: action.filterType === 'albumId' ? action.filterValue : '',
                page: 1,
                pages,
                pagePhotos,
            };
        }
        case ACTIONS.setPhotos: {
            let pagePhotos, pages;
            if (state.filterType === 'title' && state.filterValue) {
                const filtered = action.photos.filter((p: Photo) => p.title.toLowerCase().includes(state.filterValue.toLowerCase()));
                pagePhotos = filtered.slice(0, PAGE_SIZE);
                pages = Math.ceil(filtered.length / PAGE_SIZE);
            } else {
                pagePhotos = action.photos.slice(0, PAGE_SIZE);
                pages = Math.ceil(action.photos.length / PAGE_SIZE);
            }
            return {
                ...state,
                page: 1,
                pages,
                allPhotos: action.photos,
                pagePhotos,
            }
        }
        default: {
            throw Error('Unknown action.');
        }
    }
}