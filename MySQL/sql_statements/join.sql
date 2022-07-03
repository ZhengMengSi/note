create table t1 (m1 int, n1 char(1));
create table t2 (m2 int, n2 char(1));
insert into t1 values (1, 'a'), (2, 'b'), (3, 'c');
insert into t2 values (2, 'b'), (3, 'c'), (4, 'd');
truncate t1;
select *
from t1,t2
where m1 > 1 and m1 = m2 and n2 < 'd';

create table student (
    number int not null auto_increment comment '学号',
    name varchar(5) comment '姓名',
    major varchar(30) comment '专业',
    primary key (number)
) engine=InnoDB charset=utf8 comment '学生信息表';

create table score (
    number int comment '学号',
    subject varchar(30) comment '科目',
    score tinyint comment '成绩',
    primary key (number, subject)
) engine=InnoDB charset=utf8 comment '学生成绩表';

insert into student values (20180101, '张三', '软件学院');
insert into student values (20180102, '李四', '计算机科学与工程');
insert into student values (20180103, '王五', '计算机科学与工程');

insert into score values (20180101, 'MySQL是这样运行的', 78);
insert into score values (20180101, '深入浅出MySQL', 88);
insert into score values (20180102, '深入浅出MySQL', 98);
insert into score values (20180102, 'MySQL是这样运行的', 100);

select s1.number, name, subject, score
from student as s1, score as s2
where s1.number = s2.number;

select s1.number, name, subject, score
from student as s1
left join score s
on s1.number = s.number;
