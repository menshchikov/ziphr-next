import {Post} from "@/model/post";

export async function getPostById(id: string): Promise<Post> {
    const url = 'https://jsonplaceholder.typicode.com/posts/';
    const res = await fetch(url + id);
    return await res.json();
}

export async function getPosts(userId?:string): Promise<Post[]> {
    let url = 'https://jsonplaceholder.typicode.com/posts';
    if (userId) {
        url += '?userId=' + userId;
    }
    console.log('fetch ',url);
    const res = await fetch(url);
    return await res.json();
}

export type PostsCollection = { posts: Post[], pages: number };

export async function getPostsInternal(filterType: string, filterValue: string, page: number): Promise<PostsCollection> {
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    if(filterValue){
        if(filterType === 'title'){
            searchParams.set('title', filterValue);
        }else{
            searchParams.set('userId', filterValue);
        }
    }
    const params = searchParams.toString();
    let url = '/api/posts';
    if (params) {
        url += '?' + params;
    }
    console.log('fetch ',url);
    const res = await fetch(url);
    return await res.json();
}