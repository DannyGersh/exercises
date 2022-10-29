\c exercises

create table exercises(

    id              serial not null primary key, 
    author          integer not null,
    creationdate    timestamp not null default current_timestamp,
    rating          integer[] not null default '{}',
    tags            integer[] not null default '{}',
    latex_dir       varchar(30) not null,
    latex_pkg       varchar(400) not null default '', 

    title           varchar(400) not null,
    exercise        varchar(4000) not null,
    answer          varchar(4000) not null,
    hints           varchar(4000) not null default '',
    explain         varchar(4000) not null default '',

    latex_title     json not null,
    latex_exercise  json not null,
    latex_answer    json not null,
    latex_hints     json not null,
    latex_explain   json not null

)