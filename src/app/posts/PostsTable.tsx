import {Paginator} from "@/components/Paginator";
import {PostsCollection} from "@/services/post-api";

interface PostsTableProps {
    postsCollection: PostsCollection;
    page: number,
    onPageChange: (n: number) => void;
}

export function PostsTable(props: PostsTableProps) {
    const {postsCollection, page, onPageChange} = props;
    return <>
        <table cellSpacing={5} cellPadding={5} className="table mt-3">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">User</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
            </tr>
            </thead>
            <tbody>
            {postsCollection.posts.map(post => <tr key={post.id}>
                <th className="border-b border-r-gray-200">{post.id}</th>
                <td className="border-b border-r-gray-200"><a
                    className="text-blue-600 visited:text-purple-600 text-nowrap"
                    href={"/users/" + post.userId}>User {post.userId}</a></td>
                <td className="border-b border-r-gray-200"><a className="text-blue-600 visited:text-purple-600"
                                                              href={"posts/" + post.id}>{post.title}</a></td>
                <td className="border-b border-r-gray-200">{post.body}</td>
            </tr>)}
            </tbody>
        </table>
        <Paginator currentPageNum={page} totalPagesCount={postsCollection.pages} pageChanged={onPageChange}></Paginator>
    </>
}