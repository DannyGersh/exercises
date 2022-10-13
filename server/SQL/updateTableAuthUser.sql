\c exercises

alter table auth_user 
	add column authored integer[] default '{}';

alter table auth_user 
	add column liked integer[] default '{}';

alter table auth_user 
	add column answered integer[] default '{}';
