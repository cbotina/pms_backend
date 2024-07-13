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
where g.name = '13-04' 
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

delete from permission where id > 0;
select * from `group`;
select * from student where groupId = 4;

select * from teacher;

