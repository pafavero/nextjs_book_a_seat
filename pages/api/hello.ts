// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next/types';
import {cors, runMiddleware} from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
  res.json({ name: 'John Doe' })
}
