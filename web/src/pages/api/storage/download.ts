import { NextApiRequest, NextApiResponse } from "next";

export default async function rename(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STORAGE}/${req.query.key}`
  );
  const blob = await response.blob();
  res.send(Buffer.from(await blob.arrayBuffer()));
}
