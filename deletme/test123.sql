\c exercises

select 

m.message,
a1.username,
a2.username

from messages as m

inner join auth_user as a_sender
on a_sender.id = m.sender
inner join auth_user as a_receiver
on a_receiver.id = m.receiver

where a1.id=1
