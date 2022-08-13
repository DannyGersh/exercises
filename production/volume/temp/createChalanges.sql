\c exercises

create table	chalanges(
id         		serial			primary key not null     	,
question  		varchar(4000) 	not null                 	,
answer    		varchar(4000) 	not null                 	,
hints       	varchar(4000)                           	,
author      	varchar(100)                            	,
creationdate	timestamp 		default current_timestamp	,
title       	varchar(400) 	not null                 	,
rating      	integer[] 		not null default '{}'		,
tags        	varchar(100)[]	not null default '{}'		,
explain     	varchar(4000)
);
