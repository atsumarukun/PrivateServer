import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function shutdown(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/power/shutdown`
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
