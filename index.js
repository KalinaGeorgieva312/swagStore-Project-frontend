

const cars = [{ make : "BMV" , ps : 500, name : "auto1"}, { make : "BMV" , ps : 400, name : "auto2"},{ make : "Merceded" , ps : 100, name : "auto3"}]


//C# Select => JS map
//C#
// const makes = cars.Select(x => x.make);
const makes = cars.map(x => x.make);

//C# Where => JS filter
//C#
// const onlyBMV = cars.Where(x => x.make == "BMV");
const onlyBMV = cars.filter(x => x.make == "BMV");

const dict = {};


makes.forEach(x => {
	
	const carsOfMake = cars.filter(y => y.make == x)
    dict[x] = carsOfMake;
})


console.log(dict)


// dict["BMV"] = [{ make : "BMV" , ps : 500, name : "auto1"}, { make : "BMV" , ps : 400, name : "auto2"}];
// dict["Merceded"] = [{ make : "Merceded" , ps : 100, name : "auto3"}];


// console.log(dict);


// ###########################################


//SETUP
let checkmarked = ["Seven", "Prime"];

// Page reload
//# 1: On page reload only Seven and Prime should be selected
//# 2: In drawProducts() only draw those within checkmarked


// Checkbox hit
//#3 on click use also the drawProducts method => dont use method filterBrand anymore

const urlLocalHost = "http://localhost:5118";
let products = [];
let items = [];

let groupedProducts = {};
let groupBrand = [];
let brands = {};

drawProducts();

showCurrentTime();
setInterval(showCurrentTime, 1000);

stayLoggedIn();
setInterval(() => localStorage.clear(), 3600000);

const inputUsername = document.getElementById('username').value;
const inputPassword = document.getElementById('password').value;

const buttonPress = document.getElementById("loginButton");

buttonPress.addEventListener("click", function () { buttonClick(inputUsername, inputPassword); })

logOut();

async function loadAllProducts(){
	
	const url = urlLocalHost + "/api/product/GetAll"
	
	const result = await fetch(url)
	
	products = await result.json();

	const items = await displayBrands();
	
	groupedProducts = groupProducts(items);
	
	drawProducts();

	const div = document.getElementById("product-container");
	
	div.style.fontFamily = "verdana";
	div.style.color = "darkblue";
	div.style.fontSize = "130%";
	
	
	// for( let i = 0; i < products.length; i++){
		
		// const product = products[i];
		// const li = document.createElement("li");
		// li.style.color = 'red';
		// li.textContent = "Index: " + product.index + ", Brand: " + product.brand + ", Price: " + product.priceEuro + ", Type: " + product.type + ", Color: " + product.color;
		// div.appendChild(li);	
	// }
	
	/*products.forEach(product => {
		
		const li = document.createElement("li");
		li.style.color =  product.color;
		li.textContent = "Index: " + product.index + ", Brand: " + product.brand + ", Price: " + product.priceEuro + "€" + ", Type: " + product.type + ", Color: " + product.color;
		div.appendChild(li);
		headerProductNum();
		
	});*/
	
	//TODO => ZEIGE ALLE PRODULTE MIT PREIS, NAME in einer LISTE AN
}



function groupProducts(items){
	
	const brands = items.map(p => p.brand); //just the brands of each product as strings, not objects!
	
	const dictionary = {}; //empty dictionary

	brands.forEach(b => {
	
		const productsByBrand = items.filter(p => p.brand == b) //products grouped together by brand
		
		dictionary[b] = productsByBrand;
	})
	return dictionary;
}

