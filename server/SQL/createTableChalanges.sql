\c exercises

create table	chalanges(
id         		serial			primary key not null     	,
exercise  		varchar(4000) 	not null                 	,
answer    		varchar(4000) 	not null                 	,
hints       	varchar(4000)                           	,
author      	integer		                            	,
creationdate	timestamp 		default current_timestamp	,
title       	varchar(400) 	not null                  	,
rating      	integer[] 		not null default '{}'		,
tags        	integer[]		not null default '{}'		,
explain     	varchar(4000)								,
latex			varchar(30)									,
latexp			varchar(400)
);
