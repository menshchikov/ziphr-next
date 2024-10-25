import {useQuery, useQueryClient} from "@tanstack/react-query";
import {filterArrayByTitle, getSlicedArray} from "@/services/utils";
import {getPhotos} from "@/services/photo-api";

export function usePhotos(albumId: string, title: string, page: number, pageSize: number) {
    useQueryClient();
    const {isPending, data, isError, error} = useQuery({
        queryKey: ['photos', albumId],
        queryFn: () => getPhotos(albumId),
    });

    let photos = data || [];
    if (title) {
            photos = filterArrayByTitle(photos, title);
    }
    const pages = Math.ceil(photos.length / pageSize);
    photos = getSlicedArray(photos, page, pageSize)
    return {isPending, isError, error, photos, pages};
}