CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
product_name VARCHAR
    (50) NOT NULL,
department_name VARCHAR
    (50) NOT NULL,
price DECIMAL
    (10,2) default 0,
stock_quantity INT default 0,
PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ('Vest', 'Clothing', 12, 2),
        ('iPhone 6', 'Technology', 450.89, 3),
        ('Black Running Nike Shoes', 'Clothing', 170.50, 10),
        ('Wine Glasses','Home',21,12),
        ('Blue Coach', 'Home', 284.55,2),
        ('MacBook Pro', 'Technology', 1235.99,2),
        ('White and Pink Purse','Clothing',23.35,4),
        ('Every Breathe','Books', 17.85,34),
        ('White Nightstand','Home', 56.90,7),
        ('Android Charger', 'Technology', 14.99,7);

