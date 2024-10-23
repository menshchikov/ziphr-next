import {Photo} from "@/model/photo";

export function getPhotoById(id: string): Promise<Photo> {
    const url = 'https://jsonplaceholder.typicode.com/photos/';
    return fetch(url + id).then(res => res.json())
}

export function getPhotos(albumId?:string): Promise<Photo[]> {
    let url = 'https://jsonplaceholder.typicode.com/photos';
    if (albumId) {
        url += '?albumId=' + albumId;
    }
    return fetch(url)
        .then(res => res.json())
}