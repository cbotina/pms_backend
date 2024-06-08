drop database if exists escuelanormalsuperior;
create database if not exists escuelanormalsuperior;
use escuelanormalsuperior;


create table if not exists period(
	id int auto_increment,
    name varchar(10),
    primary key(id)
);


create table if not exists time_slot(
	id int auto_increment,
    period_id int,
    start_time time,
    end_time time,
    is_academic bool default false,
    
    primary key(id),
    foreign key(period_id) references period(id)
);
  
 create table if not exists `subject`(
	id int auto_increment,
    name varchar(150) unique,
    absences_limit int,
    primary key(id)
 );
 

 
 create table if not exists teacher(
	id int auto_increment,
    cc varchar(20),
    first_name varchar(150),
    last_name varchar(150),
    password text,
    primary key(id)
 );
 
 create table if not exists `group`(
	id int auto_increment,
    period_id int, 
    tutor_id int,
    name varchar(10),
    semester varchar(150),
    modality set('Academico', 'Pedagogico'),
    primary key(id),
    foreign key (period_id) references period(id),
    foreign key(tutor_id) references teacher(id)
 );
 


 
  create table if not exists student (
	id int auto_increment,
    cc varchar(20),
    group_id int, 
    first_name varchar(250),
    last_name varchar(250),
    gender set ("M", "F"),
    password text,
    primary key(id),
    foreign key(group_id) references `group`(id)
 );
 
 -- agregar representante a grupo
 
 create table if not exists subject_group(
	id int auto_increment,
	teacher_id int,
    subject_id int,
    group_id int, 
    primary key(id),
    foreign key (teacher_id) references teacher(id),
    foreign key (subject_id) references `subject`(id),
    foreign key (group_id) references `group`(id)
 );
 
 
 create table if not exists subject_group_time_slot(
	id int auto_increment,
    time_slot_id int, 
    subject_group_id int,
    day set('MON', 'TUE', 'WED', 'THU', 'FRI'),
    primary key(id),
    foreign key(time_slot_id) references time_slot(id),
    foreign key(subject_group_id) references subject_group(id)
 );
 
 create table if not exists enrollment(
	id int auto_increment,
    student_id int,
    subject_group_id int,
    primary key(id),
    foreign key(student_id) references student(id),
    foreign key(subject_group_id) references subject_group(id),
    unique key unique_enrollment (student_id, subject_group_id)
 );
 
 
 create table if not exists permission_status (
	id int auto_increment,
    name varchar(100),
    description varchar(300),
    primary key(id)
 );
 
 
 create table if not exists permission (
	id int auto_increment,
    student_id int,
    status_id int,
    request_date date,
    approval_date date,
    reason varchar(250),
    evidence_url text,
    student_note text,
    principal_note text,
    
    primary key(id),
    foreign key(student_id) references student(id),
    foreign key (status_id) references permission_status(id)
 );

 
 create table if not exists absence(
	id int auto_increment,
    subject_group_time_slot_id int, 
    permission_id int default null,
    student_id int,
    absence_date datetime default now(),
    teacher_note text,
    
    primary key(id),
    
    foreign key (student_id) references student(id),
    foreign key(subject_group_time_slot_id) references subject_group_time_slot(id),
    foreign key(permission_id) references permission(id)
 );
 
     
    -- estado set('F', 'E', 'P', 'C', 'S', 'A', 'N'),
    --  agregar motivo
    --  c en lugar de flex
   --  url_evidencia text,
    -- evasion
    -- salio pero le queda la falta.
    -- S por coordinacion o por secretaria.
    -- autorizacion_salida
 
--  INSERCION DE DATOS

INSERT INTO period (name) VALUES ('2024-A'), ('2024-B'), ('2025-A');

INSERT INTO time_slot (period_id, start_time, end_time, is_academic) VALUES 
(1, '07:00:00', '07:55:00', true),
(1, '07:55:00', '08:50:00', true),
(1, '08:50:00', '09:45:00', true),
(1, '09:45:00', '10:40:00', true),
(1, '10:40:00', '11:10:00', false),
(1, '11:10:00', '12:05:00', true),
(1, '12:05:00', '12:55:00', true),
(1, '12:55:00', '13:00:00', false),
(1, '13:00:00', '13:55:00', true),
(1, '13:55:00', '14:50:00', true),
(1, '14:50:00', '15:45:00', true),
(1, '15:45:00', '16:40:00', true),
(1, '16:40:00', '17:35:00', true),
(1, '17:35:00', '18:30:00', true);


