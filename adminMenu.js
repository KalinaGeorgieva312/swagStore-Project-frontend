const urlLocalHost = "http://localhost:5118";
let products = [];

hidden();
displayText();
loadAllProducts();

const inputID = document.getElementById('idInput').value;
const inputPrice = document.getElementById('priceInput').value;

const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", function () { submitNewPrice(inputID, inputPrice); })

const priceProduct = document.getElementById("priceInput");
numberInputs(priceProduct);
const productId = document.getElementById("idInput");
numberInputs(productId);
const idForInput = document.getElementById('inputForId');
numberInputs(idForInput);
const colorInput = document.getElementById('colorInput');
stringInputs(colorInput);
const idProduct = document.getElementById('inputid');
numberInputs(idProduct);
const brandInput = document.getElementById('brandInput')
stringInputs(brandInput);
const newBrand = document.getElementById('newBrand');
stringInputs(newBrand);
const newPrice = document.getElementById('newPrice');
numberInputs(newPrice);
const newType = document.getElementById('newType');
stringInputs(newType);
const newColor = document.getElementById('newColor');
stringInputs(newColor);

function displayText() {
//const token = localStorage.getItem('token');
//const tokenObject = JSON.parse(token);
//const currentUsername = tokenObject.userName;
const bigHeader = document.getElementById('adminHeader');
bigHeader.textContent = "Willkommen zum Admin Menu"; //+ currentUsername;
}

function numberInputs(domElement) {
    domElement.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9.]/g, '');
    });
}

function stringInputs(domElement) {
    domElement.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
    });
}

async function submitNewPrice(inputId, inputPrice) {
    inputId = document.getElementById('idInput').value;
    inputPrice = document.getElementById('priceInput').value;

    const response = await fetch (urlLocalHost + "/api/admin/changePrice", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({Index: inputId, PriceEuro: inputPrice})
		});
    
        if(!response.ok){
            console.log("Couldnt submit results.")
            alert("Ungültige Anfrage, bitte versuchen Sie es nochmal.");
        } else {
            console.log("Submitted successfully!");
            const valueID = document.getElementById('idInput').value;
            propertyOverwrite(valueID);
            alert("Änderung erfolgreich! Der Produkt mit ID " + inputId + " hat der neuen Preis " + inputPrice + "€");
            inputPrice = document.getElementById('priceInput').value = "";
        }
}

async function submitNewColor(btn) {
    const idForInput = document.getElementById('inputForId').value;
    const colorInput = document.getElementById('colorInput').value;

    const response = await fetch (urlLocalHost + "/api/admin/changeColor", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({Index: idForInput, Color: colorInput})
    });

    if(!response.ok) {
        console.log("Submission failed.");
        alert("Ungültige Anfrage, bitte versuchen Sie es nochmal.");
    } else {
        console.log("Sent successfully");
        const valueID = document.getElementById('inputForId').value;
        propertyOverwrite(valueID);
        alert("Änderung erfolgreich! Der Produkt mit ID " + idForInput + " hat die neue Farbe " + colorInput);
        colorInput = document.getElementById('colorInput').value = "";
    }
}

async function submitNewBrand(btn){
    const idProduct = document.getElementById('inputid').value;
    const brandInput = document.getElementById('brandInput').value;

    const response = await fetch (urlLocalHost + "/api/admin/changeBrand", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({Index: idProduct, Brand: brandInput})
    });

    if(!response.ok) {
        console.log("Didn't send.");
        alert("Ungültige Anfrage, bitte versuchen Sie es nochmal.");
    } else {
        console.log("Sent.");
        const valueID = document.getElementById('inputid').value;
        propertyOverwrite(valueID);
        alert("Änderung erfolgreich! Der Produkt mit ID " + idProduct + " hat der neuen Brand " + brandInput);
        brandInput = document.getElementById('brandInput').value = "";
    }
}

async function loadAllProducts() {
    const url = urlLocalHost + "/api/product/GetAll"
	
	const result = await fetch(url)
	
	products = await result.json();

    await loadAllBrands();
    await displayBrands();
    await drawProducts();
}

async function loadAllBrands() {
    const urlBrands = urlLocalHost + "/api/product/GetByBrand"
	
	const resultBrand = await fetch(urlBrands)
	
	const allBrands = await resultBrand.json();
	const groupBrand = allBrands.slice(0, -5);
	const brandNames = groupBrand.map(x=>x.brand);
    return groupBrand;
}

