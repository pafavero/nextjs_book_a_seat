import { Pool, Client } from 'pg'
import { NextApiRequest, NextApiResponse } from 'next/types'

const poolSetting: Pool =new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: Number(process.env.PGSQL_PORT),
    database: process.env.PGSQL_DATABASE,
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const queryDb = async () => {
        try {
            await poolSetting.connect();
            const rslt = await poolSetting.query('SELECT * FROM  book_a_seat.seat_objs');
            poolSetting.end()
            // res.send(rslt.rows);
            res.status(200).json({ rows: rslt.rows})
        } catch (error) {
            console.log(error)
            res.status(200).json({ rows: null})
        }    
    }
    queryDb();

    // res.status(200).json({ rows: "test"})
}
