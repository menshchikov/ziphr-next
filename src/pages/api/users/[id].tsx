import type {NextApiRequest, NextApiResponse} from "next";


export default async function users(req: NextApiRequest, res: NextApiResponse<object>) {
    const url = 'https://jsonplaceholder.typicode.com/users/';
    const {id} = req.query;
    const result = await fetch(url + id);
    const users = await result.json();
    res.status(200).json(users);
}