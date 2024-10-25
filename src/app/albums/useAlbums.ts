import {useQuery, useQueryClient} from "@tanstack/react-query";
import {filterArrayByTitle, getSlicedArray} from "@/services/utils";
import {getAlbums} from "@/services/album-api";

export function useAlbums(filterType: string, filter: string, page: number, pageSize: number) {
    useQueryClient();
    const userId = filterType === 'userId' ? filter : '';
    const {isPending, data, isError, error} = useQuery({
        queryKey: ['posts', userId],
        queryFn: () => getAlbums(userId),
    });

    let result = data || [];
    if (filterType === 'title') {
        if (filter) {
            result = filterArrayByTitle(result, filter);
        }
    }
    const pages = Math.ceil(result.length / pageSize);
    result = getSlicedArray(result, page, pageSize)
    return {isPending, isError, error, result, pages};
}