async function displayBrands() {
	const brandArray = await loadAllBrands();

	const updateMap = new Map(brandArray.map(u => [u.id, u.brand]));

	const result = products.map(item => ({
  	...item,
  	brand: updateMap.get(item.brand) ?? item.brand
	}));
	return result;
}

async function drawProducts() {
    const div = document.getElementById("product-container");

    let allProducts = [];
    allProducts = await displayBrands();
    Array.from(allProducts).forEach(p => {
        const li = document.createElement("li");
                li.id = p.index;
				li.class = p.index;
                console.log(li.class);
				li.dataset.index = p.index;
                //console.log(li.dataset.index);
				li.textContent = "Index: " + p.index + ", Brand: " + p.brand + ", Price: " + p.priceEuro + "€, Type: " + p.type + ", Color: " + p.color;
                div.appendChild(li);
                addProductButtons(li);
    });
}

function addProductButtons(parentElement){

	const addButton = document.createElement("button");
	const imgs = document.createElement('img');
		imgs.src = "images//buttons.jpg";
		imgs.style.width = "20px";
		imgs.style.height = "auto";
		addButton.appendChild(imgs);

		addButton.style.width = "50px";
		addButton.style.padding = "6px 12px";
  		addButton.style.marginLeft = "8px";      
	
        addButton.style.cursor = "pointer";
        addButton.style.backgroundColor = "mintcream";
        addButton.style.marginTop = "10px";
        addButton.style.marginBottom = "10px";

    const productId1 = document.getElementById('idInput');
    const productId2 = document.getElementById('inputForId');
    const productId3 = document.getElementById('inputid');

	addButton.addEventListener("click", () => {
        productId1.value = parentElement.class;
        productId2.value = parentElement.class;
        productId3.value = parentElement.class;
	});

	parentElement.appendChild(addButton);
}

function propertyOverwrite(valueID){
    const targetLi = document.getElementById(valueID);
    const liText = targetLi.textContent;
    let result = "";

    const inputPrice = document.getElementById('priceInput').value;
    const inputColor = document.getElementById('colorInput').value;
    const inputBrand = document.getElementById('brandInput').value;
    console.log(inputPrice);
    console.log(inputColor);
    console.log(inputBrand);

    if(inputPrice != "") {
        result = liText.replace(/(Price:)(.+?)(?=€)/, "Price: " + inputPrice);
        console.log("Price " + result);
    }

    else if(inputColor != ""){
        result = targetLi.textContent.split('Color:')[0];
        result += "Color: " + inputColor;
        console.log("Color " + result);
    }

    else if(inputBrand != "") {
        result = liText.replace(/(Brand:)(.+?)(?=Price)/, "Brand: " + inputBrand + ", ");
        console.log("Brand " + result);
    }

    const btn = targetLi.querySelector('button');
    targetLi.textContent = result;
    if (btn) targetLi.appendChild(btn);
}

function hidden() {
    const content = document.getElementsByClassName('content');
    for(let i = 0; i < content.length; i++){
        content[i].style.display = 'none';
    }

    const newProduct = document.getElementsByClassName('newProd');
    for(let i = 0; i < newProduct.length; i++){
        newProduct[i].style.display = 'none';
    }
}

function changeProduct(btn) {
    const newProduct = document.getElementsByClassName('newProd');
    for(let i = 0; i < newProduct.length; i++){
        newProduct[i].style.display = 'none';
    }
    
    const content = document.getElementsByClassName('content');
    for(let i = 0; i < content.length; i++){
        content[i].style.display = 'block';
    }
}

async function sendNewProduct(btn){
    const newBrand = document.getElementById('newBrand').value;
    const newPrice = document.getElementById('newPrice').value;
    const newType = document.getElementById('newType').value;
    const newColor = document.getElementById('newColor').value;

    const response = await fetch (urlLocalHost + "/api/admin/addNewProduct", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({Brand: newBrand, PriceEuro: newPrice, Type: newType, Color: newColor})
    });

    if(!response.ok) {
        console.log("Didn't send.");
        alert("Ungültige Anfrage, bitte versuchen Sie es nochmal.");
    } else {
        console.log("Sent.");
        alert("Der Produkt mit Brand: " + newBrand + ", Preis: " + newPrice + "€, Typ: " + newType + ", Color: " + newColor + " war zum Produktliste hinzugefügt.");
    }
}

function newProduct(btn){
    const content = document.getElementsByClassName('content');
    for(let i = 0; i < content.length; i++){
        content[i].style.display = 'none';
    }

    const newProduct = document.getElementsByClassName('newProd');
    for(let i = 0; i < newProduct.length; i++){
        newProduct[i].style.display = 'block';
    }
}