function drawProducts(){
	const div = document.getElementById("product-container");
	div.innerHTML = ""
	const input = document.getElementById("priceFilter");
	const filteredString = input.value;
	const filteredNumber = parseFloat(filteredString);

	Object.entries(groupedProducts).forEach(([key, value]) => {
		const html = document.createElement("div");
		html.textContent = key + ":";
		html.style.fontWeight = 'bold';
		html.style.marginTop = '20px';
		const html1 = document.createElement("div");

		if(checkmarked.includes(key)) {
		value.forEach(v => {
			if(filteredNumber >= v.priceEuro || isNaN(filteredNumber)){
				const li = document.createElement("li");
				li.style.color =  v.color;
				li.class = v.type + v.color;
				li.dataset.index = v.index;
				li.textContent = "Index: " + v.index + ", Brand: " + v.brand + ", Price: " + v.priceEuro + "€, Type: " + v.type + ", Color: " + v.color;
				
				images(li);
				addBasketButton(li, v);
				
				html1.appendChild(li);
			}
			//console.log(li);
		});
		div.appendChild(html);
		div.appendChild(html1);
	}
	});	
	headerProductNum();
}



function inputLogin() {
	const input = document.createElement("input");
	input.textContent = "Username";
	input.setAttribute('type', "text");
	input.setAttribute('name', "username");
	
	const input2 = document.createElement("input");
	input2.setAttribute('type', "password");
	input2.setAttribute('name', "password");
	
	const press = document.querySelector('button');
	press.setAttribute('type', "submit");
}

async function buttonClick(inputUsername, inputPassword) {	
		inputUsername = document.getElementById('username').value;
		inputPassword = document.getElementById('password').value;
		const buttonLogout = document.getElementById("logoutBtn");
		buttonLogout.style.display = 'none';
		
		const response = await fetch (urlLocalHost + "/api/user/login", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username: inputUsername, password: inputPassword})
		});
		
		if(!response.ok) {
			buttonLogout.style.display = 'none';
			alert ("Falsche Anmeldedaten!");
		} else {
			alert ("Willkommen, " + inputUsername);
			const currentUser = await response.json();
			const adminProperty = JSON.parse(currentUser.isAdmin);
			if(adminProperty === true){
				const adminButton = document.getElementById('admin');
				adminButton.style.display = 'block';
			}
			console.log(JSON.stringify(currentUser));
			const astring = JSON.stringify(currentUser);
			localStorage.setItem("token", astring);
			const stringToken = localStorage.getItem("token");
			console.log(JSON.parse(stringToken));
			//sendCurrentUser();
			headerFilter.style.display = 'block';
			const uName = document.getElementsByClassName("group1");
			for(let i=0; i < uName.length; i++) {
			uName[i].style.display = 'none';
			}
			const pwd = document.getElementsByClassName("group2");
			for(let i=0; i < pwd.length; i++) {
			pwd[i].style.display = 'none';
			}
			const logB = document.getElementById("loginButton");
			logB.style.display = 'none';
			//getBrands();
			loadAllProducts();
			getTypes();
			//loadAllProducts().then(getBrands()).then(getTypes())
			inputUsername = document.getElementById('password').value = '';
			const filterGroup = document.getElementsByClassName("filterByPrice");
			for (let i = 0; i < filterGroup.length; i++) {
			filterGroup[i].style.display = 'flex';
			}
			filterInput();
			const cartElements = document.getElementsByClassName("Cart");
			for(let i = 0; i < cartElements.length; i++) {
				cartElements[i].style.display = 'flex';
			}
			const buttonLogout = document.getElementById("logoutBtn");
			buttonLogout.style.display = 'block';
		}
}

