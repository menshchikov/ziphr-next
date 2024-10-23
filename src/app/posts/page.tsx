'use client'
import {useRef} from 'react';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {debounce} from "lodash";
import {getPostsInternal} from "@/services/post-api";
import {Loader} from "@/components/Loader";
import {useRouter, useSearchParams} from "next/navigation";
import {PostsTable} from "@/app/posts/PostsTable";

function PostsPage() {
    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();

    const filterValue = searchParams.get('filter') || '';
    const filterType = searchParams.get('filterType') || 'userId';
    const page = Number.parseInt(searchParams.get('page') || '1');

    useQueryClient();
    const {isPending, data: postsCollection, isError, error} = useQuery({
        queryKey: ['posts', filterType, filterValue, page],
        queryFn: async () => {
            return await getPostsInternal(filterType, filterValue, page);
        },
    });

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

    if (isPending) {
        return <Loader/>
    }
    if (isError) {
        return <div>{'Error: ' + error}</div>
    }

    return (<div className="p-2">

        <ol className="flex flex-row gap-2">
            <li className="breadcrumb-item">
                <a className="text-blue-600 visited:text-purple-600"
                   href="/dashboard">Dashboard</a>
            </li>
            <li>/</li>
            <li className="font-bold text-blue-700">Posts</li>
        </ol>

        <h1 className="text-4xl font-bold my-4">Posts</h1>

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

        <PostsTable postsCollection={postsCollection} page={page} onPageChange={pageChange}/>

    </div>);
}

export default PostsPage;