// server/config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'elearning_db',
} = process.env;

let pool;

async function init() {
  try {
    // Connect to MySQL server (without DB)
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true,
    });

    // Create DB if not exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
    );
    await connection.end();

    // Create pool with DB
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

    -- users
    CREATE TABLE IF NOT EXISTS users (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','teacher','student') DEFAULT 'student',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO users (id,name,email,password,role,created_at) VALUES
    (1,'Admin User','admin@example.com','$2a$10$SIAWAlv3crPBGTCXz2gb/Oa1BBzfTqNSXw.aetkU2qlbtINvNmSRq','admin',NOW()),
    (2,'Prof. Johnson','teacher@example.com','$2a$10$zdFqi.42jRAJoN72JQsrCucuZMNr.bTrMlprllvFMu2mvX2L.dDMq','teacher',NOW()),
    (8,'Anupam','student@elearn.com','$2a$10$/eb6EVARJFH32OCLS6sHze7EMPJMwZVw5kjXAwUvYvSNBqlkQ5yum','student',NOW())
    ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role);

    -- courses
    CREATE TABLE IF NOT EXISTS courses (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT DEFAULT NULL,
      teacher_id INT(11) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status ENUM('Draft','Active','Archived') DEFAULT 'Active',
      thumbnail VARCHAR(255) DEFAULT NULL,
      course_image VARCHAR(255) DEFAULT NULL,
      diagram_url VARCHAR(255) DEFAULT NULL,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    INSERT INTO courses (id,title,description,teacher_id,created_at,status,thumbnail,course_image) VALUES
    (6,'Python ++','This is the advanced python ++ course for beginner with advanced concept.',2,NOW(),'Active','1763995376357_aaaaaaaa.jpg','1763995376393_aaaaaaaa.jpg'),
    (8,'Scripting Language','BCA 4th sem course.',2,NOW(),'Active',NULL,NULL)
    ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description);

    -- assignments
    CREATE TABLE IF NOT EXISTS assignments (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      course_id INT(11) DEFAULT NULL,
      title VARCHAR(100) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      due_date DATETIME DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      teacher_id INT(11) DEFAULT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    INSERT INTO assignments (id,course_id,title,description,due_date,created_at,teacher_id) VALUES
    (1,6,'Describe Python','Write about Python in your own words.',NOW(),NOW(),2),
    (3,8,'Check','Do you own?',NOW(),NOW(),2)
    ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description);

    -- enrollments
    CREATE TABLE IF NOT EXISTS enrollments (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id INT(11) DEFAULT NULL,
      course_id INT(11) DEFAULT NULL,
      enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_enrollment (student_id,course_id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    INSERT INTO enrollments (id,student_id,course_id,enrolled_at) VALUES
    (2,8,6,NOW()),
    (4,8,8,NOW())
    ON DUPLICATE KEY UPDATE student_id=VALUES(student_id), course_id=VALUES(course_id);

    -- quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      course_id INT(11) DEFAULT NULL,
      title VARCHAR(100) DEFAULT NULL,
      time_limit INT(11) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      teacher_id INT(11) DEFAULT NULL,
      is_active TINYINT(1) DEFAULT 1,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    INSERT INTO quizzes (id,course_id,title,time_limit,created_at,teacher_id,is_active) VALUES
    (1,6,'Python chapter 1',10,NOW(),2,1)
    ON DUPLICATE KEY UPDATE title=VALUES(title);

    -- quiz_questions
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      quiz_id INT(11) DEFAULT NULL,
      question_text TEXT DEFAULT NULL,
      options LONGTEXT DEFAULT NULL CHECK (JSON_VALID(options)),
      correct_answer VARCHAR(10) DEFAULT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    );

    INSERT INTO quiz_questions (id,quiz_id,question_text,options,correct_answer) VALUES
    (3,1,'who is python','["animal","mamal","progmming language","language"]','0'),
    (4,1,'who invent python compiler','["david","newton","arch","henry"]','3'),
    (5,1,'what is te extension of pyrhon','["pyhton","py","pyt","pyn"]','1')
    ON DUPLICATE KEY UPDATE question_text=VALUES(question_text);

    -- quiz_attempts
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      quiz_id INT(11) DEFAULT NULL,
      student_id INT(11) DEFAULT NULL,
      score DECIMAL(5,2) DEFAULT NULL,
      attempt_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      answers LONGTEXT DEFAULT NULL CHECK (JSON_VALID(answers)),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id)
    );

    -- study_materials
    CREATE TABLE IF NOT EXISTS study_materials (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      course_id INT(11) DEFAULT NULL,
      title VARCHAR(100) DEFAULT NULL,
      content TEXT DEFAULT NULL,
      file_url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    -- submissions
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
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    -- system_logs
    CREATE TABLE IF NOT EXISTS system_logs (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT(11) DEFAULT NULL,
      action VARCHAR(100) DEFAULT NULL,
      details TEXT DEFAULT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    COMMIT;
    `;

    await pool.query(schemaAndSeed);
    console.log('Database initialized: tables created and seed data inserted.');
  } catch (err) {
    console.error('DB Init Error:', err);
    process.exit(1);
  }
}

init();

module.exports = {
  query: (...args) => pool.query(...args),
  getPool: () => pool,
};
