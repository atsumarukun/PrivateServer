import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rename(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage?key=${req.query.key}`,
    req.body,
    { headers: { "Content-Type": req.headers["content-type"] } }
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