function stayLoggedIn() {
	const currentUser = localStorage.getItem("token");
	
	if(currentUser == null) {
		alert("Bitte melden Sie sich an.");
		const header3 = document.getElementById("headerFilter");
		header3.innerHTML = '';
		const cartElements = document.getElementsByClassName("Cart");
			for(let i = 0; i < cartElements.length; i++) {
				cartElements[i].style.display = 'none';
			}
		const buttonLogout = document.getElementById("logoutBtn");
		buttonLogout.style.display = 'none';
	}
	else {
		const stringToken = localStorage.getItem("token");
			const currentUser = JSON.parse(stringToken);
			const adminProperty = JSON.parse(currentUser.isAdmin);
			if(adminProperty === true){
				const adminButton = document.getElementById('admin');
				adminButton.style.display = 'block';
			}
		const uName = document.getElementsByClassName("group1");
		for(let i=0; i < uName.length; i++) {
			uName[i].style.display = 'none';
		}
		const pwd = document.getElementsByClassName("group2");
		for(let i=0; i < pwd.length; i++) {
			pwd[i].style.display = 'none';
		}
		const logB = document.getElementById("loginButton");
		logB.style.display = 'none';
		loadAllProducts();
		getTypes();
		//loadAllProducts().then(getBrands()).then(getTypes())
		const filterGroup = document.getElementsByClassName("filterByPrice");
		for (let i = 0; i < filterGroup.length; i++) {
			filterGroup[i].style.display = 'flex';
		}
		filterInput()
		const cartElements = document.getElementsByClassName("Cart");
			for(let i = 0; i < cartElements.length; i++) {
				cartElements[i].style.display = 'flex';
			}
		const buttonLogout = document.getElementById("logoutBtn");
		buttonLogout.style.display = '';
	}
}

function logOut(btn) {
	
	const div = document.getElementById("product-container");
	div.innerHTML = '';
	const header2 = document.getElementById("header-small");
	header2.innerHTML = '';
	if(btn){
		btn.style.display = "none"; //removing breaks the logged in state when reloading
		const header3 = document.getElementById("headerFilter");
		header3.innerHTML = '';
		const brandCh = document.getElementById("brandContainer");
		brandCh.innerHTML = '';
		const typeCh = document.getElementById("typeContainer");
		typeCh.innerHTML = '';
		const filterGroup = document.getElementsByClassName("filterByPrice");
		for (let i = 0; i < filterGroup.length; i++) {
			filterGroup[i].style.display = 'none';
		}
		localStorage.removeItem("token");
		const uName = document.getElementsByClassName("group1");
		for(let i=0; i < uName.length; i++) {
			uName[i].style.display = 'flex';
		}
		const pwd = document.getElementsByClassName("group2");
		for(let i=0; i < pwd.length; i++) {
			pwd[i].style.display = 'flex';
		}
		const logB = document.getElementById("loginButton");
		logB.style.display = 'block';
		logB.style.textAlign = 'center';
		const cartElements = document.getElementsByClassName("Cart");
			for(let i = 0; i < cartElements.length; i++) {
				cartElements[i].style.display = 'none';
			}
		const adminButton = document.getElementById('admin');
		adminButton.style.display = 'none';
	}
}

function showCurrentTime() {
	const now = new Date();
	const dateString = now.toLocaleString();
	document.getElementById("datetime").textContent = "Datum & Uhrzeit: " + dateString;
}

async function getBrands() {
	
	const urlBrands = urlLocalHost + "/api/product/GetByBrand"
	
	const resultBrand = await fetch(urlBrands)
	
	const allBrands = await resultBrand.json();
	const groupBrand = allBrands.slice(0, -5);
	const brandNames = groupBrand.map(x=>x.brand);

	brands = checkboxesBrand(brandNames);
	return groupBrand;
}

async function displayBrands() {
	const brandArray = await getBrands();

	const updateMap = new Map(brandArray.map(u => [u.id, u.brand]));

	const result = products.map(item => ({
  	...item,
  	brand: updateMap.get(item.brand) ?? item.brand
	}));
	console.log(result);
	return result;
}

function checkboxesBrand(groupBrand) {
	const container = document.getElementById('brandContainer');
	console.log(groupBrand);
	
	groupBrand.forEach(eachbrand => {
		const label = document.createElement('label');
		const checkboxBrands = document.createElement('input');
		
		checkboxBrands.type = 'checkbox';
		checkboxBrands.name = 'brand';
		checkboxBrands.id = eachbrand;
		const allCheckboxes = document.querySelectorAll('input[name="brand"]');
		allCheckboxes.forEach(checkbox => {
			if(checkmarked.includes(checkbox.value)) {
				checkbox.checked = true;
			}
		})
		checkboxBrands.value = eachbrand; 
		
		checkboxBrands.addEventListener("click", () => {
			
			
			if(checkboxBrands.checked) {

				checkmarked = [...checkmarked, eachbrand];

			} else {
				
				//Hier weißt du welche brand unchekd ist
				const index = checkmarked.indexOf(eachbrand);
				checkmarked.splice(index, 1);
			}
			
			drawProducts();

			headerProductNum();
			
			
		});
		
		label.textContent = " " + eachbrand;
		label.appendChild(checkboxBrands);
		
		container.appendChild(label);
	});
}


