import React from 'react';
import {QueryClient} from "@tanstack/react-query";
import {getPhotoById} from "@/services/photo-api";
import Link from "next/link";
import {ImageAsync} from "@/components/ImageAsync";

type Props = { params: Promise<{ id: string }> };

const PhotoPage = async ({params}:Props) => {
    const {id} = await params

    const queryClient = new QueryClient();
    const photo = await queryClient.fetchQuery({queryKey: ['photo', id], queryFn: () => getPhotoById(id || '0')});

    if (!photo) {
        return <div className="p-2">
            <h1>Photo not found</h1>
        </div>
    }
    return <div className="p-2">
        <ol className="flex flex-row gap-2">
            <li className="">
                <a className="text-blue-600 visited:text-purple-600"
                   href="/dashboard">Dashboard</a>
            </li>
            <li>/</li>
            <li className="" aria-current="page">
                <Link
                    className="text-blue-600 visited:text-purple-600"
                    href="/photos">Photos</Link>
            </li>
            <li>/</li>
            <li className="font-bold text-blue-700" aria-current="page">{id}</li>
        </ol>
        <h1>{photo.title}</h1>
        <a className="text-blue-600 visited:text-purple-600" href={"/albums/" + photo.albumId}>View Album</a>
        <ImageAsync url={photo.url} width={600} height={600} className="w-auto bg-gray-100 rounded-lg h-[300px] md:h-[600px] object-cover m-auto"/>
    </div>
}

export default PhotoPage;