CREATE TABLE clarocity.realties (
	id int(10) NOT NULL auto_increment,
	address varchar(255),
	city varchar(255),
	state varchar(2),
	zip varchar(6),
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE clarocity.sales (
	id int(10) NOT NULL auto_increment,
	date timestamp,
	price int(10),
	realty_id int(10),
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
