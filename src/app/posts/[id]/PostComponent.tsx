// 'use client'
import {Post} from "@/model/post";

interface PostComponentProps {
    post: Post;
}

export function PostComponent({post}: PostComponentProps) {
    return <div>
        <h1 className="font-bold text-4xl mt-3">{post?.title}</h1>
        <p>{post?.body}</p>
    </div>;
}