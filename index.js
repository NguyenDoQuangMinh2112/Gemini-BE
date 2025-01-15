import express from 'express'; 
import dotenv from "dotenv"
import userRoutes from './src/routes/userRouter.js';
import connection from './src/configs/connectDB.js';
const app = express();
const port = 3000;

dotenv.config();
console.log('MySQL connection established: ', connection.threadId);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
