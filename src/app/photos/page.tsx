'use client'
import React, {useEffect, useReducer} from 'react';
import {Paginator} from "@/components/Paginator";
import {Photo} from "@/model/photo";
import {debounce} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {getPhotos} from "@/services/photo-api";
import {State} from "./photos-state";
import {reducer} from "./photos-reducer";
import {ACTIONS} from "./photos-actions";
import {Loader} from "@/components/Loader";
import {useRouter, useSearchParams} from "next/navigation";

function PhotosPage() {
    const router = useRouter();
    const setSearchParamsDebounced = React.useRef(
        debounce((searchParams) => {
            router.push(`?${searchParams}`);
        }, 500)
    ).current;

    const searchParams = new URLSearchParams(useSearchParams());
    const [state, dispatch]: [State, any] = useReducer(reducer, {}, () => {
        const filterValue = searchParams.get("filter") || '';
        const filterType = searchParams.get("filterType") || 'albumId';
        const page = Number.parseInt(searchParams.get("page") || '1');
        return {
            page,
            pages: 1,
            filterValue,
            filterType,
            allPhotos: [],
            pagePhotos: [],
            queryKey: filterType === 'albumId' ? filterValue : '',
        }
    })

    const {isLoading, isError, error} = useQuery<Photo[]>({
        queryKey: ['photos', state.queryKey],
        queryFn: async () => {
            const result = await getPhotos(state.filterType === 'albumId' && state.filterValue ? state.filterValue : undefined);
            dispatch({
                type: ACTIONS.setPhotos,
                photos: result
            })
            return result;
        },
    })

    useEffect(() => {
        const filterValue = searchParams.get("filter") || '';
        const filterType = searchParams.get("filterType") || 'albumId';
        if (filterValue != state.filterValue || filterType != state.filterType) {
            dispatch({
                type: ACTIONS.setFilter,
                filterValue,
                filterType,
            })
            return;
        }

        const page = Number.parseInt(searchParams.get("page") || '1');
        if (page !== state.page) {
            dispatch({
                type: ACTIONS.setPage,
                page: page,
            })
        }
    }, [searchParams]);

    function pageChange(num: number) {
        searchParams.set('page', num.toString(10));
        router.push(`?${searchParams}`);
    }

    function onFilterChange(e: any) {
        searchParams.set('filter', e.target.value);
        searchParams.set('filterType', state.filterType);
        searchParams.set('page', '1');
        setSearchParamsDebounced(searchParams);
    }

    function onFilterTypeChange(e: any) {
        searchParams.set('filterType', e.target.value);
        if (state.filterValue.length > 0) {
            searchParams.set('page', '1');
        }
        router.push(`?${searchParams}`);
    }

    if (isLoading) {
        return <Loader/>
    }
    if (isError) {
        return <div>{"Error: " + error}</div>
    }

    return (
        <div className="p-2">
            <ol className="flex flex-row gap-2">
                <li className="breadcrumb-item">
                    <a className="text-blue-600 visited:text-purple-600"
                       href="/dashboard">Dashboard</a>
                </li>
                <li>/</li>
                <li className="breadcrumb-item active" aria-current="page">Photos</li>
            </ol>


            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

                <div>
                    <label className="block font-bold">Filter</label>
                    <input type="text" defaultValue={state.filterValue}
                           className="w-full border-2 bordr-gray-200 rounded-lg p-2" onChange={onFilterChange}/>
                </div>

                <div>
                    <label className="block font-bold">Filter type</label>
                    <select onChange={onFilterTypeChange} value={state.filterType}
                            className="border-2 border-gray-200 rounded-lg p-2">
                        <option value="albumId">Album ID</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </div>

            <h1 className="text-4xl font-bold my-4">Photos</h1>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {state.pagePhotos?.map((photo) => (
                    <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <a href={'/photos/' + photo.id} className="text-blue-600 visited:text-purple-600">
                            <img src={photo.thumbnailUrl} alt={photo.thumbnailUrl.split('/').pop()}
                                 className="bg-gray-200 object-cover w-full h-[200px]"></img>
                            <div className="p-1 line-clamp-1">{photo.title}</div>
                        </a>
                        <a href={'/albums/' + photo.albumId} className="text-blue-600 visited:text-purple-600 p-1">View
                            album</a>
                    </div>))}
            </div>

            <Paginator currentPageNum={state.page} totalPagesCount={state.pages} pageChanged={pageChange}/>
        </div>
    );
}

export default PhotosPage;