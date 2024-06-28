use escuelanormalsuperior;

select * from subject where name = 'Ciencias Sociales';

select id, name from `subject` order by id;

select id, lastName, firstName from teacher order by lastName asc;

-- GROUP DETAILS
select
	g.id ID,
    p.name Periodo,
    concat(t.firstName, ' ', t.lastName) Dinamizador,
    g.Name Nombre,
    g.semester Semetre,
    g.modality Modalidad
from `group` g 
	left join period p on p.id = g.periodId
    left join teacher t on t.id = g.tutorId;
    
-- TEACHER SUBJECTS

select
sg.id 'as sgId',
s.name as 'Unidad de Formación',
concat(t.firstName, ' ', t.lastName) as 'Profesor',
g.name as 'Grado',
sg.hours as 'Horas'
from subjectGroup sg
left join subject s on s.id = sg.subjectId
left join `group` g on g.id = sg.groupId
left join teacher t on t.id = sg.teacherId
where g.name like '13-03'
order by s.name;

select 
    sgts.day as 'Dia',
	ts.startTime as 'Inicio',
    ts.endtime as 'Fin',
    s.name as 'Materia',
    concat(t.firstName, ' ', t.lastName) as 'Docente',
    g.name as 'Grupo'
from subjectGroupTimeSlot sgts
left join subjectGroup sg on sgts.subjectGroupId = sg.id
left join teacher t on sg.teacherId = t.id
left join `group` g on g.id = sg.groupId
left join subject s on s.id = sg.subjectId
left join timeSlot ts on ts.id = sgts.timeSlotId
where g.name = '12-02' and sgts.day = 'MON'
order by ts.startTime;

    


select id, startTime, endTime from timeSlot where isAcademic=true;

select sum(sg.hours)
from subjectGroup sg
left join teacher t on t.id = sg.teacherId
where t.firstName like '%docente%';

select 
s.id subjectId,
s.name subjectName,
g.id groupId,
g.name groupName
from `subject` s
cross join `group` g 
where s.name like 
'%formacion%'
and g.name like '13%1';
;

-- materias 12-1
select 
s.name as Materia,
concat(t.firstName, ' ', t.lastName) as Docente
from subjectGroup sg
left join subject s on s.id = sg.subjectId
left join teacher t on t.id = sg.teacherId
where groupId = 5;


-- TEACHER SCHEDULE BY DAY
select 
ts.startTime as Inicio,
ts.endTime as Fin,
g.name as Grupo,
sub.name as Materia,
sgts.day as Dia,
concat(t.firstName, ' ', t.lastName) as Docente
from subjectGroupTimeSlot sgts
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sgts.subjectGroupId = sg.id
inner join `group` g on g.id = sg.groupId
inner join subject sub on sub.id = sg.subjectId
inner join teacher t on t.id = sg.teacherId
where t.firstName = 'Alejandra'
and sgts.day = 'TUE'
order by ts.startTime;

select 
ts.startTime as Inicio,
ts.endTime as Fin,
t.id,
g.periodId,
g.name as Grupo,
sub.name as Materia,
sgts.day as Dia,
concat(t.firstName, ' ', t.lastName) as Docente
from subjectGroupTimeSlot sgts
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sgts.subjectGroupId = sg.id
inner join `group` g on g.id = sg.groupId
inner join subject sub on sub.id = sg.subjectId
inner join teacher t on t.id = sg.teacherId;

-- STUDENT SCHEDULE
select 
sgts.id as subjectGroupTimeSlotId,
ts.startTime as Inicio,
ts.endTime as Fin,
sub.name as Materia,
sgts.day as Dia
from subjectGroupTimeSlot sgts
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sgts.subjectGroupId = sg.id
inner join subject sub on sub.id = sg.subjectId
inner join enrollment en on en.subjectGroupId = sg.id
inner join student st on st.id = en.studentId
inner join `group` g on g.id = sg.groupId
where st.cc = '1004134533'
and g.periodId = 1
and sgts.day = 'MON'
order by ts.startTime;