INSERT INTO subject (name, absences_limit) VALUES 
('Psicología del Desarrollo I', 5),
('Didáctica General', 4),
('Observación Pedagógica', 3),
('Psicología del Desarrollo II', 6),
('Psicología del Aprendizaje I', 4),
('Educación Preescolar I', 5),
('Ciencias Sociales', 3),
('Educación Artística (Plástica)', 7),
('Educación Artística (Música)', 6),
('TIC en el aula I', 4),
('Comunicación y Lenguaje I', 3),
('Lúdica y Psicomotricidad I', 6),
('Cultura Educación y Sociedad', 5),
('Práctica Pedagógica Investigativa I', 5),
('Investigación Educativa I', 7),
('Socialización I', 3),
-- --  semestre 2
('Psicología del Aprendizaje II', 4),
('Educación Preescolar II', 5),
('Educación Matemática I', 3),
('Ciencias Naturales', 7),
('Diseño curicular', 7),
('Comunicación y Lenguaje II', 3),
('Historia de la educación', 3),
('Práctica Pedagógica Investigativa II', 5),
('Investigación Educativa II', 5),
('Socialización II', 6),
('Educación a Poblaciones', 5),

--  tercer semestre
('Psicología Social', 5),
('Educación Preescolar III', 7),
('Educación Matemática II', 3),
('Educación Religiosa', 5),
('Inglés I', 4),
('Lectura y producción de Textos I', 4),
('Lúdica y Psicomotricidad II', 5),
('Pedagogías Contemporáneas I', 6),
('Práctica Pedagógica Investigativa III', 5),
('Investigación Educativa III', 5),
('Socialización III', 7),
('Educación Alternativa', 7),

--  cuarto semestre
('Formación Ciudadana', 7),
('Administración y Gestión Educativa', 3),
('Ética y Valores', 6),
('Procesos evaluativos', 5),
('Inglés II', 7),
('TIC en el aula II', 7),
('Lectura y Producción de Textos II', 7),
('Educación Física', 4),
('Pedagogías Contemporáneas II', 6),
('Práctica Pedagógica Investigativa IV', 3),
('Investigación Educativa IV-V', 3),
('Socialización IV - V', 5);



INSERT INTO teacher (cc, first_name, last_name) VALUES
(1001, 'Ivan Alexander', 'Muñoz Criollo'),
(1002, 'Cristian Francisco', 'Benavides Urbano'),
(1003, 'Germán Eduardo', 'Castro Lasso'),
(1004, 'Lucy Dalia', 'Muñoz Martinez'),
(1005, 'Hernando Eliecer', 'Calvache J.'),
(1006, 'Gladys del S.', 'Sepúlveda Pabón'),
(1007, 'Andrés Felipe', 'Gómez'),
(1008, 'María Fernanda', 'Rodríguez'),
(1009, 'Juan Carlos', 'Herrera'),
(1010, 'Natalia', 'Pérez'),
(1011, 'Laura', 'Castillo'),
(1012, 'Diego', 'Fernández'),
(1013, 'Catalina', 'Morales'),
(1014, 'Andrés', 'López'),
(1015, 'Paula', 'García'),
(1016, 'Sergio', 'Martínez'),
(1017, 'Valentina', 'Ortiz'),
(1018, 'Mateo', 'Rojas'),
(1019, 'Daniel', 'Vargas');


INSERT INTO `group` (period_id, tutor_id, `name`, semester, modality) VALUES 
(1, 1, '12-1', 'PRIMER SEMESTRE', 'Academico'),
(1, 2, '12-2', 'PRIMER SEMESTRE', 'Academico'),
(1, 3, '13-1', 'SEGUNDO SEMESTRE', 'Pedagogico'),
(1, 4, '13-2', 'SEGUNDO SEMESTRE', 'Pedagogico');

select * from subject;

select 
sg.id as `subject_group`,
concat(t.first_name,' ',t.last_name) as `Teacher`,
s.name as `Subject`,
g.name as `Group`
from subject_group sg 
	inner join teacher t on sg.teacher_id = t.id
    inner join subject s on sg.subject_id = s.id
    inner join `group` g on sg.group_id = g.id;
    
INSERT INTO subject_group (teacher_id, subject_id, group_id) VALUES
-- CURSO 12-1
(1, 5, 1), 
(2, 6, 1), 
(3, 7, 1), 
(4, 8, 1),  
(5, 9, 1), 
(6, 10, 1),  
(7, 11, 1), 
(8, 12, 1), 
(9, 13, 1),
(10, 14, 1),
(11, 15, 1),
(12, 16, 1),

