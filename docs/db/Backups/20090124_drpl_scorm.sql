-- phpMyAdmin SQL Dump
-- version 2.11.8.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 24, 2009 at 02:36 PM
-- Server version: 5.0.67
-- PHP Version: 5.2.6-2ubuntu4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `drpl_scorm`
--

-- --------------------------------------------------------

--
-- Table structure for table `cmi_comments_from_learner`
--

CREATE TABLE IF NOT EXISTS `cmi_comments_from_learner` (
  `csid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `comment` varchar(250) default NULL,
  `location` varchar(250) default NULL,
  `timestamp` int(11) default NULL,
  KEY `csid` (`csid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_interactions`
--

CREATE TABLE IF NOT EXISTS `cmi_interactions` (
  `ciid` int(11) NOT NULL,
  `clsid` int(11) NOT NULL,
  `id` text,
  `type` varchar(15) default NULL,
  `timestamp` int(11) default NULL,
  `weighting` double(10,7) default NULL,
  `learner_response` text,
  `result` text,
  `latency` double(10,2) default NULL,
  `description` varchar(250) default NULL,
  PRIMARY KEY  (`ciid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_interactions_correct_responses`
--

CREATE TABLE IF NOT EXISTS `cmi_interactions_correct_responses` (
  `cirid` int(11) NOT NULL,
  `ciid` int(11) NOT NULL,
  `pattern` text,
  PRIMARY KEY  (`cirid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_interactions_objectives`
--

CREATE TABLE IF NOT EXISTS `cmi_interactions_objectives` (
  `ciid` int(11) NOT NULL,
  `id` text,
  PRIMARY KEY  (`ciid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_learner`
--

CREATE TABLE IF NOT EXISTS `cmi_learner` (
  `uid` int(11) NOT NULL,
  `credit` varchar(10) default NULL,
  `audio_level` double(10,7) default NULL,
  `language` varchar(250) default NULL,
  `delivery_speed` double(10,7) default NULL,
  `audio_captioning` int(10) default NULL,
  `mode` varchar(10) default NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_learner_attempt`
--

CREATE TABLE IF NOT EXISTS `cmi_learner_attempt` (
  `claid` int(11) unsigned NOT NULL auto_increment,
  `csid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `completion_status` varchar(15) default NULL,
  `location` text,
  `progress_measure` double(10,7) default NULL,
  `success_status` varchar(10) default NULL,
  `suspend_data` text,
  `total_time` double(10,2) default NULL,
  PRIMARY KEY  (`claid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_learner_session`
--

CREATE TABLE IF NOT EXISTS `cmi_learner_session` (
  `clsid` int(11) NOT NULL,
  `claid` int(11) NOT NULL,
  `entry` varchar(10) default NULL,
  `exit_` varchar(10) default NULL,
  `session_time` double(10,2) default NULL,
  PRIMARY KEY  (`clsid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_objectives`
--

CREATE TABLE IF NOT EXISTS `cmi_objectives` (
  `coid` int(11) NOT NULL,
  `ciid` int(11) default NULL,
  `id` text,
  `success_status` varchar(10) default NULL,
  `completion_status` varchar(15) default NULL,
  `progress_measure` double(10,7) default NULL,
  `description` varchar(250) default NULL,
  PRIMARY KEY  (`coid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_objectives_score`
--

CREATE TABLE IF NOT EXISTS `cmi_objectives_score` (
  `coid` int(11) NOT NULL,
  `scaled` double(10,7) default NULL,
  `raw` double(10,7) default NULL,
  `min` double(10,7) default NULL,
  `max` double(10,7) default NULL,
  PRIMARY KEY  (`coid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_sco`
--

CREATE TABLE IF NOT EXISTS `cmi_sco` (
  `csid` int(11) NOT NULL,
  `nid` int(11) NOT NULL,
  `completion_threshold` double(10,7) default NULL,
  `launch_data` text,
  `max_time_allowed` double(10,2) default NULL,
  `scaled_passing_score` double(10,7) default NULL,
  `time_limit_action` varchar(20) default NULL,
  PRIMARY KEY  (`csid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmi_score`
--

CREATE TABLE IF NOT EXISTS `cmi_score` (
  `cscid` int(11) NOT NULL auto_increment,
  `claid` int(11) unsigned NOT NULL,
  `scaled` double(10,7) default NULL,
  `raw` double(10,7) default NULL,
  `max` double(10,7) default NULL,
  `min` double(10,7) default NULL,
  PRIMARY KEY  (`cscid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
