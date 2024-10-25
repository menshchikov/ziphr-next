'use client'
import {useRef} from 'react';
import {AlbumPhotos} from "./AlbumPhotos";
import {debounce} from "lodash";
import {Loader} from "@/components/Loader";
import {Paginator} from "@/components/Paginator";
import {useRouter, useSearchParams} from "next/navigation";
import {useAlbums} from "@/app/albums/useAlbums";

const PAGE_SIZE = 5;

function AlbumsPage() {

    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();

    const filterValue = searchParams.get('filter') || '';
    const filterType = searchParams.get('filterType') || 'userId';
    const page = Number(searchParams.get('page')) || 1;

    const {isPending, isError, error, result: albums, pages} = useAlbums(filterType, filterValue, page, PAGE_SIZE);


    function pageChange(num: number) {
        searchParams.set('page', num.toString());
        router.push(`?${searchParams}`);
    }

    const setSearchParamsDebounced = useRef(
        debounce((searchParams) => {
            router.push(`?${searchParams}`);
        }, 500)
    ).current;

    function onFilterChange(e: any) {
        const value = e.target.value;
        searchParams.set('filter', value);
        searchParams.set('page', '1');
        setSearchParamsDebounced(searchParams)
    }

    function onFilterTypeChange(e: any) {
        const value = e.target.value;
        searchParams.set('filterType', value);
        searchParams.set('page', '1');
        router.push(`?${searchParams}`);
    }

    if (isError) {
        return <div>{'Error: ' + error}</div>
    }

    return (
        <div className="p-2">
            <ol className="flex flex-row gap-2">
                <li className="breadcrumb-item">
                    <a className="text-blue-600 visited:text-purple-600"
                       href="/dashboard">Dashboard</a>
                </li>
                <li>/</li>
                <li className="breadcrumb-item active" aria-current="page">Albums</li>
            </ol>

            <h1 className="text-4xl font-bold my-4">Albums</h1>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

                <div>
                    <label className="block font-bold">Filter</label>
                    <input type="text" defaultValue={filterValue}
                           className="w-full border-2 bordr-gray-200 rounded-lg p-2" onChange={onFilterChange}/>
                </div>

                <div>
                    <label className="block font-bold">Filter type</label>
                    <select onChange={onFilterTypeChange} value={filterType}
                            className="border-2 border-gray-200 rounded-lg p-2">
                        <option value="userId">User ID</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </div>

            {isPending && <Loader/>}

            {!isPending && <div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 mt-3">
                    {albums.map((album) => (
                        <div key={album.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-200 p-2 line-clamp-1">
                                <a href={'/albums/' + album.id}
                                   className="text-blue-600 visited:text-purple-600">
                                    {album.title}
                                </a>
                            </div>
                            <div className="content-center h-[140px]">
                                <AlbumPhotos albumId={album.id}></AlbumPhotos>
                            </div>
                            <div className="bg-gray-200 p-2">
                                By <a href={'/users/' + album.userId}
                                      className="text-blue-600 visited:text-purple-600">
                                User {album.userId}
                            </a>
                            </div>
                        </div>))}
                </div>

                <Paginator currentPageNum={page} totalPagesCount={pages} pageChanged={pageChange}/>
            </div>}

        </div>
    );
}

export default AlbumsPage;