-- CURSO 12-2
(1, 17, 2), 
(2, 18, 2), 
(3, 19, 2),  
(4, 20, 2), 
(5, 21, 2),  
(6, 22, 2),
(7, 23, 2), 
(8, 24, 2),
(9, 25, 2),
(10, 26, 2),
(11, 27, 2),

-- CURSO 13-1
(1, 28, 3), 
(2, 29, 3), 
(3, 30, 3),  
(4, 31, 3), 
(5, 32, 3),  
(6, 33, 3),
(7, 34, 3), 
(8, 35, 3),
(9, 36, 3),
(10, 37, 3),
(11, 38, 3),
(12, 39, 3),

-- CURSO 13-2
(1, 40, 4), 
(2, 41, 4), 
(3, 42, 4),  
(4, 43, 4), 
(5, 44, 4),  
(6, 45, 4),
(7, 46, 4), 
(8, 47, 4),
(9, 48, 4),
(10, 49, 4),
(11, 50, 4),
(12, 51, 4);

select * from `subject`;

-- -- 
INSERT INTO student (cc, group_id, first_name, last_name, gender) VALUES
-- Group 12-1
(2001, 1, 'Juan Pablo', 'Solarte Cortes', 'M'),
(2002, 1, 'Maria Fernanda', 'Lopez Rodriguez', 'F'),
(2003, 1, 'Carlos Andres', 'Perez Martinez', 'M'),
(2004, 1, 'Laura Camila', 'Garcia Morales', 'F'),
(2005, 1, 'Jorge Luis', 'Ramirez Gomez', 'M'),
(2006, 1, 'Ana Lucia', 'Hernandez Sanchez', 'F'),
(2007, 1, 'Luis Miguel', 'Vargas Torres', 'M'),
(2008, 1, 'Diana Carolina', 'Ortega Ruiz', 'F'),
(2009, 1, 'Sebastian Alejandro', 'Rios Castillo', 'M'),
(2010, 1, 'Natalia Andrea', 'Mendoza Salazar', 'F'),

-- Group 12-2
(2011, 2, 'Brayan Esneider', 'Murillo Ramirez', 'M'),
(2012, 2, 'Andrea Paola', 'Martinez Jimenez', 'F'),
(2013, 2, 'Daniel Felipe', 'Salazar Morales', 'M'),
(2014, 2, 'Sofia Isabella', 'Castillo Vargas', 'F'),
(2015, 2, 'Camilo Andres', 'Cortes Herrera', 'M'),
(2016, 2, 'Sara Valentina', 'Rodriguez Ortiz', 'F'),
(2017, 2, 'Miguel Angel', 'Suarez Diaz', 'M'),
(2018, 2, 'Juliana Paola', 'Mendez Reyes', 'F'),
(2019, 2, 'Juan David', 'Moreno Pardo', 'M'),
(2020, 2, 'Angela Maria', 'Fuentes Gil', 'F'),

-- Group 13-1
(2021, 3, 'Mateo Alejandro', 'Castro Lozano', 'M'),
(2022, 3, 'Camila Daniela', 'Gonzalez Torres', 'F'),
(2023, 3, 'Santiago Andres', 'Ortiz Morales', 'M'),
(2024, 3, 'Isabella Sofia', 'Medina Vargas', 'F'),
(2025, 3, 'Diego Fernando', 'Molina Lopez', 'M'),
(2026, 3, 'Paula Andrea', 'Navarro Guzman', 'F'),
(2027, 3, 'Martin Alejandro', 'Vega Diaz', 'M'),
(2028, 3, 'Mariana Valentina', 'Rojas Castillo', 'F'),
(2029, 3, 'Fabian Ricardo', 'Martinez Rios', 'M'),
(2030, 3, 'Valentina Andrea', 'Quintero Ruiz', 'F'),

-- Group 13-2
(2031, 4, 'Daniela Sofia', 'Gutierrez Suarez', 'F'),
(2032, 4, 'Nicolas Santiago', 'Hernandez Rojas', 'M'),
(2033, 4, 'Valeria Isabel', 'Romero Cardenas', 'F'),
(2034, 4, 'Juan Sebastian', 'Vargas Ramirez', 'M'),
(2035, 4, 'Sofia Camila', 'Garcia Fernandez', 'F'),
(2036, 4, 'Andres Felipe', 'Salinas Montoya', 'M'),
(2037, 4, 'Laura Isabel', 'Bautista Vega', 'F'),
(2038, 4, 'Oscar Alejandro', 'Lopez Herrera', 'M'),
(2039, 4, 'Manuela Andrea', 'Sanchez Torres', 'F'),
(2040, 4, 'Luis Fernando', 'Ramirez Garcia', 'M');

