import os
import pathlib

sql_exercises = [
    'id',              #serial primary key not null, 
    'author',          #integer not null,
    'creationdate',    #timestamp default current_timestamp,
    'rating',          #integer[] not null default '{}',
    'tags',            #integer[] not null default '{}',
    'latex_dir',       #varchar(30) not null,
    'latex_pkg',       #varchar(400) default '', 

    'title',           #varchar(400) not null,
    'exercise',        #varchar(4000) not null,
    'answer',          #varchar(4000) not null,
    'hints',           #varchar(4000) default '',
    'explain',         #varchar(4000) default '',

    'latex_title',     #varchar(400)[] default '{}',
    'latex_exercise',  #varchar(4000)[] default '{}',
    'latex_answer',    #varchar(4000)[] default '{}',
    'latex_hints',     #varchar(4000)[] default '{}',
    'latex_explain',   #varchar(4000)[] default '{}'
]
sql_chalange = [
    'id',           # serial primary key not null 
    'exercise',     # varchar(4000) not null
    'answer',       # varchar(4000) not null
    'hints',        # varchar(4000)
    'author',       # varchar(100)
    'creationdate', # timestamp default current_timestamp
    'title',        # varchar(400) not null
    'rating',       # integer[] not null default '{}'
    'tags',         # varchar(100)[] not null default '{}'
    'explain',      # varchar(4000)
    'latex',        # varchar(30)[] not null default '{}'
    'latexp',       # varchar(400)

    'authorName',   # IMPORTANT - not in database
]
sql_auth = [
    'authored', # integer[] default '{}'
    'liked',    # integer[] default '{}'
    'answered'  # integer[] default '{}'
]
sql_tags = [
    'id',   # serial primary key not null
    'name', # varchar(100) not null unique
]
sql_messages = [
    'id'            # serial            primary key not null,
    'chalangeId'    # serial            not null            ,
    'sender'        # serial            not null            ,
    'receiver'      # serial            not null            ,
    'message'       # varchar(4000)     not null
]


DIR_USERS = pathlib.Path('/volume/static/users')

reg_latex = r'$$___latex$$'
reg_latex_search = r'\$\$(.+?)\$\$'


sql_get_hotest = '''
    select  

    a.id, a.exercise, a.answer, a.hints, 
    a.author, 
    to_char(a.creationdate, 'MM/DD/YYYY - HH24:MI'), a.title, a.rating, 
    array(select name from tags where id in (select * from unnest(a.tags)) ), 
    a.explain, a.latex, a.latexp, b.username    

    from chalanges as a
    inner join auth_user as b
    on a.author = b.id  

    order by cardinality(rating)
'''

sql_get_latest = '''
    select  

    a.id, a.exercise, a.answer, a.hints, 
    a.author, 
    to_char(a.creationdate, 'MM/DD/YYYY - HH24:MI'), a.title, a.rating, 
    array(select name from tags where id in (select * from unnest(a.tags)) ), 
    a.explain, a.latex, a.latexp, b.username    

    from chalanges as a
    inner join auth_user as b
    on a.author = b.id  

    order by creationdate desc limit 10
'''

sql_insert_exercise =  '''
insert into exercises(
    author,       
    latex_dir,       
    title,
    exercise,
    answer, 
    hints,
    explain,         
    latex_title,     
    latex_exercise,  
    latex_answer,    
    latex_hints,     
    latex_explain
) values (
    {author}, 
    {latex_dir}, 
    {title}, 
    {exercise}, 
    {answer},
    {hints}, 
    {explain}, 
    {latex_title}, 
    {latex_exercise}, 
    {latex_answer}, 
    {latex_hints}, 
    {latex_explain}
) 
'''

sql_get_hotest2 = '''
select

    author,
    rating,
    tags,
    latex_dir,

    title,
    exercise,

    latex_title,
    latex_exercise

from exercises order by cardinality(rating) limit 10 
'''
sql_get_hotest2_elements = [
    'author',
    'rating',
    'tags',
    'latex_dir',

    'title',
    'exercise',

    'latex_title',
    'latex_exercise'
]