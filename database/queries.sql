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
    
-- ASIGNACION DOCENTE

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
where g.name like '13-04'
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