-- select gm.id, d.nombre, m.nombre, g.nombre from grupo_materia gm
-- 	inner join docente d on d.id = gm.id_docente
--     inner join materia m on m.id = gm.id_materia
--     inner join grupo g on g.id = gm.id_grupo
--     order by gm.id asc;
--     



INSERT INTO subject_group_time_slot (time_slot_id, subject_group_id, day) VALUES 
--  HORARIO CURSO 12-1
(1, 11, 'MON'),
(2, 11, 'MON'),
(3, 7, 'MON'),
(4, 7, 'MON'),
(6, 12, 'MON'),
(7, 12, 'MON'),
(1, 10, 'TUE'),
(2, 10, 'TUE'),
(3, 10, 'TUE'),
(4, 10, 'TUE'),
(6, 10, 'TUE'),
(7, 10, 'TUE'),
(1, 5, 'WED'),
(2, 5, 'WED'),
(3, 1, 'WED'),
(4, 1, 'WED'),
(11, 2, 'WED'),
(12, 2, 'WED'),
(13, 4, 'WED'),
(14, 4, 'WED'),
(1, 9, 'THU'),
(2, 9, 'THU'),
(3, 9, 'THU'),
(4, 6, 'THU'),
(6, 6, 'THU'),
(7, 6, 'THU'),
(11, 7, 'THU'),
(12, 7, 'THU'),
(2, 8, 'FRI'),
(3, 5, 'FRI'),
(4, 5, 'FRI'),
(6, 2, 'FRI'),
(7, 2, 'FRI');


-- --  QUERIES	

-- --  TODOS LOS TIME SLOTS
select
sgts.id as 'subject_group_time_slot',
sgts.day as 'Dia',
ts.start_time  'Hora Inicio',
ts.end_time  'Hora Fin',
s.name 'Materia',
concat(t.first_name,' ',t.last_name)  `Docente Encargado`
from subject_group_time_slot sgts
inner join time_slot ts on sgts.time_slot_id = ts.id
inner join subject_group sg on sgts.subject_group_id = sg.id
inner join teacher t on sg.teacher_id = t.id
inner join subject s on sg.subject_id = s.id
order by sgts.day, ts.start_time;


-- horario 12-1
select
sgts.id as 'subject_group_time_slot',
g.name as 'Grupo',
sgts.day as 'Dia',
ts.start_time  'Hora Inicio',
ts.end_time  'Hora Fin',
s.name 'Materia',
concat(t.first_name,' ',t.last_name)  `Docente Encargado`
from subject_group_time_slot sgts
inner join time_slot ts on sgts.time_slot_id = ts.id
inner join subject_group sg on sgts.subject_group_id = sg.id
inner join `group` g on g.id = sg.group_id
inner join teacher t on sg.teacher_id = t.id
inner join subject s on sg.subject_id = s.id
where g.id = 1
order by sgts.day, ts.start_time;


select
	sg.id as 'subject_group',
    s.name 'Materia',
    g.name 'Grupo',
    concat(t.first_name,' ',t.last_name)  `Docente Encargado`
from
	subject_group sg
inner join teacher t on sg.teacher_id = t.id
inner join subject s on sg.subject_id = s.id
inner join `group` g on sg.group_id = g.id;

select * from enrollment;

--  ENROLLMENTS FOR GROUP 12-1
INSERT INTO enrollment (student_id, subject_group_id)
select students.n as student_id, subjects.n as subject_group_id
from (select id as n from subject_group where id <=12) as subjects
cross join (select id as n from student where id <=10) as students;

-- ENROLLMENTS FOR GROUP 12-2
INSERT INTO enrollment (student_id, subject_group_id)
select students.n as student_id, subjects.n as subject_group_id
from (select id as n from subject_group where id >= 13 and id <=23) as subjects
cross join (select id as n from student where id >= 11 and id <=20) as students;

--  ENROLLMENTS FOR GROUP 13-1
INSERT INTO enrollment (student_id, subject_group_id)
select students.n as student_id, subjects.n as subject_group_id
from (select id as n from subject_group where id >= 24 and id <=35) as subjects
cross join (select id as n from student where id >= 21 and id <=30) as students;

--  ENROLLMENTS FOR GROUP 13-2
INSERT INTO enrollment (student_id, subject_group_id)
select students.n as student_id, subjects.n as subject_group_id
from (select id as n from subject_group where id >= 36 and id <=47) as subjects
cross join (select id as n from student where id >= 31 and id <=40) as students;


