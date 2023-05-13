import { NextApiRequest, NextApiResponse } from "next";

export default async function move(req: NextApiRequest, res: NextApiResponse) {
  var query = "";
  if (typeof req.query["keys[]"] === "string") {
    query = `keys[]=${req.query["keys[]"]}`;
  } else if (Array.isArray(req.query["keys[]"])) {
    query = `keys[]=${req.query["keys[]"].join("&keys[]=")}`;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/move?${query}`,
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
