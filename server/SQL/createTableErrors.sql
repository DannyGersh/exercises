\c exercises

create table errors(
id			serial 		primary key not null,
type		varchar		,	
error		varchar 	not null,
stackTrace 	varchar		,
date		timestamp	default current_timestamp
);