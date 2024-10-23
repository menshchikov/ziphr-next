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
    const res = await fetch(url);
    return await res.json();
}