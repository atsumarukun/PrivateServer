import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    responseLimit: "500mb",
  },
};

export default async function rename(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/download?key=${req.query.key}`,
    { responseType: "arraybuffer" }
  );
  res.send(response.data);
}
