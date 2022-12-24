import os
import pathlib
from django.http import JsonResponse


DIR_USERS = pathlib.Path('/volume/static/users')
reg_latex_search = r'\$\$(.+?)\$\$'
JsonError = JsonResponse({'error': 'an error hase occurred.'}, status=500)
JsonSuccess = JsonResponse({'success': True}, status=200)
ERROR = 'unique error string'

SQL_SIMILARITY_LIMIT = 0.2

latex_targets = (
    'title',
    'exercise',
    'answer',
    'hints',
    'explain',
)

'''
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
'''




sql_get_hotest = (
    '''
    select
    
    id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    latex_title, 
    latex_exercise

    from exercises
    
    where
	not ('private' = any(tags))
    
    order by cardinality(rating) desc
    limit 10
    '''
    ,

    (
    'id', 
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title', 
    'exercise',
    'latex_title', 
    'latex_exercise'
    )
)

sql_get_latest = (
    '''
    select
    
    id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    latex_title, 
    latex_exercise

    from exercises
    
    where
	not ('private' = any(tags))
    
    order by creationdate desc
    limit 10
    '''
    ,
    
    (
    'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title', 
    'exercise',
    'latex_title', 
    'latex_exercise'
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
    to_char(a.creationdate, 'MM/DD/YYYY'),
    a.rating            ,
    a.tags              ,
    a.latex_dir         ,
    a.latex_pkg         ,

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
    'latex_pkg'         ,

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

sql_get_user_name = (
	'''
	
	select username from auth_user where id={userId}
	
	''',
	(
	'uname',
	)
)

sql_get_profile_authored = (
    '''
    select
    
    id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    
    latex_title, 
    latex_exercise

    from exercises
    where {userId}=author
    order by creationdate desc
    limit 10
    '''
    ,

    (
    'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title', 
    'exercise',
    
    'latex_title', 
    'latex_exercise'
    )
)

sql_get_profile_liked = (
    '''
    select
    
    id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    
    latex_title, 
    latex_exercise

    from exercises
    where {userId}=any(rating)
    order by cardinality(rating) desc
    limit 10
    '''
    ,

    (
    'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title', 
    'exercise',
    
    'latex_title', 
    'latex_exercise'
    )
)

sql_get_profile_messages = (
    '''
    select
    
    m.id,
    m.exerciseId,
    m.sender,
    m.receiver,
    to_char(m.creationdate, 'MM/DD/YYYY'),
    m.message,
    a_sender.username,
    a_receiver.username
    
    from messages as m
    
    inner join auth_user as a_sender
	on a_sender.id = m.sender
	inner join auth_user as a_receiver
	on a_receiver.id = m.receiver
    
    where m.receiver='{userId}'
    order by creationdate desc
    '''
    ,

    (
    'msgId',
	'exerciseId',
    'sender',
    'receiver',
    'creationDate',
    'message',
    'name_sender',
    'name_receiver',
    )
)

sql_get_search_by_tag = (
	'''
    select
    
	id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    
    latex_title, 
    latex_exercise

    from exercises 
    where (
		select bool_or(similarity('{searchTerm}', data) > %s) 
		from unnest(tags) as data
	)
	and
	not ('private' = any(tags))

	order by ( 
		select max(similarity('{searchTerm}',data)) 
		from unnest(tags) as data
	) desc
	
    '''%(SQL_SIMILARITY_LIMIT)
    ,

    (
	'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title',
    'exercise',
    
    'latex_title', 
    'latex_exercise',
    )
)

sql_get_search_by_title = (
	'''
    select
    
	id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    
    latex_title, 
    latex_exercise

    from exercises 
    where 
    to_tsvector('english', title)
    @@ to_tsquery('english', '{searchTerm}')
	and
	not ('private' = any(tags))
    '''
    ,

    (
	'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title',
    'exercise',
    
    'latex_title', 
    'latex_exercise',
    )
)

sql_get_search_by_exercise = (
	'''
    select
    
	id,
    rating, 
    tags, 
    latex_dir, 
    author,
    
    title,
    exercise,
    
    latex_title, 
    latex_exercise

    from exercises 
    where 
    to_tsvector('english', exercise)
    @@ to_tsquery('english', '{searchTerm}')
	and
	not ('private' = any(tags))
    '''
    ,

    (
	'id',
    'rating', 
    'tags', 
    'latex_dir', 
    'author',
    
    'title',
    'exercise',
    
    'latex_title', 
    'latex_exercise',
    )
)




sql_post_error = '''
    insert into 
    errors(error, type, stackTrace)
    values({error}, {type}, {stackTrace})
'''

sql_post_exercise =  '''
    
    insert into exercises(
    
    author, 
    tags,      
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
    {tags},
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

sql_post_updateExercise = '''
	
	update exercises set
	
	tags={tags},
	latex_pkg={latex_pkg},
	
    title={title},
    exercise={exercise},
    answer={answer}, 
    hints={hints},
    explain={explain}, 
            
    latex_title={latex_title},     
    latex_exercise={latex_exercise},  
    latex_answer={latex_answer},    
    latex_hints={latex_hints},     
    latex_explain={latex_explain}
    
    where id = {exerciseId}
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

sql_post_delete_msg = '''

	delete 
	from messages
	where id={msgId}

'''

sql_post_delete_exercise = '''

	delete 
	from exercises
	where id={exerciseId}

'''





protocall_fetch_home = {
	'in': {},
	'out': {
		'hotest': list, 
		'latest': list,
	}
}

protocall_fetch_deleteExercise = {
	'in': {
		'exerciseId': int,
	},
	'out': {},
}

protocall_fetch_profile = {
	'in': {
		'userId'	: int
	},
	'out': {
		'uname'		: str,
		'authored'	: list,
		'liked'		: list,
		'messages'	: list,
	},
}

protocall_fetch_search = {
	'in': {
		'searchTerm' : str,
	},
	'out': {
		'searchResult' : list,
	},
}

protocall_fetch_exercisePage = {
	'in': {
		'exerciseId'	: int,
	},
	'out': {
		'exerciseId'	: int,
		'author'		: int,
		'creationdate'	: str, 
		'rating'		: list,
		'tags'			: list,
		'latex_dir'		: str, 
		'latex_pkg'		: str, 
		
		'title'			: str,
		'exercise'		: str, 
		'answer'		: str,
		'hints'			: str,
		'explain'		: str,
		
		'latex_title'	: dict,
		'latex_exercise': dict,
		'latex_answer'	: dict,
		'latex_hints'	: dict,
		'latex_explain'	: dict,
		
		'username'		: str,	
	}
}

protocall_fetch_submit_exercise = {
	'in': {
		'exerciseId': int,
		'userId'	: int,
		'tags'		: list,
		'latex_pkg'	: str,

		'title'		: str,
		'exercise'	: str,
		'answer'	: str,
		'hints'		: str,
		'explain'	: str,		

		'latex_title'	: dict,
		'latex_exercise': dict,
		'latex_answer'	: dict,
		'latex_hints'	: dict,
		'latex_explain'	: dict,
	},
	'out': {},
}

protocall_fetch_update_exercise = {
	'in': {
		'exerciseId': int,
		'userId'	: int,
		'tags'		: list,
		'latex_pkg'	: str,
		'latex_dir'	: str,

		'title'		: str,
		'exercise'	: str,
		'answer'	: str,
		'hints'		: str,
		'explain'	: str,		

		'latex_title'	: dict,
		'latex_exercise': dict,
		'latex_answer'	: dict,
		'latex_hints'	: dict,
		'latex_explain'	: dict,
	},
	'out': {},
}

protocall_fetch_addLatex = {
	'in': {
		'userId'		: int,
		'dir_exercise'	: str,
		'target'		: str,
		'latexId'		: int,
		'latex'			: str,
		'latex_pkg'		: str,
	},
	'out': {},
}

protocall_fetch_deleteLatex = {
	'in': {
		'userId'		: int,
		'target'		: str,
		'latexId'		: int,
		'dir_exercise'	: str,
	},
	'out': {},
}

protocall_fetch_deleteMsg = {
	'in': {
		'msgId': int,
	},
	'out': {},
}

protocall_fetch_register_submit = {
	'in': {
		'isLogin'	: bool,
		'uname'		: str,
		'password'	: str,
	},
	'out': {
		'userId'	: int,
	},
}

protocall_fetch_sendMsg = {
	'in': {
		'exerciseId': int,
		'sender':     int,
		'receiver':   int,
		'message':    str,
	},
	'out': {},
}

protocall_fetch_initialEdit = {
	'in': {
		'latex_dir': str,
		'author': int,
	},
	'out': {},
}

str_error_protocallNEQdata = '''
len(protocall) != len(data)
protocall:
%s
data:
%s
'''




