import { QueryResult } from 'pg';
import {conn, cors, runMiddleware} from '../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next/types';

interface SeatObj{
  id: number,
  name: string,
  x: number,
  y: number
}

interface SeatRslt{
  rows: SeatObj,
}

interface TableObj{
  "id": number,
  "name": string,
  "x": number,
  "y": number,
  "width":  number,
  "height":  number,
}

interface TableRslt{
  rows: TableObj,
}

/**
 *  GET to retrieve a resource;
 *  PUT to change the state of or update a resource, which can be an object, file or block;
 *  POST to create that resource; and
 *  DELETE to remove it.
 * @param {*} req 
 * @param {*} res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log(req.method);
  await runMiddleware(req, res, cors);
  if (req.method === 'OPTIONS') {
    res.status(200)
  }
  if (req.method === 'GET') {
    const seatRslt: QueryResult<SeatRslt> = await conn.query('SELECT * FROM  book_a_seat.seat_objs');
    const tableRslt: QueryResult<TableRslt> = await conn.query('SELECT * FROM  book_a_seat.table_objs');

    res.status(200).json({
      seats: seatRslt.rows,
      tables: tableRslt.rows
    });
  } else {
    // console.log('not get........');
    let successfull = false;
    try{
      const reqObjs = req.body;
      // console.log('1');
      if(reqObjs){
        await conn.query(`DELETE FROM book_a_seat.seat_objs`);
        // console.log('2');
        reqObjs.seats.forEach(async (seat: SeatObj)=>{
          // console.log(`INSERT INTO book_a_seat.seat_objs (id, name, x, y)  
          // VALUES (${seat.id}, '${seat.name}', ${seat.x}, ${seat.y})`);
          // console.log('3');
          await conn.query(
            `INSERT INTO book_a_seat.seat_objs (id, name, x, y)  
            VALUES (${seat.id}, '${seat.name}', ${seat.x}, ${seat.y})`);
        });

        // console.log('4');
        await conn.query(`DELETE FROM book_a_seat.table_objs`);
        reqObjs.tables.forEach(async (table: TableObj)=>{
          // console.log(`INSERT INTO book_a_seat.seat_objs (id, name, x, y)  
          // VALUES (${seat.id}, '${seat.name}', ${seat.x}, ${seat.y})`);
          // console.log('5');
          await conn.query(
            `INSERT INTO book_a_seat.table_objs (id, name, x, y, width, height)  
            VALUES (${table.id}, '${table.name}', ${table.x}, ${table.y}, ${table.width}, ${table.height})`);
        });
        successfull = true;
      }
    } catch (error) {
      console.error(error);
    }
    res.status(200).json({
      successfull: successfull
    });
  }
}
