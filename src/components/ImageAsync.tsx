'use client'
import React from "react";
import Image from "next/image";
import {Loader} from "@/components/Loader";

interface Props {
    url: string;
    width: number;
    height: number;
    className: string;
}

export function ImageAsync({url, width, height, className}: Props) {
    const [isLoading, setIsLoading] = React.useState(true);
    return <div className="relative">
        <Image src={url}
               alt={url.split('/').pop() || 'image'}
               width={width}
               height={height}
               onLoad={() => setIsLoading(false)}
               onError={() => setIsLoading(false)}
               className={className}
        />
        {isLoading && <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'><Loader/></div>}
    </div>;
}