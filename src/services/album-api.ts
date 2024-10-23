import {Album} from "@/model/album";

export async function getAlbumById(id: string): Promise<Album> {
    const url = 'https://jsonplaceholder.typicode.com/albums/';
    const res = await fetch(url + id);
    return await res.json();
}

export async function getAlbums(userId?: string): Promise<Album[]> {
    let url = 'https://jsonplaceholder.typicode.com/albums';
    if (userId) {
        url += '?userId=' + userId;
    }
    const res = await fetch(url);
    return await res.json();
}