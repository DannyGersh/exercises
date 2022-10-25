\c exercises

create table exercises(

    id              serial primary key not null, 
    author          integer not null,
    creationdate    timestamp default current_timestamp,
    rating          integer[] not null default '{}',
    tags            integer[] not null default '{}',
    latex_dir       varchar(30) not null,
    latex_pkg       varchar(400) default '', 

    title           varchar(400) not null,
    exercise        varchar(4000) not null,
    answer          varchar(4000) not null,
    hints           varchar(4000) default '',
    explain         varchar(4000) default '',

    latex_title     varchar(400)[] default '{}',
    latex_exercise  varchar(4000)[] default '{}',
    latex_answer    varchar(4000)[] default '{}',
    latex_hints     varchar(4000)[] default '{}',
    latex_explain   varchar(4000)[] default '{}'

)