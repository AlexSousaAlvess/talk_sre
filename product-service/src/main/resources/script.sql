create schema sre;

create table "sre".tb_product(
    id serial primary key,
    name varchar(50),
    description text,
    price float
);

select * from sre.tb_product;