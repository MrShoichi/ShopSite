
insert into roles (id, name) values(1, 'admin'),
(2, 'user');

insert into users (id, enabled, name, email, password, role_id) values
(1, true, 'test',	'admin@mail.ru',	'$2y$10$OKb7kzsaYkof4.QlBPa3z.X2Eb5vCmKh3..wlJkWkIFzCLxpM.20i',	1),
(2, true, 'user',	'user@mail.ru',	'$2y$10$aJjwQl2r42807ikXWTQ5d.NJu7AhyCx3xOa23hS97f6rjXlTGYOsG',	2);
