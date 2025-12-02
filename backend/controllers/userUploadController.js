const ExcelJS = require("exceljs");

// Example User model
const User = require("../models/User");

exports.bulkUploadUsers = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];

    const rows = [];
    const errors = [];

    sheet.eachRow((row, idx) => {
      if (idx === 1) return; // skip header
      const name = row.getCell(1)?.text?.trim();
      const email = row.getCell(2)?.text?.trim();
      const password = row.getCell(3)?.text?.trim();
      const role = row.getCell(4)?.text?.trim();

      if (!name || !email || !password || !role) {
        errors.push({ row: idx, message: "Missing required fields" });
      } else {
        rows.push({ name, email, password, role });
      }
    });

    // Save valid rows to DB
    for (const r of rows) {
      const exists = await User.findOne({ email: r.email });
      if (!exists) {
        await User.create(r);
      } else {
        errors.push({ row: "N/A", message: `Email already exists: ${r.email}` });
      }
    }

    return res.json({ validCount: rows.length, errors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
