create schema sre;

create table "sre".tb_product(
    id serial primary key,
    name varchar(50),
    description text,
    price float,
    quantity integer
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