--  TODAS LAS MATRICULAS
select
	en.id as 'enrollment',
	concat(st.first_name,' ',st.last_name) as 'Estudiante',
    su.name as 'Materia',
    g.name as 'Grupo'
from enrollment en
inner join student st on st.id = en.student_id
inner join subject_group sg on sg.id = en.subject_group_id
inner join subject su on su.id = sg.subject_id
inner join `group` g on g.id = sg.group_id;

--  LISTA DE ESTUDIANTES POR GRUPO
select 
	e.id Id,
    e.cc Cedula,
    concat(e.first_name, ' ', e.last_name) Estudiante,
    g.name Grupo
from student e
inner join `group` g on g.id = e.group_id
where g.name = "12-1";

--  LISTA DE ESTUDIANTES POR MATERIA
select
	en.id as 'enrollment',
    st.id as IdEstudiante,
	concat(st.first_name,' ',st.last_name) as 'Estudiante',
    su.name as 'Materia',
    g.name as 'Grupo'
from enrollment en
inner join student st on st.id = en.student_id
inner join subject_group sg on sg.id = en.subject_group_id
inner join subject su on su.id = sg.subject_id
inner join `group` g on g.id = st.group_id 
where en.subject_group_id = 2;

select * from subject_group;
select * from student;
--  ASIGNACION DE DOCENTES
select 
	sg.id subject_group_id,
	concat(t.first_name, ' ', t.last_name) as Docente,
    s.name as Materia,
    g.name as Grupo
from subject_group sg
inner join teacher t on sg.teacher_id = t.id
inner join subject s on sg.subject_id = s.id
inner join `group` g on sg.group_id = g.id;

--  MATERIAS POR DOCENTE
select 
	s.id as idMateria,
    s.name as Materia,
	concat(t.first_name, ' ', t.last_name) as Docente,
    g.name as Grupo
from subject_group sg
inner join teacher t on sg.teacher_id = t.id
inner join subject s on sg.subject_id = s.id
inner join `group` g on sg.group_id = g.id
where sg.teacher_id = 1;


--  MATERIAS MATRICULADAS POR ESTUDIANTE
select
	en.id enrollment,
	concat(st.first_name,' ',st.last_name) as 'Estudiante',
    su.name as 'Materias Matriculadas',
    g.name as 'Grupo'
from enrollment en
inner join student st on st.id = en.student_id
inner join subject_group sg on sg.id = en.subject_group_id
inner join subject su on su.id = sg.subject_id
inner join `group` g on g.id = sg.group_id
where en.student_id = 11;



    
-- select f.hora_inicio as Inicio,
-- f.hora_fin as Fin,
-- d.nombre as Docente,
-- m.nombre as Materia,
-- g.nombre as Grupo
-- 	from franja_grupo_materia fgm
--     inner join franja f on f.id = fgm.id_franja
--     inner join grupo_materia gm  on gm.id = fgm.id_grupo_materia
--     inner join docente d on d.id = gm.id_docente
--     inner join materia m on m.id = gm.id_materia
--     inner join grupo g on g.id = gm.id_grupo;

-- select fjm.id, f.hora_inicio, f.hora_fin, m.nombre, g.nombre
-- 	from franja_grupo_materia fjm
--     inner join franja f on f.id = fjm.id_franja
--     inner join grupo_materia gm on gm.id = fjm.id_grupo_materia
--     inner join materia m on m.id = gm.id_materia
--     inner join grupo g on g.id = gm.id_grupo;


-- INSERT INTO ausencia (id_estudiante, id_franja_grupo, fecha_ausencia, estado) VALUES 
-- ('201', 1, '2024-02-10', 'P'),
-- ('203', 2, '2024-02-10', 'P');



-- agregar fecha de validacion
-- preestablecido bloquear ausencias despues de 3 dias para los estudiantes.
-- cuando se alcanza el limite de faltas en una uf se deniega.
-- cuando se solicita en secretaria, se mandan los correos.


-- materias perdidas por estudiante
update enrollment set subject_group_id = 1 where id = 137;
update enrollment set subject_group_id = 2 where id = 147;
-- 2 14


select * from absence;
insert into absence(subject_group_time_slot_id, student_id, teacher_note) values
(17, 11, 'Se evadio');

select * from absence;

-- sgtsid, student_id, date, teacher_note
-- insert into absence(subject_group_time_slot_id, student_id, teacher_note) values
-- ();

 

 
 

