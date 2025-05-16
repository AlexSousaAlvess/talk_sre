create schema sre;

create table "sre".tb_product(
                                 id serial primary key,
                                 name varchar(50),
                                 description text,
                                 price float,
                                 quantity integer
);

create table sre.tb_purchase(
                                id serial primary key,
                                purchase float
);

create table "sre".tb_user(
                              id serial primary key,
                              name varchar(50),
                              email varchar(50),
                              password varchar(50),
                              role varchar(50)
);

select * from sre.tb_product;

select * from sre.tb_user;

select * from sre.tb_purchase;

select * from sre.tb_notification;

UPDATE sre.tb_user SET role = 'OPERATOR' WHERE role = '1';
UPDATE sre.tb_user SET role = 'CUSTOMER' WHERE role = '0';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tb_user' AND table_schema = 'sre';