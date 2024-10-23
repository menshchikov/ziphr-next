'use client'
import {useEffect, useReducer, useRef} from 'react';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getAlbumById} from "@/services/album-api";
import {getPhotos} from "@/services/photo-api";
import {Paginator} from "@/components/Paginator";
import {debounce} from "lodash";
import {AlbumState} from "./album-state";
import {AlbumActions} from "./album-actions";
import {albumReducer} from "./album-reducer";
import {useParams, useRouter, useSearchParams} from "next/navigation";

const AlbumSinglePage = () => {
    const id = useParams().id as string;

    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();

    const [state, dispatch]: [AlbumState, any] = useReducer(albumReducer, {
        page: Number.parseInt(searchParams.get("page") || '1'),
        pages: 1,
        filter: searchParams.get("filter") || '',
        photos: [],
        filteredPhotos: [],
        pagePhotos:[],
    });

    const pageChange = (page: number) => {
        searchParams.set('page', page.toString());
        router.push(`?${searchParams}`);
    }

    useQueryClient();
    const albumQuery = useQuery({queryKey: ['album', id], queryFn: () => getAlbumById(id || '0')});
    const photosQuery = useQuery({
        queryKey: ['photos', id],
        queryFn: async () => {
            const result = await getPhotos(id);
            dispatch({
                type: AlbumActions.setPhotos,
                photos: result,
            });
            return result;
        }
    });

    useEffect(() => {
        const filter = searchParams.get("filter") || '';
        if(filter !== state.filter){
            dispatch({
                type: AlbumActions.setFilter,
                filter,
            });
            return;
        }
        const page = Number.parseInt(searchParams.get("page") || '1');
        if(page !== state.page){
            dispatch({
                type: AlbumActions.setPage,
                page,
            });
            return;
        }
    }, [searchParams])

    const setSearchParamsDebounced = useRef(
        debounce((searchParams) => {
            router.push(`?${searchParams}`);
        }, 500)
    ).current;

    function onFilterChange(e: any) {
        const title = e.target.value;
        if (!title) {
            searchParams.delete('filter');
        } else {
            searchParams.set('filter', title);
        }
        searchParams.set('page', '1');
        setSearchParamsDebounced(searchParams);
    }

    if (albumQuery.isPending || photosQuery.isPending) {
        return <span className="loader m-2"></span>
    }

    if (albumQuery.isError || photosQuery.isError) {
        return <div className="p-2">
            {'An error has occurred: ' + (albumQuery.error || photosQuery.error)}
        </div>
    }

    if (!albumQuery.data || !photosQuery.data) {
        return <div className="p-2">
            <h1>Photo not found</h1>
        </div>
    }

    return <div className="p-2">
        <ol className="flex flex-row gap-2">
            <li className="">
                <a className="text-blue-600 visited:text-purple-600"
                   href="/dashboard">Dashboard</a>
            </li>
            <li>/</li>
            <li className="" aria-current="page">
                <a
                    className="text-blue-600 visited:text-purple-600"
                    href="/albums">Albums</a>
            </li>
            <li>/</li>
            <li className="font-bold text-blue-700" aria-current="page">{id}</li>
        </ol>

        <h1>{albumQuery.data.title}</h1>

        <div className="my-3">
            <label className="block font-bold">Filter by title</label>
            <input type="text" defaultValue={state.filter || ''}
                   className="w-full border-2 bordr-gray-200 rounded-lg p-2" onChange={onFilterChange}/>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.pagePhotos.map((photo) => (
                <a key={photo.id}
                   className="border border-gray-200 rounded-lg overflow-hidden text-blue-600 visited:text-purple-600"
                   href={'/photos/' + photo.id}
                >
                    <img src={photo.thumbnailUrl} alt={photo.thumbnailUrl.split('/').pop()}
                         className="bg-gray-200 object-cover w-full h-[200px]"></img>
                    <div className="p-1 line-clamp-2">{photo.title}</div>
                </a>
            ))}
        </div>

        <Paginator currentPageNum={state.page} totalPagesCount={state.pages} pageChanged={pageChange}/>
    </div>
}

export default AlbumSinglePage;