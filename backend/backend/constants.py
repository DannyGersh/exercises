import os
import pathlib
from django.http import JsonResponse


DIR_USERS = pathlib.Path('/volume/static/users')

reg_latex = r'$$___latex$$'
reg_latex_search = r'\$\$(.+?)\$\$'

JsonError = JsonResponse({'error': 'an error hase occurred.'})


latex_targets = (
    'title',
    'exercise',
    'answer',
    'hints',
    'explain',
)

sql_exercises = (
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
)
sql_chalange = (
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
)
sql_auth = (
    'authored', # integer[] default '{}'
    'liked',    # integer[] default '{}'
    'answered'  # integer[] default '{}'
)
sql_tags = (
    'id',   # serial primary key not null
    'name', # varchar(100) not null unique
)
sql_messages = (
    'id'            # serial            primary key not null,
    'chalangeId'    # serial            not null            ,
    'sender'        # serial            not null            ,
    'receiver'      # serial            not null            ,
    'message'       # varchar(4000)     not null
)


sql_get_hotest = (
    '''
    select
    rating, tags, latex_dir, author,
    title,exercise,
    latex_title, latex_exercise

    from exercises
    order by cardinality(rating)
    limit 10
    '''
    ,

    (
    'rating', 'tags', 'latex_dir', 'author',
    'title', 'exercise',
    'latex_title', 'latex_exercise'
    )
)

sql_get_latest = (
    '''
    select
    rating, tags, latex_dir, author,
    title,exercise,
    latex_title, latex_exercise

    from exercises
    order by creationdate desc
    limit 10
    '''
    ,
    
    (
    'rating', 'tags', 'latex_dir', 'author',
    'title', 'exercise',
    'latex_title', 'latex_exercise'
    )
)

sql_get_userId = (
    '''
    select id from auth_user where username = '{userName}'
    '''
    ,
    (
    'userId',    
    )
)

sql_get_exercise = (
    '''
    select

    a.id                ,
    a.author            ,
    to_char(a.creationdate, 'MM/DD/YYYY - HH24:MI'),
    a.rating            ,
    a.tags              ,
    a.latex_dir         ,

    a.title             ,
    a.exercise          ,
    a.answer            ,
    a.hints             ,
    a.explain           ,

    a.latex_title       ,
    a.latex_exercise    ,
    a.latex_answer      ,
    a.latex_hints       ,
    a.latex_explain     ,

    b.username

    from exercises as a
    inner join auth_user as b
    on a.author = b.id
        
    where a.id='{exerciseId}'
    '''
    ,
    (
    'exerciseId'        ,
    'author'            ,
    'creationdate'      ,
    'rating'            ,
    'tags'              ,
    'latex_dir'         ,

    'title'             ,
    'exercise'          ,
    'answer'            ,
    'hints'             ,
    'explain'           ,  

    'latex_title'       ,
    'latex_exercise'    ,
    'latex_answer'      ,
    'latex_hints'       ,
    'latex_explain'     ,

    'username'          ,
    )
)


protocall_fetch_exercise = (
    
    ('exerciseId', int),
    ('author', int),
    ('creationdate', str), 
    ('rating', list),
    ('tags', list),
    ('latex_dir', str), 

    ('title', str),
    ('exercise', str), 
    ('answer', str),
    ('hints', str),
    ('explain', str),

    ('latex_title', dict),
    ('latex_exercise', dict),
    ('latex_answer', dict),
    ('latex_hints', dict),
    ('latex_explain', dict),

    ('username', str),
)

protocall_fetch_home = (
    ('userid', int), 
    ('hotest', list), 
    ('latest', list),
)

protocall_fetch_exercise_page = (
    ('exerciseId', int),
)

sql_post_error = '''
    insert into 
    errors(error, type, stackTrace)
    values({error}, {type}, {stackTrace})
'''

sql_post_exercise =  '''
    
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

sql_post_sendMSG = '''

	insert into messages(
	
	exerciseId, 
	sender, 
	receiver, 
	message
		
	) values (
	
	{exerciseId}, 
	{sender}, 
	{receiver}, 
	{message}
		
	)


'''

# need to set exerciseId, userId
sql_post_like = '''
	
	update exercises 
	set rating = (
		select array(
			select distinct a from unnest(rating) as a
		) from exercises where id = {exerciseId}
	) 
	where id = {exerciseId};
	
	update exercises set rating = 
	case when {userId} = any(rating) 
		then array_remove(rating, {userId})
		else array_append(rating, {userId})
	end
	where id={exerciseId};
	
	update auth_user 
	set liked = array(select distinct a from unnest(liked) as a) 
	where id={userId};

	update auth_user set liked = 
	case when {exerciseId} = any(liked) 
		then array_remove(liked, {exerciseId})
		else array_append(liked, {exerciseId})
	end
	where id={userId};
	
'''
