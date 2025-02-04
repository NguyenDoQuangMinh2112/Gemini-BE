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

router.get("/employee/:id", (req, res) => {
  const employeeId = req.params.id;
  const query = `
    SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone_number,
           e.date_of_birth, e.hire_date, e.salary, e.job_title, e.status,
           d.department_name,
           a.address_line1, a.city, a.state, a.postal_code, a.country
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.department_id
    LEFT JOIN employee_addresses a ON e.employee_id = a.employee_id
    WHERE e.employee_id = ?;
  `;

  const projectQuery = `
    SELECT project_name, start_date, end_date, status
    FROM employee_projects
    WHERE employee_id = ?;
  `;
  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    const employee = result[0];

    connection.query(projectQuery, [employeeId], (err, projects) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi truy vấn dự án" });
      }

      res.json({
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone_number: employee.phone_number,
        date_of_birth: employee.date_of_birth,
        hire_date: employee.hire_date,
        salary: employee.salary,
        job_title: employee.job_title,
        status: employee.status,
        department_name: employee.department_name,
        address: {
          address_line1: employee.address_line1,
          city: employee.city,
          state: employee.state,
          postal_code: employee.postal_code,
          country: employee.country,
        },
        projects: projects,
      });
    });
  });
});

// API lấy danh sách các dự án của một nhân viên
router.get("/employees/:employee_id/projects", (req, res) => {
  const { employee_id } = req.params;

  const query = "SELECT * FROM employee_projects WHERE employee_id = ?";
  connection.query(query, [employee_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// tổng lương của nhân viên
router.get("/employees/total-salary", (req, res) => {
  const query = "SELECT SUM(salary) AS total_salary FROM employees";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total_salary: results[0].total_salary });
  });
});

// Tính tổng lương của nhân viên trong một phòng ban
router.get("/departments/:department_id/total-salary", (req, res) => {
  const { department_id } = req.params;

  const query =
    "SELECT SUM(e.salary) AS total_salary FROM employees e WHERE e.department_id = ?";

  connection.query(query, [department_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total_salary: results[0].total_salary });
  });
});

// Lấy danh sách nhân viên theo phòng ban & trạng thái
router.get("/:department/:status", (req, res) => {
  const { department, status } = req.params;

  const query = `
  SELECT e.first_name, e.last_name, e.email, e.salary, d.department_name, e.status
  FROM employees e
  JOIN departments d ON e.department_id = d.department_id
  WHERE d.department_name = ? AND e.status = ?
`;

  connection.query(query, [department, status], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Lỗi truy vấn database", details: err });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhân viên phù hợp" });
    }
    res.json({ employees: results });
  });
});

export default router;
