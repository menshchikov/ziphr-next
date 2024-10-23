'use client'
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getAlbums} from "@/services/album-api";
import {getPosts} from "@/services/post-api";
import {getPhotos} from "@/services/photo-api";
import {Loader} from "@/components/Loader";

function Dashboard() {
    useQueryClient();
    const albumsQuery = useQuery({
        queryKey: ['albums'],
        queryFn: () => getAlbums(),
    });
    const postsQuery = useQuery({
        queryKey: ['posts'],
        queryFn: () => getPosts(),
    });
    const photosQuery = useQuery({
        queryKey: ['photos'],
        queryFn: () => getPhotos(),
    });
    return (<>
            <div className="px-5 py-3 bg-gray-600 text-white" data-ref="header">
                Welcome to
                <h1>My App</h1>
            </div>

            <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="font-bold p-2 bg-gray-200">Statistics</div>
                        {(albumsQuery.isPending || postsQuery.isPending || photosQuery.isPending) && (
                            <Loader/>
                        )}
                        <div className="grid grid-cols-1 xl:grid-cols-3 p-2">
                            <div>
                                <span
                                    className="text-[#32cd32] text-lg font-bold">{postsQuery.data?.length}</span> Posts
                            </div>
                            <div>
                                <span
                                    className="text-[#32cd32] text-lg font-bold">{albumsQuery.data?.length}</span> Albums
                            </div>
                            <div>
                                <span
                                    className="text-[#32cd32] text-lg font-bold">{photosQuery.data?.length}</span> Photos
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="font-bold p-2 bg-gray-200">Latest Posts</div>
                        <div className="p-2">
                            {postsQuery.isPending && (<Loader/>)}
                            {postsQuery.data?.slice(0, 10).map(post =>
                                <div key={post.id} className={"mt-3"}>
                                    <a href={"/posts/" + post.id}
                                       className={"line-clamp-2 text-blue-600 visited:text-purple-600"}>{post.title}</a>
                                    <div className="line-clamp-2 overflow-hidden">{post.body}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="font-bold p-2 bg-gray-200">Recent Photos</div>
                        {photosQuery.isPending && (<Loader/>)}
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {photosQuery.data?.slice(0, 20).map(photo =>
                                <a href={"/photos/" + photo.id}
                                   key={photo.id}
                                   className="border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    <img src={photo.thumbnailUrl} alt="photo" className="w-full h-[50px] object-cover"/>
                                    <div className={"line-clamp-2 p-1"}>{photo.title}</div>
                                </a>)}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Dashboard;