function logDebug(e){
	
	console.log(e)
}

async function getTypes() {
	
	const urlTypes = "http://localhost:5118/api/product/GetByType"
	
	const resultType = await fetch(urlTypes)
	
	const groupType = await resultType.json();
	
	const container2 = document.getElementById('typeContainer');
	
	groupType.forEach(type => {
		const label2 = document.createElement('label2');
		const checkboxTypes = document.createElement('input');
		
		checkboxTypes.type = 'checkbox';
		checkboxTypes.name = 'type';
		//checkboxTypes.value = ''; //do a filter function (get products list and filter it)
		
		label2.textContent = " " + type;
		label2.appendChild(checkboxTypes);
		
		container2.appendChild(label2);
	});
}

function headerProductNum() {
	const div = document.getElementById("product-container");
	const lengthProducts = div.querySelectorAll("li").length;

	const header = document.getElementById("header-small");
	header.textContent = "Hier sind unsere " + lengthProducts + " Produkte:";
	headerFilter.textContent = "Filtern nach Brand oder Type:"
	headerFilter.style.display = 'block';
	
	if(lengthProducts === 0) {
		header.textContent = "Hier sind unsere " + "Produkte:";
	}
}

function images(parentElement) {
	
	var allImages = document.createElement('img');
			allImages.src = "";
			allImages.alt = "";
			if (parentElement.class === "Jackebrown") {
				allImages.src = "images\\brownjacket.jpg";
				allImages.alt = "brown jacket";
			}
			if (parentElement.class === "Jeansblue") {
				allImages.src = "images\\bluejeans.jpg";
				allImages.alt = "blue jeans";
			}
			if (parentElement.class === "T-Shirtred") {
				allImages.src = "images\\redtshirt.jpg";
				allImages.alt = "red tshirt";
			}
			if (parentElement.class === "Coatblack") {
				allImages.src = "images\\blackcoat.jpg";
				allImages.alt = "black coat";
			}
			if (parentElement.class === "Dresspurple") {
				allImages.src = "images\\purpledress.jpg";
				allImages.alt = "purple dress";
			}
			if(allImages.src != null) {
				parentElement.appendChild(allImages);
			}
				allImages.style.width = "300px";
				allImages.style.height = "auto";
				allImages.style.display = 'block';
				allImages.style.margin = '0 auto';
}

function filterInput() {
	const filter = document.getElementById("priceFilter");
	filter.addEventListener('input', function(e) {
			this.value = this.value.replace(/[^0-9.]/g, '');
			const toFloat = this.value.split('.');
			if(toFloat.length > 2) {
				this.value = parts[0] + '.' + parts.slice(1).join('');
			}
	});
}


function addBasketButton(parentElement, product){

	const addButton = document.createElement("button");
	const imgs = document.createElement('img');
		imgs.src = "images\\shoppingCart.jpg"
		imgs.style.width = "20px";
		imgs.style.height = "auto";
		addButton.appendChild(imgs);

		addButton.style.width = "50px";
		addButton.style.padding = "6px 12px";
  		addButton.style.marginRight = "8px";      
  		addButton.style.verticalAlign = "middle";
		addButton.style.borderRadius = "4px";
		addButton.style.border = "1px solid black";

	addButton.addEventListener("click", () => {

		//Call function in Shopping Cart js to add the prdoct
		
		addToShoppingCart(product);

	});

	parentElement.appendChild(addButton);
	//ADD to parentElement

	//console.log(parentElement, product)
}
