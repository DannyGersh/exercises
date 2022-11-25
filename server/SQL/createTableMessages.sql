\c exercises

create table messages(
id         		serial			primary key not null		,
exerciseId  	serial 			not null 					,
sender  		serial 			not null 					,
receiver    	serial 			not null 					,
creationDate	timestamp 		default current_timestamp	,
message       	varchar(4000)	not null
);

