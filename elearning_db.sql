-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 20, 2026 at 10:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elearning_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `course_id`, `title`, `description`, `due_date`, `created_at`, `teacher_id`) VALUES
(1, 1, 'Web Hooks 1', 'Explainthe tags', '2025-12-31 00:00:00', '2025-12-27 13:37:53', 102),
(4, 6, 'sfasfas', 'fasfasfasf', '2026-02-21 00:00:00', '2026-02-09 19:11:39', 102);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Draft','Active','Archived') DEFAULT 'Active',
  `thumbnail` varchar(255) DEFAULT NULL,
  `course_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `teacher_id`, `created_at`, `status`, `thumbnail`, `course_image`) VALUES
(1, 'Web Development', 'Web development is\r\nthe process of creating, building, and maintaining websites and web applications that run on the internet. It involves a mix of technical skills, programming languages, and creative problem-solving to ensure a site is functional, visually appealing, and provides a smooth user experience across various devices. \r\nKey Areas of Web Development\r\nWeb development is generally categorized into three main specializations: \r\n\r\n    Front-End Development: Focuses on the \"client-side,\" or what the user sees and interacts with in their web browser. Front-end developers use core technologies to translate design mockups into functional user interfaces.\r\n    Back-End Development: Deals with the \"server-side\" logic, databases, and application functionality that users do not see. Back-end developers manage data storage, user authentication, and ensure the performance and security of the application.\r\n    Full-Stack Development: Encompasses both front-end and back-end development. Full-stack developers have the skills to handle all aspects of a web application\'s creation from start to finish. \r\n\r\nCore Technologies and Languages\r\nThe foundation of web development rests on three core technologies, with additional languages and tools used depending on the specialization: \r\nArea \r\n	Core/Common Languages and Technologies\r\nFront-End	HTML, CSS, JavaScript, React, Angular, Vue.js, Bootstrap\r\nBack-End	Python, PHP, Ruby, Java, Node.js, C#, SQL, MongoDB\r\nTools	Git/GitHub (version control), Visual Studio Code (IDE), Figma (design), CodePen (online editor)\r\nThe Web Development Process\r\nThe typical lifecycle for developing a website or application involves several key stages: \r\n\r\n    Planning and Strategy: Defining project goals, target audience, and creating a sitemap and wireframes (a basic blueprint of the site).\r\n    Design: Focusing on the visual aesthetics, user interface (UI), and user experience (UX) design.\r\n    Content Creation: Developing engaging and relevant text, images, and other media for the site.\r\n    Development (Coding): Translating the design and functionality requirements into actual code using the appropriate programming languages and frameworks.\r\n    Testing and Launch: Performing quality assurance (QA) testing for functionality, compatibility, and performance across different browsers and devices before deploying the site to a live server.\r\n    Maintenance and Updating: Ongoing monitoring of the website\'s performance, applying security patches, updating content, and making adjustments based on user feedback. \r\n\r\nCareer Outlook\r\nWeb development is a strong career choice with growing demand and competitive salaries. The U.S. Bureau of Labor Statistics projects employment for web developers to grow much faster than the average for all occupations. Individuals can enter the field through various paths, including self-taught learning with online resources like W3Schools or MDN Web Docs, coding bootcamps, or formal degrees in computer science. \r\n', 102, '2025-12-27 13:37:24', 'Active', '1766842644056_how-spaces-works3.png', '1766842644060_how-spaces-works3.png'),
(6, 'sdsadsa', 'asfsafsafsa', 102, '2026-02-09 19:11:02', 'Active', '1770664262441_WhatsApp_Image_2026-02-01_at_7.32.46_PM.jpeg', '1770664262445_Screenshot_2026-01-30_at_22-09-02_Chapter_0.1_The_Black_Swordsman_-_Berserk.png');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(255) DEFAULT NULL,
  `course_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `enrolled_at`, `thumbnail`, `course_image`) VALUES
