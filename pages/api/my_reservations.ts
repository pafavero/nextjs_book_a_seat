import { QueryResult } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next/types';
import {conn, cors, runMiddleware} from '../../lib/db';

interface Rslt {
  id: number,
  seatid: number,
  username: string,
  startdate: string,
  enddate: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log(req);
  await runMiddleware(req, res, cors);
  if (req.method === 'OPTIONS') {
    res.status(200)
  } else if (req.method === 'GET') {
    const id = req.query.id;
    let rslt: QueryResult<Rslt> = null;
    // console.log('method get', id)
    if(id){
      rslt = await conn.query(`select r.id, r.seat_id as seatId, r.username, to_char(r.start_date, 'YYYY-MM-DD HH24:MI:SS') as startDate, to_char(r.end_date, 'YYYY-MM-DD HH24:MI:SS') as endDate
      from book_a_seat.reservation r
      where r.username = '${id}'
      order by r.start_date`);
    }
    res.status(200).json({
      rslt: rslt?.rows
    });
  }
}

