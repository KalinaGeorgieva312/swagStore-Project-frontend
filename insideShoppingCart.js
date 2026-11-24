let userShoppingCart = [];

loadShoppingCart();
BalanceInfo();

async function loadShoppingCart(){
	userShoppingCart = await getShoppingCart();

    const cartContainer = document.getElementById("shoppingCartContainer");
    cartContainer.style.fontSize = "130%";
    cartContainer.style.fontFamily = "verdana";

		const cartHtml = document.createElement("div");
		//cartHtml.textContent = "Hallo, " + key;
		cartHtml.style.fontWeight = 'bold';
		cartHtml.style.marginTop = '20px';
        cartHtml.style.marginBottom = '20px';

		userShoppingCart.forEach(i => {
				const li = document.createElement("li");
				li.style.color =  'darkblue';
                li.style.marginBottom = '10px';
				li.textContent = "Index: " + i.index + ", Brand: " + i.brand + ", Type: " + i.type + ", Color: " + i.color + ", Price: " + i.priceEuro + "€";
				
				cartHtml.appendChild(li);
		})
        cartContainer.appendChild(cartHtml);
	
    countItems();
	await displayPrice();
}

function countItems() {
const cartContainer = document.getElementById('shoppingCartContainer');
const lengthElements = cartContainer.querySelectorAll("li").length;
const summary = document.getElementsByClassName('box');
const overviewHeader = document.getElementById('overview');
const loggedinUser = activeUser();
overviewHeader.textContent = "Zusammenfassung";

const discount = document.getElementById('discount');
discount.textContent = "10% Rabatt";

const mainHeader = document.getElementById('header');
mainHeader.textContent = "Warenkorb für " + loggedinUser;
const count = document.getElementById("count");
count.textContent = lengthElements + " Artikel";
	
	if(lengthElements === 0) {
		count.textContent = "";
	} else {
		for(var i = 0; i < summary.length; i++) {
		summary[i].style.display = 'flex';
		}
		discount.style.display = 'none';
		if(lengthElements > 3) {
			discount.style.display = 'flex';
		}
	}
}

async function totalPrice() {
	const loggedinUser = activeUser();
    //console.log(loggedinUser);

	const urlCart = '/api/product/price' + loggedinUser;	
	const url = localHost + urlCart;
	const result = await fetch(url)
	const price = await result.json();
	//console.log(price);

	if(!result.ok){
		console.log("Didn't get price")
	} else {
		return price;
	}
}

async function displayPrice() {
	const price = await totalPrice();
	const headerPrice = document.getElementById('sum');
	headerPrice.textContent = "Gesamtpreis: " + price + "€";
}

async function payment(btn) {
	const token = localStorage.getItem('token');
	const currentUser = JSON.parse(token);
	const currentUsername = activeUser();
	let updatedBalance = 0;

	const urlCart = '/api/product/payment' + currentUsername;	
	const url = localHost + urlCart;
	const result = await fetch(url)
	updatedBalance = await result.json();

	if(!result.ok){
		console.log("Didn't get updated balance.")
	} else {
		console.log(updatedBalance);
		currentUser.balance = updatedBalance;
		console.log(currentUser.balance);
		console.log(currentUser);
		localStorage.removeItem('token');
		localStorage.setItem('token', JSON.stringify(currentUser));
		const cartContainer = document.getElementById('shoppingCartContainer');
		cartContainer.style.display = 'none';
		const count = document.getElementById("count");
		count.style.display = 'none';
		const summary = document.getElementsByClassName('box');
		for(var i = 0; i < summary.length; i++) {
		summary[i].style.display = 'none';
		}
		alert ("Kauf erfolgreich!");
		BalanceInfo();
	}
}

function BalanceInfo() {
	const token = localStorage.getItem('token');
    const tokenObject = JSON.parse(token);
    const userBalance = tokenObject.balance;

	const currentBalance = document.getElementById('balance');
	currentBalance.textContent = "Kontostand: " + userBalance + "€";
}
