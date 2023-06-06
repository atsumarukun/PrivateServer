import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function verification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`,
    req.body,
    { headers: { "Content-Type": req.headers["content-type"] } }
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