-- STUDENT ENROLLMENTS
select 
en.id as enrollmentId,
concat (st.firstName, ' ', st.lastName) as Estudiante,
sg.id as subjectGroupId,
sub.name as subjectName
from enrollment en
inner join student st on st.id = en.studentId
inner join subjectGroup sg on sg.id = en.subjectGroupId
inner join subject sub on sub.id = sg.subjectId
where st.cc = '1004234208';

-- SEARCH SUBJECT GROUPS
select 
sg.id subjectGroupId, 
sub.name Materia, 
g.name Grupo, 
concat (t.firstName, ' ', t.lastName) Docente
from subjectGroup sg
inner join subject sub on sub.id = sg.subjectId
inner join `group` g on g.id = sg.groupId
inner join teacher t on t.id = sg.teacherId
where sub.name like 'ciencias naturales';


-- TEACHER SUBJECT GROUPS

select 
sg.id subjectGroupId, 
sub.name Materia, 
g.name Grupo
from subjectGroup sg
inner join subject sub on sub.id = sg.subjectId
inner join `group` g on g.id = sg.groupId
inner join teacher t on t.id = sg.teacherId
where t.firstName like 'Alejandra';

-- STUDENT PERMISSIONS
select 
permission.requestDate as 'Fecha solicitud',
permission.reason as Motivo,
status as Estado
from permission 
inner join student s on s.id = permission.studentId
inner join `group` g on g.id = s.groupId
inner join period p on g.periodId = p.id
where p.id = 1
and studentId = 89;


-- PERMISSION TIME SLOTS
select 
a.absenceDate as Fecha,
concat (ts.startTime, ' - ', ts.endTime) as Horas,
sub.name as Materia
from permission p 
inner join absence a on a.permissionId = p.id
inner join subjectGroupTimeSlot sgts on sgts.id = a.subjectGroupTimeSlotId
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sg.id = sgts.subjectGroupId
inner join subject sub on sub.id = sg.subjectId
where a.studentId = 89;

-- student timeslots of a day
select 
sgts.id as subjectGroupTimeSlotId,
concat (ts.startTime, ' - ', ts.endTime) as Horas,
sub.name as Materia,
sgts.day as Dia
from subjectGroupTimeSlot sgts
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sgts.subjectGroupId = sg.id
inner join subject sub on sub.id = sg.subjectId
inner join enrollment en on en.subjectGroupId = sg.id
inner join student st on st.id = en.studentId
inner join `group` g on g.id = sg.groupId
where st.cc = '1004134533'
and g.periodId = 1
and sgts.day = 'WED'
order by ts.startTime;


-- STUDENT ABSENCES
select
a.absenceDate,
concat (ts.startTime, ' - ', ts.endTime) as Horas,
sub.name
from absence a
inner join subjectGroupTimeSlot sgts on sgts.id = a.subjectGroupTimeSlotId
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subjectGroup sg on sg.id = sgts.subjectGroupId
inner join subject sub on sub.id = sg.subjectId
inner join `group` g on g.id = sg.groupId
inner join period per on per.id = g.periodId
where studentId = 89 and permissionId is null;

-- TEACHER TIME SLOTS OF A DAY
select
	sgts.day as Dia,
    sub.name as Materia,
    g.name as Grupo,
    ts.startTime as Inicio,
    ts.endTime as Fin
from subjectGroupTimeSlot sgts 
inner join subjectGroup sg on sg.id = sgts.subjectGroupId
inner join teacher t on t.id = sg.teacherId
inner join `group` g on g.id = sg.groupId
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subject sub on sub.id = sg.subjectId
where t.cc = '1001' and sgts.day = 'MON';

-- TEACHER REPORTS OF THE DAY
select
	sgts.day as Dia,
    sub.name as Materia,
    g.name as Grupo,
    ts.startTime as Inicio,
    ts.endTime as Fin,
    dr.isSubmitted as Hecho
