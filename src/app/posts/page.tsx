'use client'
import {useEffect, useReducer, useRef} from 'react';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {debounce} from "lodash";
import {PostsState} from "./posts-state";
import {postsReducer} from "./posts-reducer";
import {PostsActions} from "./posts-actions";
import {getPosts} from "@/services/post-api";
import {Loader} from "@/components/Loader";
import {Paginator} from "@/components/Paginator";
import {useRouter, useSearchParams} from "next/navigation";

function Page() {
    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();

    const [state, dispatch]:[PostsState, any] = useReducer(postsReducer, {}, ():PostsState => {
        const filterValue = searchParams.get('filter') || '';
        const filterType = searchParams.get('filterType') || 'userId';
        const userId = filterType === 'userId' || !filterType ? filterValue: '';
        return {
            page: Number.parseInt(searchParams.get('page') || '1'),
            pages: 1,
            filterValue,
            filterType,
            allPosts: [],
            filteredPosts: [],
            pagePosts: [],
            userId,
        }
    });

    useEffect(() =>{
        const filterValue= searchParams.get('filter') || '';
        const filterType= searchParams.get('filterType') || 'userId';
        if(filterValue !== state.filterValue || filterType !== state.filterType){
            dispatch({
                type: PostsActions.setFilters,
                filterValue,
                filterType,
            });
            return;
        }

        const page= Number.parseInt(searchParams.get('page') || '1');
        if(page !== state.page){
            dispatch({
                type: PostsActions.setPage,
                page,
            })
            return;
        }

    }, [searchParams, state.filterType, state.filterValue, state.page])

    useQueryClient();
    const {isPending, isError, error} = useQuery({
        queryKey: ['posts', state.userId],
        queryFn: async () => {
            const posts = await getPosts(state.userId);
            dispatch({
                type: PostsActions.setPosts,
                posts,
            })
            return posts;
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

    if(isPending) {
        return <Loader/>
    }
    if (isError) {
        return <div>{'Error: '+error}</div>
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
                <input type="text" defaultValue={state.filterValue}
                       className="w-full border-2 bordr-gray-200 rounded-lg p-2" onChange={onFilterChange}/>
            </div>

            <div>
                <label className="block font-bold">Filter type</label>
                <select onChange={onFilterTypeChange} value={state.filterType}
                        className="border-2 border-gray-200 rounded-lg p-2">
                    <option value="userId">User ID</option>
                    <option value="title">Title</option>
                </select>
            </div>
        </div>

        <table cellSpacing={5} cellPadding={5} className="table mt-3">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">User</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
            </tr>
            </thead>
            <tbody>
            {state.pagePosts.map(post => <tr key={post.id}>
                <th className="border-b border-r-gray-200">{post.id}</th>
                <td className="border-b border-r-gray-200"><a className="text-blue-600 visited:text-purple-600 text-nowrap" href={"/users/" + post.userId}>User {post.userId}</a></td>
                <td className="border-b border-r-gray-200"><a className="text-blue-600 visited:text-purple-600" href={"posts/" + post.id}>{post.title}</a></td>
                <td className="border-b border-r-gray-200">{post.body}</td>
            </tr>)}
            </tbody>
        </table>

        <Paginator currentPageNum={state.page} totalPagesCount={state.pages} pageChanged={pageChange}></Paginator>
    </div>);
}

export default Page;