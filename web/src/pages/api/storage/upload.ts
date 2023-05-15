import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage?path=${req.query.path}`,
    req,
    { headers: { "Content-Type": req.headers["content-type"] } }
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