from dailyReport dr 
right join subjectGroup sg on sg.id = dr.subjectGroupId
right join subjectGroupTimeSlot sgts on sgts.subjectGroupId = sg.id
inner join teacher t on t.id = sg.teacherId
inner join `group` g on g.id = sg.groupId
inner join timeSlot ts on ts.id = sgts.timeSlotId
inner join subject sub on sub.id = sg.subjectId
where t.cc = '1001' and sgts.day = 'MON';


-- student list of a subject 
select
	st.id as studentId,
	concat(st.firstName, ' ', st.lastName) as Estudiante
    from enrollment en 
    inner join student st on st.id = en.studentId
    where en.subjectGroupId = 100;

-- most absent student of a subject group
select
concat(st.firstName, ' ', st.lastName) as Estudiante,
absence.absenceDate as Fecha,
absence.teacherNote as Comentario
from absence 
inner join subjectGroupTimeSlot sgts on sgts.id = absence.subjectGroupTimeSlotId
inner join subjectGroup sg on sg.id  = sgts.subjectGroupId
inner join student st on st.id = absence.studentId
where sg.id = 19
and st.cc = '1004134533'
order by absence.absenceDate;

-- 
select count(*) as Faltas,
concat(st.firstName, ' ', st.lastName) as Estudiante
from absence 
inner join subjectGroupTimeSlot sgts on sgts.id = absence.subjectGroupTimeSlotId
inner join subjectGroup sg on sg.id  = sgts.subjectGroupId
inner join student st on st.id = absence.studentId
where sg.id = 19
group by absence.studentId
order by Faltas desc;

select * from teacher;

-- ALL PERMISSIONS
select 
p.requestDate as 'Fecha de solicitud',
concat(st.firstName, ' ', st.lastName) as 'Estudiante',
p.reason as Motivo,
p.status as Estado
from permission p
inner join student st on st.id = p.studentId
order by p.requestDate desc;


select 
count(*),
g.name
from absence a
inner join subjectGroupTimeslot sgts on sgts.id = a.subjectGroupTimeSlotId
inner join subjectGroup sg on sg.id = sgts.subjectGroupId
inner join `group` g on g.id = sg.groupId
group by g.id;

-- top absent students (global)
select
count(*) as Faltas,
concat(st.firstName, ' ', st.lastName) as Estudiante
from absence 
inner join subjectGroupTimeSlot sgts on sgts.id = absence.subjectGroupTimeSlotId
inner join subjectGroup sg on sg.id  = sgts.subjectGroupId
inner join subject sub on sg.subjectId = sub.id
inner join student st on st.id = absence.studentId
left join permission p on absence.permissionId = p.id
where p.status != 'A' or p.status is null
group by absence.studentId
order by Faltas desc;


-- top absences in subjects

-- top absent subjects (global)
select
count(*) as Faltas,
sub.name as Materia,
g.name as Grupo
from absence 
inner join subjectGroupTimeSlot sgts on sgts.id = absence.subjectGroupTimeSlotId
inner join subjectGroup sg on sg.id  = sgts.subjectGroupId
inner join subject sub on sg.subjectId = sub.id
inner join student st on st.id = absence.studentId
left join permission p on absence.permissionId = p.id
inner join `group` g on sg.groupId = g.id
where p.status != 'A' or p.status is null
group by sg.id
order by Faltas desc;

select 
count(*),
reason
from permission
group by reason;


select
s.name,
g.name 
from subject s
inner join subjectGroup sg on sg.subjectId = s.id
inner join subjectGroupTimeSlot sgts on sgts.subjectGroupId = sg.id
inner join `group` g on sg.groupId = g.id
left join absence a on a.subjectGroupTimeSlotId = sg.id
where a.id is not null;


