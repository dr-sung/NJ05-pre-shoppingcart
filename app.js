// an idea of shopping cart implementation

const express = require('express');
const session = require('express-session');

const app = express();
app.use(session({
	secret: 'mysecretkey',
	resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000}   // if inactive, session expires in 1 hour
}));

// index.html (welcome page)
app.use('/', express.static(__dirname + '/public/html'));

// add an item to the shopping cart
app.get('/add', (req, res) => {
	if (!req.session.shoppingcart) {
		// first time connection: create a shopping cart
		req.session.shoppingcart = [];
	}
	const item = req.query.name;
	req.session.shoppingcart.push(item);

    let page = `
        <html><head><title>shopping cart</title></head>
        <body>
	        <h3><strong>${item}</strong> added to the shopping cart!</h3>
	        <a href="/">Continue shopping</a><br />
            <a href="/shoppingcart">Go to Shopping Cart</a>
    `;
	res.send(page);
});

// display the contents of the shopping cart
app.get('/shoppingcart', (req, res) => {
    const sc = req.session.shoppingcart;
    let cartContents = '';
	if (!sc) {
        cartContents ='The shopping cart is empty';
	} else {
        cartContents += '<ul>';
	    for (const index in sc) {
		    cartContents += '<li>' + sc[index] + '</li>';
	    }
        cartContents += '</ul>';
    }

    let page =`
        <html><head><title>shopping cart</title></head><body>
        <body>
	        <h1>The Contents of the Shopping Cart</h1>
            ${cartContents}
            <br /><br />
            <a href="/">Continue shopping</a><br />
        </body>
        </html>
    `;
	res.send(page);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running at port', port);
});