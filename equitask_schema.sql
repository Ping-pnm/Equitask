-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 01, 2026 at 06:11 AM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `equitask_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcementId` int(11) NOT NULL,
  `content` text,
  `creatorId` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `assignmentId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `instructions` text,
  `points` int(11) DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `isGroupWork` tinyint(1) DEFAULT NULL,
  `creatorId` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `attemptlog`
--

CREATE TABLE `attemptlog` (
  `attemptId` int(11) NOT NULL,
  `progress` int(11) DEFAULT NULL,
  `message` text,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `taskId` int(11) DEFAULT NULL,
  `aiComment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `classId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `section` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `criteriaId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `maxPercentage` decimal(5,2) DEFAULT NULL,
  `rubricId` int(11) DEFAULT NULL,
  `selectedLevelId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `userId` int(11) NOT NULL,
  `classId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `fileId` int(11) NOT NULL,
  `fileUrl` varchar(255) NOT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `assignmentId` int(11) DEFAULT NULL,
  `announcementId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `taskId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groupcomments`
--

CREATE TABLE `groupcomments` (
  `groupCommentId` int(11) NOT NULL,
  `comment` text,
  `userId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `groupId` int(11) NOT NULL,
  `groupName` varchar(255) DEFAULT NULL,
  `meetLink` varchar(255) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `assignmentId` int(11) DEFAULT NULL,
  `isSubmitted` tinyint(1) DEFAULT NULL,
  `grades` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `levelId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `rubricId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE `links` (
  `linkId` int(11) NOT NULL,
  `linkUrl` text,
  `assignmentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `taskId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `meettracking`
--

CREATE TABLE `meettracking` (
  `meetTrackingId` int(11) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `userId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

CREATE TABLE `owners` (
  `userId` int(11) NOT NULL,
  `classId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rubriccells`
--

CREATE TABLE `rubriccells` (
  `criteriaId` int(11) NOT NULL,
  `levelId` int(11) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rubrics`
--

CREATE TABLE `rubrics` (
  `rubricId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `completionRate` decimal(5,2) DEFAULT '0.00',
  `aiComment` text,
  `assignmentId` int(11) DEFAULT NULL,
  `taskId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `taskId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `details` text,
  `assignmentId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isSubmitted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `userassignments`
--

CREATE TABLE `userassignments` (
  `userId` int(11) NOT NULL,
  `assignmentId` int(11) NOT NULL,
  `isSubmitted` int(11) DEFAULT NULL,
  `grades` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcementId`),
  ADD KEY `creatorId` (`creatorId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignmentId`),
  ADD UNIQUE KEY `title` (`title`),
  ADD KEY `creatorId` (`creatorId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `attemptlog`
--
ALTER TABLE `attemptlog`
  ADD PRIMARY KEY (`attemptId`),
  ADD KEY `taskId` (`taskId`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`classId`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`criteriaId`),
  ADD KEY `selectedLevelId` (`selectedLevelId`),
  ADD KEY `rubricId` (`rubricId`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`userId`,`classId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`fileId`),
  ADD KEY `assignmentId` (`assignmentId`),
  ADD KEY `announcementId` (`announcementId`),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `fk_task_files` (`taskId`);

--
-- Indexes for table `groupcomments`
--
ALTER TABLE `groupcomments`
  ADD PRIMARY KEY (`groupCommentId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `groupId` (`groupId`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`groupId`),
  ADD KEY `classId` (`classId`),
  ADD KEY `assignmentId` (`assignmentId`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`levelId`),
  ADD KEY `rubricsId` (`rubricId`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`linkId`),
  ADD KEY `assignmentId` (`assignmentId`,`userId`,`groupId`,`taskId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `taskId` (`taskId`);

--
-- Indexes for table `meettracking`
--
ALTER TABLE `meettracking`
  ADD PRIMARY KEY (`meetTrackingId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `groupId` (`groupId`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`userId`,`groupId`),
  ADD KEY `groupId` (`groupId`);

--
-- Indexes for table `owners`
--
ALTER TABLE `owners`
  ADD PRIMARY KEY (`userId`,`classId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `rubriccells`
--
ALTER TABLE `rubriccells`
  ADD PRIMARY KEY (`criteriaId`,`levelId`),
  ADD KEY `levelId` (`levelId`);

--
-- Indexes for table `rubrics`
--
ALTER TABLE `rubrics`
  ADD PRIMARY KEY (`rubricId`),
  ADD KEY `assignmentId` (`assignmentId`),
  ADD KEY `taskId` (`taskId`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`taskId`),
  ADD KEY `assignmentId` (`assignmentId`),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `userassignments`
--
ALTER TABLE `userassignments`
  ADD PRIMARY KEY (`userId`,`assignmentId`),
  ADD KEY `assignmentId` (`assignmentId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcementId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attemptlog`
--
ALTER TABLE `attemptlog`
  MODIFY `attemptId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `criteriaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `fileId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groupcomments`
--
ALTER TABLE `groupcomments`
  MODIFY `groupCommentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `groupId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `levelId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `linkId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meettracking`
--
ALTER TABLE `meettracking`
  MODIFY `meetTrackingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rubrics`
--
ALTER TABLE `rubrics`
  MODIFY `rubricId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `taskId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`);

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`);

--
-- Constraints for table `attemptlog`
--
ALTER TABLE `attemptlog`
  ADD CONSTRAINT `attemptlog_ibfk_1` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`taskId`);

--
-- Constraints for table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `criteria_ibfk_1` FOREIGN KEY (`rubricId`) REFERENCES `rubrics` (`rubricId`),
  ADD CONSTRAINT `criteria_ibfk_2` FOREIGN KEY (`selectedLevelId`) REFERENCES `levels` (`levelId`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`);

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`),
  ADD CONSTRAINT `files_ibfk_2` FOREIGN KEY (`announcementId`) REFERENCES `announcements` (`announcementId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `files_ibfk_3` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`),
  ADD CONSTRAINT `files_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `fk_task_files` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`taskId`) ON DELETE CASCADE;

--
-- Constraints for table `groupcomments`
--
ALTER TABLE `groupcomments`
  ADD CONSTRAINT `groupcomments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `groupcomments_ibfk_2` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`),
  ADD CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`);

--
-- Constraints for table `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`rubricId`) REFERENCES `rubrics` (`rubricId`);

--
-- Constraints for table `links`
--
ALTER TABLE `links`
  ADD CONSTRAINT `links_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`),
  ADD CONSTRAINT `links_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `links_ibfk_3` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`),
  ADD CONSTRAINT `links_ibfk_4` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`taskId`);

--
-- Constraints for table `meettracking`
--
ALTER TABLE `meettracking`
  ADD CONSTRAINT `meettracking_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `meettracking_ibfk_2` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`);

--
-- Constraints for table `memberships`
--
ALTER TABLE `memberships`
  ADD CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`);

--
-- Constraints for table `owners`
--
ALTER TABLE `owners`
  ADD CONSTRAINT `owners_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `owners_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`);

--
-- Constraints for table `rubriccells`
--
ALTER TABLE `rubriccells`
  ADD CONSTRAINT `rubriccells_ibfk_1` FOREIGN KEY (`criteriaId`) REFERENCES `criteria` (`criteriaId`),
  ADD CONSTRAINT `rubriccells_ibfk_2` FOREIGN KEY (`levelId`) REFERENCES `levels` (`levelId`);

--
-- Constraints for table `rubrics`
--
ALTER TABLE `rubrics`
  ADD CONSTRAINT `rubrics_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`),
  ADD CONSTRAINT `rubrics_ibfk_2` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`taskId`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`),
  ADD CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `userassignments`
--
ALTER TABLE `userassignments`
  ADD CONSTRAINT `userassignments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `userassignments_ibfk_2` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`assignmentId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
