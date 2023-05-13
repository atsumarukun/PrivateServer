import { NextApiRequest, NextApiResponse } from "next";

export default async function copy(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/copy?key=${req.query.key}`,
    {
      method: req.method,
      body: req.body,
    }
  );
  const data = await response.json();
  if (response.status === 200) {
    res.status(response.status).json(data.fileName);
  } else {
    res.status(response.status).json(data.error);
  }
}
