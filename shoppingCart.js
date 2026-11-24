
//console.log("Testing");

const localHost = "http://localhost:5118";

let shoppingCart = [];
let currentShoppingCart = [];

function addToShoppingCart(product) {

    shoppingCart.push(product);
    console.log(shoppingCart);
}


async function displayCart(btn) {
    console.log("Shopping Cart has been clicked!");
    await sendUserShoppingCart();
  

    window.location.href = 'C:/Users/GeorgievaK/Code/swagstorefrontend/shoppingCart.html';
}

function activeUser() {
    const token = localStorage.getItem('token');
    //console.log(token);
    const tokenObject = JSON.parse(token);
    const currentUsername = tokenObject.userName;
    return currentUsername;
}

async function sendUserShoppingCart() {
   const loggedinUser = activeUser();
   console.log(loggedinUser);

    const request = {
        Name: loggedinUser,
        Items: shoppingCart
    };

    console.log(JSON.stringify(request));

    const response = await fetch ( localHost + '/api/product/shoppingCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if(!response.ok) {
        console.log("Error! Response failed!")
    } else {
        console.log("ShoppingCart sent successfully!");
    }
}

async function getShoppingCart() {
    const loggedinUser = activeUser();
    //console.log(loggedinUser);

    const urlCart = '/api/product/' + loggedinUser;
    const url = localHost + urlCart
    const result = await fetch(url)
    currentShoppingCart = await result.json();
    console.log(currentShoppingCart);
    
    if(!result.ok){
        console.log("Empty dictionary!")
    } else {
    return currentShoppingCart;
    }
}
