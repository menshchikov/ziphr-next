import {Post} from "@/model/post";

export interface PostsState {
    page: number;
    pages: number;
    filterValue: string;
    // 'userId' | 'title';
    filterType: string;
    allPosts: Post[];
    filteredPosts: Post[];
    pagePosts: Post[];
    userId: string;
}