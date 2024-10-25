import {QueryClient} from "@tanstack/react-query";
import {getPostById} from "@/services/post-api";
import Link from "next/link";
import {PostComponent} from "@/app/posts/[id]/PostComponent";

type Props = { params: Promise<{ id: string }> };
const Page = async ({params}: Props) => {

    const {id} = await params;
    const queryClient = new QueryClient()
    const post = await queryClient.fetchQuery({
        queryKey: ['post', id],
        queryFn: () => getPostById(id),
    });

    return (<div className="p-2">
        <ol className="flex flex-row gap-2">
            <li className="breadcrumb-item">
                <a className="text-blue-600 visited:text-purple-600"
                   href="/dashboard">Dashboard</a>
            </li>
            <li>/</li>
            <li className="breadcrumb-item">
                <Link className="text-blue-600 visited:text-purple-600"
                      href="/posts">Posts</Link>
            </li>
            <li>/</li>
            <li className="font-bold text-blue-700">{id}</li>
        </ol>
        <PostComponent post={post}/>
    </div>)
}

export default Page;