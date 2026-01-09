const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'elearning_db',
  NODE_ENV = 'development',
} = process.env;

let pool;

async function init() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true,
    });

    if (NODE_ENV === 'development') {
      console.log('⚠️ Development mode: using existing database...');
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`; USE \`${DB_NAME}\`;`);
    } else {
      console.log('✅ Production mode: keeping existing database.');
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`; USE \`${DB_NAME}\`;`);
    }

    await connection.end();

    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });

    const schemaAndSeed = `
      START TRANSACTION;

      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','teacher','student') DEFAULT 'student',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO users (id,name,email,password,role,created_at) VALUES
        (101, 'Admin User', 'admin@example.com', '$2a$10$SIAWAlv3crPBGTCXz2gb/Oa1BBzfTqNSXw.aetkU2qlbtINvNmSRq', 'admin', NOW()),
        (102, 'Prof. Johnson', 'teacher@example.com', '$2a$10$zdFqi.42jRAJoN72JQsrCucuZMNr.bTrMlprllvFMu2mvX2L.dDMq', 'teacher', NOW()),
        (103, 'Anupam', 'student@elearn.com', '$2a$10$/eb6EVARJFH32OCLS6sHze7EMPJMwZVw5kjXAwUvYvSNBqlkQ5yum', 'student', NOW())
      ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role);

      ALTER TABLE users AUTO_INCREMENT = 104;

      -- Courses
      CREATE TABLE IF NOT EXISTS courses (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT DEFAULT NULL,
        teacher_id INT(11) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status ENUM('Draft','Active','Archived') DEFAULT 'Active',
        thumbnail VARCHAR(255) DEFAULT NULL,
        course_image VARCHAR(255) DEFAULT NULL,
        KEY teacher_id (teacher_id),
        CONSTRAINT courses_ibfk_1 FOREIGN KEY (teacher_id) REFERENCES users (id)
      );

      -- Assignments
      CREATE TABLE IF NOT EXISTS assignments (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        course_id INT(11) DEFAULT NULL,
        title VARCHAR(100) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        due_date DATETIME DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        teacher_id INT(11) DEFAULT NULL,
        KEY assignments_ibfk_1 (course_id),
        CONSTRAINT assignments_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      -- Enrollments
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        student_id INT(11) DEFAULT NULL,
        course_id INT(11) DEFAULT NULL,
        enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        thumbnail VARCHAR(255) DEFAULT NULL,
        course_image VARCHAR(255) DEFAULT NULL,
        UNIQUE KEY unique_enrollment (student_id,course_id),
        KEY enrollments_ibfk_2 (course_id),
        CONSTRAINT enrollments_ibfk_1 FOREIGN KEY (student_id) REFERENCES users(id),
        CONSTRAINT enrollments_ibfk_2 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      -- Quizzes
      CREATE TABLE IF NOT EXISTS quizzes (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        course_id INT(11) DEFAULT NULL,
        title VARCHAR(100) DEFAULT NULL,
        time_limit INT(11) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        teacher_id INT(11) DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        KEY quizzes_ibfk_1 (course_id),
        CONSTRAINT quizzes_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      -- Quiz Questions
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT(11) DEFAULT NULL,
        question_text TEXT DEFAULT NULL,
        options LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(options)),
        correct_answer VARCHAR(50) DEFAULT NULL,
        KEY quiz_questions_ibfk_1 (quiz_id),
        CONSTRAINT quiz_questions_ibfk_1 FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      );

      -- Quiz Attempts
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT(11) DEFAULT NULL,
        student_id INT(11) DEFAULT NULL,
        score DECIMAL(5,2) DEFAULT 0,
        correct_count INT DEFAULT 0,
        attempt_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        answers LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(answers)),
        KEY student_id (student_id),
        KEY quiz_attempts_ibfk_1 (quiz_id),
        CONSTRAINT quiz_attempts_ibfk_1 FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        CONSTRAINT quiz_attempts_ibfk_2 FOREIGN KEY (student_id) REFERENCES users(id)
      );

      -- Study Materials
      CREATE TABLE IF NOT EXISTS study_materials (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        course_id INT(11) DEFAULT NULL,
        title VARCHAR(100) DEFAULT NULL,
        content TEXT DEFAULT NULL,
        file_url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY course_id (course_id),
        CONSTRAINT study_materials_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      -- Submissions
      CREATE TABLE IF NOT EXISTS submissions (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        assignment_id INT(11) DEFAULT NULL,
        student_id INT(11) DEFAULT NULL,
        file_url VARCHAR(255) DEFAULT NULL,
        status ENUM('pending','graded') DEFAULT 'pending',
        grade DECIMAL(5,2) DEFAULT NULL,
        feedback TEXT DEFAULT NULL,
        submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        teacher_id INT(11) DEFAULT NULL,
        KEY assignment_id (assignment_id),
        KEY student_id (student_id),
        CONSTRAINT submissions_ibfk_1 FOREIGN KEY (assignment_id) REFERENCES assignments(id),
        CONSTRAINT submissions_ibfk_2 FOREIGN KEY (student_id) REFERENCES users(id)
      );

      -- System Logs
      CREATE TABLE IF NOT EXISTS system_logs (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) DEFAULT NULL,
        action VARCHAR(100) DEFAULT NULL,
        details TEXT DEFAULT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY user_id (user_id),
        CONSTRAINT system_logs_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id)
      );

      COMMIT;
    `;

    await pool.query(schemaAndSeed);
    console.log('Database initialized: full schema applied and seeded.');
  } catch (err) {
    console.error('DB Init Error:', err);
    process.exit(1);
  }
}

init();

module.exports = {
  query: (...args) => pool.query(...args),
  execute: (...args) => pool.execute(...args),
  getPool: () => pool,
};
