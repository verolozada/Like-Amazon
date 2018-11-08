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
    showTable();
})

const showTable = () => {
    connection.query(
        'SELECT * FROM products', ((err, res) => {
            for (let i = 0; i < res.length; i++) {
                console.log(`ID: ${res[i].item_id} || Product Name: ${res[i].product_name} || Price: ${res[i].price}`)
            }
            console.log('');
            askItem();
        })
    )
}

const askItem = () => {
    inquirer.prompt([
        {
            name: 'item',
            type: 'input',
            message: 'Please type the item number of the product you would like to buy'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many units of the product would you like to buy?'
        }
    ]).then((answer) => {
        const query1 = 'SELECT product_name, price, stock_quantity FROM products WHERE ?'
        const query2 = 'UPDATE products SET ? WHERE ? '
        const idNumber = parseInt(answer.item); //id number of the user want to buy
        const idQuantity = parseInt(answer.quantity); //quantity the user wants to buy
        connection.query(query1,
            {
                item_id: idNumber
            },
            (err, res) => {
                const quantity = res[0].stock_quantity;
                const price = parseFloat(res[0].price);
                if (err) throw err;
                if (idQuantity > quantity) {
                    console.log('Insufficient quantity!');
                    askItem();
                } else {
                    const newStock = quantity - idQuantity;
                    connection.query(query2,
                        [{
                            stock_quantity: newStock
                        },
                        {
                            item_id: idNumber
                        }],
                        (err, res)=>{
                            if (err) throw err;
                            console.log(`${res.affectedRows} item updated! \n`)
                            const bill = price * idQuantity;
                            console.log(` Total: $${bill}`);
                        }
                    )
                }
            }
        )
    })
}

