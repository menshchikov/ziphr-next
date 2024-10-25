import {NextRequest} from "next/server";
import {getPosts} from "@/services/post-api";
import {getSlicedArray} from "@/services/utils";

export const POSTS_PAGE_SIZE = 5
export const revalidate = 60

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams);
    const userId = searchParams.get('userId');
    const page = Number(searchParams.get('page')) || 1;
    const title = searchParams.get('title');

    let userPosts = await getPosts(userId || undefined);
    if (title) {
        userPosts = userPosts.filter(p => p.title.toLowerCase().includes(title.toLowerCase()))
    }
    const pages = Math.ceil(userPosts.length / POSTS_PAGE_SIZE);
    const posts = getSlicedArray(userPosts, page, POSTS_PAGE_SIZE);

    const data = {posts, pages};
    return Response.json(data);
}