const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_DB'
})

connection.connect((err) => {
    if (err) throw err;
    options();
})

const options = () => {
    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: 'Select an option',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ).then((answer) => {
        const option = answer.option;
        switch (option) {
            case 'View Products for Sale':
                viewSale();
                break;
            case 'View Low Inventory':
                viewInv();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                addItem();
                break;
        }
    })
}

const viewSale = () => {
    connection.query(
        'SELECT * FROM products', ((err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                console.log(`ID: ${res[i].item_id} || Product Name: ${res[i].product_name} || Price: ${res[i].price} || Quantities: ${res[i].stock_quantity} `)
            }
            options();
        })
    )
}

const viewInv = () => {
    const itemsArr = [];
    const query1 = 'SELECT * FROM products';
    const query2 = 'SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?'
    let id;
    connection.query(
        query1, (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    itemsArr.push(res[i].item_id)
                }
            }
            for (let j = 0; j < itemsArr.length; j++) {
                id = itemsArr[j]
                connection.query(query2,
                    {
                        item_id: id
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`ID: ${res[0].item_id} || Product: ${res[0].product_name} || Department: ${res[0].department_name} || Price: ${res[0].price} || Quantities: ${res[0].stock_quantity}`)
                    })
            }
            //  options();
        }
    )
}

const addInv = () => {
    // viewSale();
    inquirer.prompt(
        [{
            name: 'item',
            type: 'input',
            message: 'What item would you like to modify?'
        },
        {
            name: 'number',
            type: 'input',
            message: 'Quantity you would like to add: '
        }]
    ).then((answer) => {
        const query1 = 'SELECT product_name, price, stock_quantity FROM products WHERE ?'
        const query2 = 'UPDATE products SET ? WHERE ? '
        const idNumber = parseInt(answer.item); //id to modify
        const idQuantity = parseInt(answer.number); //quantity to modify
        connection.query(query1,
            {
                item_id: idNumber
            },
            (err, res) => {
                if (err) throw err;
                const stock = parseInt(res[0].stock_quantity);
                const newStock = stock + idQuantity;
                connection.query(query2,
                    [
                        {
                            stock_quantity: newStock
                        },
                        {
                            item_id: idNumber
                        }
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('\n Updated! \n');
                        options();
                    }
                )
            }
        )
    })
}

const addItem = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Product name: '
        },
        {
            name: 'department',
            type: 'input',
            message: 'Category: '
        },
        {
            name: 'price',
            type: 'input',
            message: 'Price: '
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'Quantity: '
        }
    ]).then((answer) => {
        const query1 = 'INSERT INTO products SET ?'
        connection.query(query1,
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            (err) => {
                if (err) throw err;
                console.log(` \n ${answer.name} added \n`);
                options();
            }
        )
    })
}

