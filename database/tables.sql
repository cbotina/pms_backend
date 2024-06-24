drop database if exists escuelanormalsuperior;
create database if not exists escuelanormalsuperior;
use escuelanormalsuperior;

create table if not exists period(
	id int auto_increment,
    startDate date,
    endDate date,
    name varchar(10),
    primary key(id)
);

create table if not exists timeSlot(
	id int auto_increment,
    label varchar(20),
    periodId int,
    startTime time,
    endTime time,
    isAcademic bool default false,
    
    primary key(id),
    foreign key(periodId) references period(id) on delete cascade
);
  
 create table if not exists `subject`(
	id int auto_increment,
    name varchar(150) unique,
    primary key(id)
 );
 
 create table if not exists teacher(
	id int auto_increment,
    cc varchar(20) unique,
    firstName varchar(150),
    lastName varchar(150),
    password text,
    primary key(id)
 );
 
 create table if not exists `group`(
	id int auto_increment,
    periodId int, 
    tutorId int,
    name varchar(10),
    semester varchar(150),
    modality set('Academico', 'Pedagogico'),
    primary key(id),
    foreign key (periodId) references period(id),
    foreign key(tutorId) references teacher(id)
 );
 
  create table if not exists student (
	id int auto_increment,
    cc varchar(20) unique,
    email varchar(250),
    groupId int, 
    firstName varchar(250),
    lastName varchar(250),
    gender set ("M", "F"),
    password text,
    primary key(id),
    foreign key(groupId) references `group`(id)
 );
 
 -- agregar representante a grupo
 
 create table if not exists subjectGroup(
	id int auto_increment,
	teacherId int,
    subjectId int,
    groupId int, 
    hours int,
    primary key(id),
    foreign key (teacherId) references teacher(id),
    foreign key (subjectId) references `subject`(id),
    foreign key (groupId) references `group`(id)
 );
 
 
 create table if not exists subjectGroupTimeSlot(
	id int auto_increment,
    timeSlotId int, 
    subjectGroupId int,
    day set('MON', 'TUE', 'WED', 'THU', 'FRI'),
    primary key(id),
    foreign key(timeSlotId) references timeSlot(id),
    foreign key(subjectGroupId) references subjectGroup(id)
 );
 
 create table if not exists enrollment(
	id int auto_increment,
    studentId int,
    subjectGroupId int,
    primary key(id),
    foreign key(studentId) references student(id),
    foreign key(subjectGroupId) references subjectGroup(id),
    unique key uniqueEnrollment (studentId, subjectGroupId)
 );
 
 

 
 
 create table if not exists permission (
	id int auto_increment,
    studentId int,
    status set('P','S','A', 'N') default 'P',
    requestDate date,
    approvalDate date,
    reason varchar(250),
    evidenceUrl text,
    studentNote text,
    principalNote text,
    
    primary key(id),
    foreign key(studentId) references student(id)
 );
 
 create table if not exists dailyReport(
	id int auto_increment,
    subjectGroupTimeSlotId int,
    reportDate date,
	isSubmitted bool default false,
    primary key (id),
    foreign key (subjectGroupTimeSlotId) references subjectGroupTimeSlot(id)
 );

 
 create table if not exists absence(
	id int auto_increment,
    -- subjectGroupTimeSlotId int, 
    permissionId int default null,
    dailyReportId int default null,
    studentId int,
    -- absenceDate datetime default now(),
    teacherNote text,
    
    primary key(id),
    
    foreign key (studentId) references student(id),
    -- foreign key(subjectGroupTimeSlotId) references subjectGroupTimeSlot(id),
    foreign key(permissionId) references permission(id),
    foreign key(dailyReportId) references dailyReport(id)
 );
 

 