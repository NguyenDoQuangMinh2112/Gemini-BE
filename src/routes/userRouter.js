import express from "express";
import connection from "../configs/connectDB.js";

const router = express.Router();

router.get("/employees", async (req, res) => {
  try {
    connection.query("SELECT * FROM employees", (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results); 
    });
  } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy vấn dữ liệu" });
  }
});


// API lấy danh sách các dự án của một nhân viên
router.get('/employees/:employee_id/projects', (req, res) => {
  const { employee_id } = req.params;

  const query = 'SELECT * FROM employee_projects WHERE employee_id = ?';
  connection.query(query, [employee_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// tổng lương của nhân viên
router.get('/employees/total-salary', (req, res) => {
  const query = 'SELECT SUM(salary) AS total_salary FROM employees';
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total_salary: results[0].total_salary });
  });
});


// Tính tổng lương của nhân viên trong một phòng ban
router.get('/departments/:department_id/total-salary', (req, res) => {
  const { department_id } = req.params;

  const query = 'SELECT SUM(e.salary) AS total_salary FROM employees e WHERE e.department_id = ?';

  connection.query(query, [department_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total_salary: results[0].total_salary });
  });
});


export default router;


