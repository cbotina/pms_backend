use pms_dev;

select * from user;
select * from student;
SELECT 
    sg.id subjectGroupId,
    s.name AS subjectName,
    g.name AS groupName,
    CONCAT(t.firstName, ' ', t.lastName) AS teacherName,
    sg.hours
FROM 
    subject_group sg
JOIN 
    teacher t ON sg.teacherId = t.id
JOIN 
    subject s ON sg.subjectId = s.id
JOIN 
    `group` g ON sg.groupId = g.id
WHERE 
	t.id = 1;
    


select sg.id as subjectGroupId, concat(t.firstName, ' ', t.lastName) as teacher, s.name as subject, g.name as `group`
from subject_group sg inner join teacher t on t.id = sg.teacherId inner join `group` g on g.id = sg.groupId inner join subject s on s.id = sg.subjectId
where g.name = '12-01' 
and s.name like "%%"
;
use pms_dev;
select * from student where groupId = 3;
select * from user;

delete from user where id >0;
delete from user where id = 3;

select * from daily_report where id = 24;
update daily_report set isSubmitted = true where id = 24;
select * from permission;
select * from student where id = 42;

select * from absence;
select * from daily_report;
select * from subject_group_time_slot ;

delete from daily_report where id > 0;

select * from absence;
select * from daily_report;
select * from teacher;
select * from user where role = 'teacher';

delete from daily_report where id > 0;
select * from `group`;
select * from student where groupId = 4;

select * from teacher;
select * from user where email like 'germaneduardo%';
select * from absence;


select count(*) as absences,
s.name as subjectName,
g.periodId periodId,
st.id studentId
from absence a
inner join student st on st.id = a.studentId
inner join daily_report dr on dr.id = a.dailyReportId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join subject_group sg on sg.id = sgts.subjectGroupId
inner join subject s on s.id = sg.subjectId
inner join `group` g on g.id = sg.groupId
group by s.name
order by absences desc;

select * from student;
select * from user where role = 'admin';
select * from permission;
delete from permission where id = 26;

select 
s.name, sg.hours, g.name
from subject_group sg inner join subject s on s.id = sg.subjectId
inner join `group` g on g.id = sg.groupId
where s.name like '%observacion pedagogica%';

select * from permission;
delete from permission where id = 29;
use pms_dev;

select 
a.id, st.firstName, dr.reportDate, ts.startTime, ts.endTime
from absence a
inner join student st on st.id = a.studentId
inner join daily_report dr on  dr.id = a.dailyReportId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join time_slot ts on ts.id = sgts.timeSlotId;
select * from absence;
delete from absence where id = 131;

select * from absence where id = 152;
-- 149-152
delete from absence where id > 0;

select * from teacher;
use pms_dev;

select * from absence;
select * from permission;
update permission set status = 'P' where id = 3;
delete from permission where id = 6;
select * from user where role = 'TEACHER';
select * from teacher;
select * from student where lastName like 'arciniega%';
select * from daily_report;

select * from permission;
select sub.name, sg.hours from subject sub inner join subject_group sg on sg.subjectId = sub.id;

use pms_dev;

select * from daily_report;

delete from daily_report where id > 0;

select * from daily_report;

update daily_report set isSubmitted = 0 where id = 34;
delete from daily_report where id = 30;

-- flutter 2024-07-31 00:00:00.000

select * from period;
update period set endDate = '2024-11-30' where id = 1;

use pms_dev;
select * FROM STUDENT where id = 23;
select * FROM teacher;
select * FROM STUDENT where id = 'nicol%';