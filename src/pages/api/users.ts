import type {NextApiRequest, NextApiResponse} from "next";

export default async function users(req: NextApiRequest, res:NextApiResponse<object>) {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const result = await fetch(url);
    const users =  await result.json();
    res.status(200).json(users);
}