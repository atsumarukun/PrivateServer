import { NextApiRequest, NextApiResponse } from "next";

export default async function rename(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage?path=${req.query.path}`
  );
  const data = await response.json();
  if (response.status === 200) {
    res.status(response.status).json(data);
  } else {
    res.status(response.status).json(data.error);
  }
}
