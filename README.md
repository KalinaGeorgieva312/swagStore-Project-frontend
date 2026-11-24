# swagStore-Project-frontend
 
A JavaScript, HTML & CSS web shop frontend, built as a hands-on learning project. It connects to a separate backend (see the 'swagStore-Project-backend' repository) through its REST API and provides login, shopping, product filtering, a shopping cart, payment and a work-in-progress admin menu for changing product properties.

## Features

- **Login** - authenticates against the backend API
- **Shopping** - view products and add them to the shopping cart
- **Filtering** - filter products by brand and price
- **Shopping cart** - view the cart, with automatic discount (10%) on orders of more than 3 items
- **Payment** - complete purchases through the payment endpoint
- **Admin menu** *(work in progress)* - change product properties: price, brand and color

## Technologies

- JavaScript (HTML & CSS)
- Communicates with the backend via its RESTful API 

## Installation

1. Clone the repository from your terminal: git clone https://github.com/KalinaGeorgieva312/swagStore-Project-frontend.git
2. **Prerequisite:** the backend must be installed and running - follow the swagStore-Project-backend README (https://github.com/KalinaGeorgieva312/swagStore-Project-backend) and run the API in Visual Studio.
3. Open the cloned frontend folder and open 'index.html' in a browser (tested in Microsoft Edge).
4. Log in with the test credentials:
   - to test user: Username: Bob
                   Password: 123
   - to test admin: Username: Admin
                    Password: asdf

## Backend

This frontend depends on the backend: **swagStore-Project-backend (https://github.com/KalinaGeorgieva312/swagStore-Project-backend)** - a C# application exposing the RESTful API for users, products, shopping carts and payments. The backend README contains its own installation steps and API overview.

## Roadmap

- Finish the admin menu
- Add user menu
- Code refactor (clean split between JavaScript, HTML & CSS)

## Project Structure

- index.html             # Main page with styling (CSS)
- index.js               # Main logic: login, product display, filtering, adding products to shopping cart
- shoppingCart.html      # Shopping cart page with styling (CSS)
- shoppingCart.js        # Shopping cart logic until page is redirected to the shopping cart page
- insideShoppingCart.js  # Shopping cart logic: selected products display, total sum & payment
- adminMenu.html         # Admin menu page with styling (CSS)
- adminMenu.js           # Product property change (price, color, brand)
- images                 # Product stock photos, logo, icons
