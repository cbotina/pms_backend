use pms_dev;

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
select * from student where groupId = 2;
select * from user;

delete from user where id >0;
delete from user where id = 3;