(1, 103, 1, '2025-12-27 13:38:59', '1766842644056_how-spaces-works3.png', '1766842644060_how-spaces-works3.png'),
(5, 103, 6, '2026-02-09 19:12:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `time_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacher_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `course_id`, `title`, `time_limit`, `created_at`, `teacher_id`, `is_active`) VALUES
(1, 1, 'Web devlopment chapter 1 ', 10, '2025-12-27 13:38:34', 102, 1),
(3, 6, 'safasfasf', 4, '2026-02-09 19:12:02', 102, 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `attempt_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `correct_count` int(11) DEFAULT 0,
  `total_questions` int(11) DEFAULT 0,
  `score_percent` decimal(5,2) DEFAULT 0.00,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `is_submitted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`id`, `quiz_id`, `student_id`, `score`, `attempt_time`, `start_time`, `answers`, `correct_count`, `total_questions`, `score_percent`, `submitted_at`, `is_submitted`) VALUES
(1, 1, 103, 0.00, '2026-01-09 07:56:32', '2025-12-28 12:25:27', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(2, 1, 103, 0.00, '2025-12-28 12:25:27', '2025-12-28 12:25:27', '{}', 0, 0, 0.00, NULL, 0),
(3, 1, 103, 0.00, '2026-01-09 19:23:04', '2026-01-09 19:23:04', '{}', 0, 0, 0.00, NULL, 0),
(4, 1, 103, 0.00, '2026-01-09 19:23:04', '2026-01-09 19:23:04', '{}', 0, 0, 0.00, NULL, 0),
(5, 1, 103, 0.00, '2026-01-09 19:25:06', '2026-01-09 19:25:06', '{}', 0, 0, 0.00, NULL, 0),
(6, 1, 103, 0.00, '2026-01-09 19:25:31', '2026-01-09 19:25:28', '{\"1\":\"paragraph\"}', 0, 0, 0.00, NULL, 0),
(7, 1, 103, 0.00, '2026-01-09 19:25:28', '2026-01-09 19:25:28', '{}', 0, 0, 0.00, NULL, 0),
(8, 1, 103, 0.00, '2026-01-09 19:25:44', '2026-01-09 19:25:44', '{}', 0, 0, 0.00, NULL, 0),
(9, 1, 103, 0.00, '2026-01-09 19:25:46', '2026-01-09 19:25:44', '{\"1\":\"programming\"}', 0, 0, 0.00, NULL, 0),
(10, 1, 103, 0.00, '2026-01-09 19:25:54', '2026-01-09 19:25:54', '{}', 0, 0, 0.00, NULL, 0),
(11, 1, 103, 0.00, '2026-01-09 19:25:56', '2026-01-09 19:25:54', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(12, 1, 103, 0.00, '2026-01-09 19:26:03', '2026-01-09 19:26:03', '{}', 0, 0, 0.00, NULL, 0),
(13, 1, 103, 0.00, '2026-01-09 19:26:05', '2026-01-09 19:26:03', '{\"1\":\"parent class\"}', 0, 0, 0.00, NULL, 0),
(14, 1, 103, 0.00, '2026-01-09 19:26:13', '2026-01-09 19:26:13', '{}', 0, 0, 0.00, NULL, 0),
(15, 1, 103, 0.00, '2026-01-09 19:26:15', '2026-01-09 19:26:13', '{\"1\":\"paragraph\"}', 0, 0, 0.00, NULL, 0),
(16, 1, 103, 0.00, '2026-01-09 19:30:04', '2026-01-09 19:30:00', '{\"1\":\"programming\"}', 0, 0, 0.00, NULL, 0),
(17, 1, 103, 0.00, '2026-01-09 19:30:00', '2026-01-09 19:30:00', '{}', 0, 0, 0.00, NULL, 0),
(18, 1, 103, 0.00, '2026-01-09 19:30:12', '2026-01-09 19:30:12', '{}', 0, 0, 0.00, NULL, 0),
(19, 1, 103, 100.00, '2026-01-09 19:30:15', '2026-01-09 19:30:12', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(20, 1, 103, 0.00, '2026-01-09 19:33:05', '2026-01-09 19:33:05', '{}', 0, 0, 0.00, NULL, 0),
(21, 1, 103, 100.00, '2026-01-09 19:33:07', '2026-01-09 19:33:05', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(22, 1, 103, 0.00, '2026-01-09 19:39:53', '2026-01-09 19:39:53', '{}', 0, 0, 0.00, NULL, 0),
(23, 1, 103, 100.00, '2026-01-09 19:39:56', '2026-01-09 19:39:53', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(24, 1, 103, 0.00, '2026-01-09 19:40:05', '2026-01-09 19:40:05', '{}', 0, 0, 0.00, NULL, 0),
(25, 1, 103, 0.00, '2026-01-09 19:40:07', '2026-01-09 19:40:05', '{\"1\":\"programming\"}', 0, 0, 0.00, NULL, 0),
(26, 1, 103, 0.00, '2026-01-29 15:08:07', '2026-01-29 15:08:07', '{}', 0, 0, 0.00, NULL, 0),
(27, 1, 103, 0.00, '2026-01-29 15:08:10', '2026-01-29 15:08:07', '{\"1\":\"programming\"}', 0, 0, 0.00, NULL, 0),
(28, 1, 103, 0.00, '2026-01-29 15:08:16', '2026-01-29 15:08:16', '{}', 0, 0, 0.00, NULL, 0),
(29, 1, 103, 100.00, '2026-01-29 15:08:19', '2026-01-29 15:08:16', '{\"1\":\"portion \"}', 0, 0, 0.00, NULL, 0),
(44, 1, 103, 0.00, '2026-02-09 13:28:56', '2026-02-09 13:28:56', '{}', 0, 0, 0.00, NULL, 0),
(45, 1, 103, 0.00, '2026-02-09 13:28:58', '2026-02-09 13:28:56', '{\"1\":\"programming\"}', 0, 0, 0.00, NULL, 0),
(46, 1, 103, NULL, '2026-02-09 14:27:18', '2026-02-09 14:27:18', '{}', 0, 1, 0.00, NULL, 0),
(47, 1, 103, NULL, '2026-02-09 14:27:21', '2026-02-09 14:27:18', '{\"1\":\"programming\"}', 0, 1, 0.00, '2026-02-09 14:27:21', 1),
(48, 3, 103, NULL, '2026-02-09 20:01:03', '2026-02-09 20:00:57', NULL, 2, 2, 100.00, '2026-02-09 20:01:03', 1),
(49, 3, 103, NULL, '2026-02-09 20:00:57', '2026-02-09 20:00:57', NULL, 0, 2, 0.00, NULL, 0),
(50, 1, 103, NULL, '2026-02-20 04:00:16', '2026-02-20 04:00:16', NULL, 0, 1, 0.00, NULL, 0),
(51, 1, 103, NULL, '2026-02-20 04:00:20', '2026-02-20 04:00:16', NULL, 0, 1, 0.00, '2026-02-20 04:00:20', 1),
(52, 1, 103, NULL, '2026-02-20 04:00:27', '2026-02-20 04:00:27', NULL, 0, 1, 0.00, NULL, 0),
(53, 1, 103, NULL, '2026-02-20 04:00:30', '2026-02-20 04:00:27', NULL, 1, 1, 100.00, '2026-02-20 04:00:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempt_answers`
--

CREATE TABLE `quiz_attempt_answers` (
  `id` int(11) NOT NULL,
  `attempt_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `selected_index` int(11) NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_attempt_answers`
--

INSERT INTO `quiz_attempt_answers` (`id`, `attempt_id`, `question_id`, `selected_index`, `is_correct`) VALUES
(1, 48, 4, 3, 1),
(2, 48, 5, 2, 1),
(3, 51, 1, 1, 0),
(4, 53, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `question_text` text DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `options`, `correct_answer`) VALUES
(1, 1, 'What is p', '[\"portion \",\"programming\",\"paragraph\",\"parent class\"]', 0),
(4, 3, 'asfasfasf', '[\"safasfas\",\"fasf\",\"sfsf\",\"fffffffffffffffff\"]', 3),
(5, 3, 'dasfdsfsdg', '[\"dgsdg\",\"sdgsd\",\"gggggggggggggggg\",\"dgdg\"]', 2);

-- --------------------------------------------------------

--
-- Table structure for table `study_materials`
--

CREATE TABLE `study_materials` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','graded') DEFAULT 'pending',
  `grade` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `assignment_id`, `student_id`, `file_url`, `status`, `grade`, `feedback`, `submitted_at`, `teacher_id`) VALUES
(1, 1, 103, '1767701183333_425891353.pptx', 'graded', 51.00, 'improve the reference', '2026-01-06 12:06:23', 102),
(2, 4, 103, '1770664383257_590323367.pdf', 'pending', NULL, NULL, '2026-02-09 19:13:03', 102);

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(101, 'Admin User', 'admin@example.com', '$2a$10$SIAWAlv3crPBGTCXz2gb/Oa1BBzfTqNSXw.aetkU2qlbtINvNmSRq', 'admin', '2025-12-27 12:24:54'),
(102, 'Prof. Johnson', 'teacher@example.com', '$2b$10$uRDN821qcHQfJOkLISSeOeACVtx84Bi1H9sv5gMioCGQQFHHw4Gdq', 'teacher', '2025-12-27 12:24:54'),
(103, 'Anupam', 'student@elearn.com', '$2a$10$/eb6EVARJFH32OCLS6sHze7EMPJMwZVw5kjXAwUvYvSNBqlkQ5yum', 'student', '2025-12-27 12:24:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignments_ibfk_1` (`course_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  ADD KEY `enrollments_ibfk_2` (`course_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizzes_ibfk_1` (`course_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `quiz_attempts_ibfk_1` (`quiz_id`);

--
-- Indexes for table `quiz_attempt_answers`
--
ALTER TABLE `quiz_attempt_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_attempt_question` (`attempt_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_questions_ibfk_1` (`quiz_id`);

--
-- Indexes for table `study_materials`
--
ALTER TABLE `study_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `quiz_attempt_answers`
--
ALTER TABLE `quiz_attempt_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `study_materials`
--
ALTER TABLE `study_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_attempt_answers`
--
ALTER TABLE `quiz_attempt_answers`
  ADD CONSTRAINT `quiz_attempt_answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempt_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_materials`
--
ALTER TABLE `study_materials`
  ADD CONSTRAINT `study_materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
