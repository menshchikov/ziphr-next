'use client'
import {useQuery} from "@tanstack/react-query";
import {getUserById} from "@/services/user-api";
import {UserAlbums} from "./UserAlbums";
import {UserPosts} from "./UserPosts";
import {Loader} from "@/components/Loader";
import {useParams} from "next/navigation";

const UserPage = () => {
    const id = useParams().id as string;
    const {isPending, isError, data:user, error} = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id || '0'),
    })

    if(isPending){
        return <Loader/>
    }
    if(isError){
        return <div>{'Error: '+error}</div>
    }

    return (<div className="p-2">
        <div className="px-5 py-3 bg-blue-500 text-white">
            <h1>{user.name}</h1>
            <div className="text-light">
                <span>@{user.username}</span>
                &mdash;
                <span>{user.email}</span>
                &mdash;
                <span>{user.website}</span>
                &mdash;
                <span>{user.company.name}</span>
                &mdash;
                <span>{user.address.city}</span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 ">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-200 p-2 font-bold">Albums</div>
                <UserAlbums userId={id}></UserAlbums>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-200 p-2 font-bold">Photos</div>
                <UserPosts userId={id}></UserPosts>
            </div>
        </div>
    </div>)
}

export default UserPage;