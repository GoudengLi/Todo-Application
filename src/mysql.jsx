
import { createPool } from 'mysql';


const pool = createPool({
  connectionLimit: 10,
  host: 'localhost', 
  user: 'root', 
  password: '123456', 
  database: 'world' 
});


function addCoordinate(latitude, longitude,state) {

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }


    const sql = 'INSERT INTO coordinates (latitude, longitude, state) VALUES (?, ?, ?)';
    const values = [latitude, longitude, state];

   
    connection.query(sql, values, (error, results, fields) => {
     
      connection.release();

      if (error) {
        console.error('Error adding coordinate:', error);
      } else {
        console.log('Coordinate added successfully.');
      }
    });
  });
}


export { addCoordinate };