SELECT DISTINCT sub.name AS subjectName, t.firstName AS teacherFirstName, g.name AS groupName
FROM subjectGroup sg
INNER JOIN `subject` sub ON sg.subjectId = sub.id
INNER JOIN teacher t ON sg.teacherId = t.id
INNER JOIN `group` g ON sg.groupId = g.id
LEFT JOIN subjectGroupTimeSlot sgts ON sg.id = sgts.subjectGroupId
LEFT JOIN absence a ON sgts.id = a.subjectGroupTimeSlotId
WHERE sg.id
not in (
SELECT DISTINCT sg.id
FROM subjectGroup sg
INNER JOIN `subject` sub ON sg.subjectId = sub.id
INNER JOIN teacher t ON sg.teacherId = t.id
INNER JOIN `group` g ON sg.groupId = g.id
LEFT JOIN subjectGroupTimeSlot sgts ON sg.id = sgts.subjectGroupId
LEFT JOIN absence a ON sgts.id = a.subjectGroupTimeSlotId
WHERE a.id IS not null);



##########

select * from absence left join permission p on p.id = absence.permissionId;

select 
count(*) as absences,
g.name as `group`
from absence a
left join daily_report dr on dr.id = a.dailyReportId
left join permission p on p.id = a.permissionId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join subject_group sg on sg.id = sgts.subjectGroupId
inner join `group` g on g.id = sg.groupId
where g.periodId = 1
and (
p.status !='A' or p.id is null
)
group by g.id;


select 
count(*),
p.reason
from permission p 
inner join student st on p.studentId = st.id
inner join `group` g on g.id = st.groupId
-- where g.periodId = 1
group by p.reason;


select
count(*) as absences,
concat(st.firstName, ' ', st.lastName) as student
from absence a
inner join student st on st.id = a.studentId
left join daily_report dr on dr.id = a.dailyReportId
left join permission p on p.id = a.permissionId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join subject_group sg on sg.id = sgts.subjectGroupId
inner join `group` g on g.id = sg.groupId
 where g.periodId = 1
and (
p.status !='A' or p.id is null
)
group by a.studentId
order by absences desc;


select 
count(*),
p.status
from permission p 
inner join student st on p.studentId = st.id
inner join `group` g on g.id = st.groupId
-- where g.periodId = 1
group by p.status;




select
count(*) as absences,
sub.name as subject,
g.name as `group`
from absence a
left join daily_report dr on dr.id = a.dailyReportId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join subject_group sg on sg.id  = sgts.subjectGroupId
inner join subject sub on sg.subjectId = sub.id
inner join student st on st.id = a.studentId
left join permission p on a.permissionId = p.id
inner join `group` g on sg.groupId = g.id
-- where g.periodId = 1
and (
p.status != 'A' or p.status is null
)
group by sg.id
order by absences desc;

show tables;
select * from teacher_subjects_view;
select * from permission;
select * from absence;
select * from daily_report;
delete from permission where id = 6;

update permission set status = 'A' where id = 11;
select
-- *
count(*) as Faltas,
concat(st.firstName, ' ', st.lastName) as Estudiante
from daily_report dr
inner join absence a on a.dailyReportId =  dr.id
left join permission p on p.id = a.permissionId
inner join subject_group_time_slot sgts on sgts.id = dr.subjectGroupTimeSlotId
inner join subject_group sg on sg.id  = sgts.subjectGroupId
inner join student st on st.id = a.studentId
where sg.id = 6 -- AFUERA
and (
p.status != 'A' or p.id is null 
)
group by a.studentId
order by Faltas desc;
;
update permission set status = 'R' where id = 1;

select 
sgts.id subjectGroupTimeSlotId,
dr.reportDate,
ts.startTime startTime,
ts.endTime endTime,
s.name subjectName,
g.name groupName,
dr.isSubmitted isSubmitted,
g.periodId periodId,
t.id teacherId
from subject_group_time_slot sgts
inner join daily_report dr on sgts.id = dr.subjectGroupTimeslotId
inner join time_slot ts on ts.id = sgts.timeSlotId
inner join subject_group sg on sg.id = sgts.subjectGroupId
inner join `group` g on g.id = sg.groupId
inner join teacher t on t.id = sg.teacherId
inner join subject s on s.id = sg.subjectId
where sgts.day = 'MON'
and t.id = 2
and g.periodId = 1
-- and dr.reportDate = '2024-06-24' 
order by ts.startTime;



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
    


order by s.name;

use pms_dev;



