import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function copy(req: NextApiRequest, res: NextApiResponse) {
  let query = "";
  if (typeof req.query["keys[]"] === "string") {
    query = `keys[]=${req.query["keys[]"]}`;
  } else if (Array.isArray(req.query["keys[]"])) {
    query = `keys[]=${req.query["keys[]"].join("&keys[]=")}`;
  }
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/copy?${query}`,
    req.body,
    { headers: { "Content-Type": req.headers["content-type"] } }
  );
  if (response.status === 200) {
    res.status(response.status).json(response.data);
  } else {
    res.status(response.status).json(response.data);
  }
}
