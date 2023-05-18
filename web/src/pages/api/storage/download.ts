import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function rename(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_STORAGE}/${req.query.key}`,
    { responseType: "arraybuffer" }
  );
  res.send(response.data);
}
