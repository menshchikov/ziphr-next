'use client'
import React from "react";
import Image from "next/image";
import classNames from "classnames";
import {Loader} from "@/components/Loader";

interface Props {
    url: string;
    width: number;
    height: number;
}

export function ImageAsync({url, width, height}: Props) {
    const [isLoading, setIsLoading] = React.useState(true);
    return <div className="relative">
        <Image src={url}
               alt={url.split('/').pop() || 'image'}
               width={width}
               height={height}
               onLoad={() => setIsLoading(false)}
               onError={() => setIsLoading(false)}
               className={classNames([
                   "w-auto bg-gray-100 rounded-lg h-[300px] md:h-[600px] object-cover m-auto",
               ])}
        />
        {isLoading && <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'><Loader/></div>}
    </div>;
}