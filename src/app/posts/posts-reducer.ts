import {PostsState} from "./posts-state";
import {getSlicedArray} from "@/services/utils";
import {PostsActions} from "./posts-actions";
import {Post} from "@/model/post";

const PAGE_SIZE = 5;

function getFilteredPostsByTitle(posts: Post[], filter: string) {
    return posts.filter((a: Post) => a.title.indexOf(filter) > -1);
}

export function postsReducer(state: PostsState, action: any): PostsState {
    switch(action.type){
        case PostsActions.setPage:{
            return {
                ...state,
                page: action.page,
                pagePosts: getSlicedArray(state.filteredPosts, action.page, PAGE_SIZE)
            }
        }
        case PostsActions.setPosts:{
            const filteredPosts =
                state.filterType === 'title' && state.filterValue
                    ? getFilteredPostsByTitle(action.posts, state.filterValue)
                    : action.posts;
            return {
                ...state,
                allPosts: action.posts,
                filteredPosts,
                pages: Math.ceil(filteredPosts.length / PAGE_SIZE),
                pagePosts: getSlicedArray(filteredPosts, state.page, PAGE_SIZE)
            }
        }
        case PostsActions.setFilters:{
            const filteredPosts =
                action.filterType === 'title' && action.filterValue
                ? getFilteredPostsByTitle(state.allPosts, action.filterValue)
                : state.allPosts;
            return {
                ...state,
                filterValue: action.filterValue,
                filterType: action.filterType,
                page: 1,
                filteredPosts,
                pages: Math.ceil(filteredPosts.length / PAGE_SIZE),
                pagePosts: getSlicedArray(filteredPosts, 1, PAGE_SIZE),
                userId: action.filterType === 'userId' || !action.filterType ? action.filterValue: '',
            }
        }
        default:{
            throw new Error('unknown action');
        }
    }
}