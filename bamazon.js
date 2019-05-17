
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var userInput = process.argv.slice(3).join(" ");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3307,

  // Your username
  user: "root",

  // Your password
  password: "docker",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runManage();
  });

  function runManage() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "exit"
        ]
      })
  
       .then(function(answer) {
         switch (answer.action) {
         case "View Products for Sale":
           viewProducts();
           break;
  
         case "View Low Inventory":
           lowInventory();
           break;
  
         case "Add to Inventory":
           addInventory();
           break;
  
         case "Add New Product":
           addProducts();
           break;
            
         case "exit":
           connection.end();
           break;
         }
       });
      

      var lowInventory = function () {
    
        console.log(" ")
        console.log(chalk.blue.bold("Here is a list of low inventory items"))
        console.log(" ")
    
        connection.query("SELECT * FROM products", function(err, res) {
          if (err) throw err;
           
            for(var i = 0; i < res.length; i++){
            if(res[i].stock_quantity <= 5)
              console.log(chalk.blue.bold("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " |  " + "Price: " + res[i].price + '$' + " | " + "QTY: " + res[i].stock_quantity));
            console.log('--------------------------------------------------------------------------------------------------')
            }
             connection.end();
     });
        
    }
  
   var viewProducts = function () {
    
       console.log(" ")
       console.log(chalk.magenta.bold("Here is a sale list!"))
       console.log(" ")
     
    connection.query("SELECT * FROM products", function(err, res) {
       if (err) throw err;
       
        for(var i = 0; i < res.length; i++){
        
        console.log('---------------------------------------------------------------------------')
        console.log(" ")
        console.log(chalk.yellow.bold("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " |  " + "Price: " + res[i].price + '$' + " | " + "QTY: " + res[i].stock_quantity));
        console.log(" ")
        
      }

       connection.end();
  })

   
      }
    }

   var addProducts = function() {
    inquirer.prompt([
      {
        message: "Enter new item id : ",
        type: "input",
        name: "product_idNew"
      },
      {
     message: "Enter name of product please : ",
     type: "input",
     name: "product_nameNew"
   },
   {
    message: "Enter price : ",
    type: "input",
    name: "priceNew"
   },
   {
    message: "Enter amout : ",
    type: "input",
    name: "stock_quantityNew"
   }
]).then(function (input) {
  connection.query("INSERT INTO products SET ?",
      {
          item_id: input.item_idNew,
          product_name: input.product_nameNew,
          price: input.priceNew,
          stock_quantity: input.stock_quantityNew
      },
      function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " has been added to the product list");
          console.log('\n*******************');
          connection.end();
      })

});
};