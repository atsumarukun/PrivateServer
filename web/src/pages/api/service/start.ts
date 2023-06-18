import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function start(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/start?path=${req.query.path}`,
    { headers: { "Content-Type": req.headers["content-type"] } }
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
