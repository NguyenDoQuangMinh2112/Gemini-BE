import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',        
  user: 'root',             
  password: '1212123Minh@',     
  database: 'EmployeeManagement',    
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.stack);
    return;
  }
  console.log('Đã kết nối tới MySQL với ID:', connection.threadId);
});

export default connection;