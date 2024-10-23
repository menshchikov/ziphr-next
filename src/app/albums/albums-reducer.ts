import {AlbumsState} from "./albums-state";
import {getSlicedArray} from "@/services/utils";
import {AlbumsActions} from "./albums-actions";
import {Album} from "@/model/album";

const PAGE_SIZE = 5;

function getFilteredAlbumsByTitle(albums: Album[], filter: string) {
    return albums.filter((a: Album) => a.title.indexOf(filter) > -1);
}

export function albumsReducer(state: AlbumsState, action: any): AlbumsState {
    switch(action.type){
        case AlbumsActions.setPage:{
            return {
                ...state,
                page: action.page,
                pageAlbums: getSlicedArray(state.filteredAlbums, action.page, PAGE_SIZE)
            }
        }
        case AlbumsActions.setAlbums:{
            const filteredAlbums =
                state.filterType === 'title' && state.filterValue
                    ? getFilteredAlbumsByTitle(action.albums, state.filterValue)
                    : action.albums;
            return {
                ...state,
                allAlbums: action.albums,
                filteredAlbums,
                pages: Math.ceil(filteredAlbums.length / PAGE_SIZE),
                pageAlbums: getSlicedArray(filteredAlbums, state.page, PAGE_SIZE)
            }
        }
        case AlbumsActions.setFilters:{
            const filteredAlbums =
                action.filterType === 'title' && action.filterValue
                ? getFilteredAlbumsByTitle(state.allAlbums, action.filterValue)
                : state.allAlbums;
            return {
                ...state,
                filterValue: action.filterValue,
                filterType: action.filterType,
                page: 1,
                filteredAlbums,
                pages: Math.ceil(filteredAlbums.length / PAGE_SIZE),
                pageAlbums: getSlicedArray(filteredAlbums, 1, PAGE_SIZE),
                userId: action.filterType === 'userId' || !action.filterType ? action.filterValue: '',
            }
        }
        default:{
            throw new Error('unknown action');
        }
    }
}