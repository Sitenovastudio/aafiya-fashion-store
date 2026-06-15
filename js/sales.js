let products = [];

let cart = [];

let grandTotal = 0;

/* LOAD PRODUCTS */

async function loadProducts(){

const { data } =
await supabaseClient
.from("products")
.select("*");

products = data;

const select =
document.getElementById("productSelect");

data.forEach(product=>{

select.innerHTML += `

<option value="${product.id}">

${product.name}
(Stock:${product.stock})

</option>

`;

});

}

loadProducts();

/* ADD CART */

function addToCart(){

const productId =
Number(
document.getElementById(
"productSelect"
).value
);

const qty =
Number(
document.getElementById(
"qty"
).value
);

const product =
products.find(
p=>p.id===productId
);

if(!product){

alert("Select Product");

return;

}

if(qty > product.stock){

alert("Not enough stock");

return;

}

const itemTotal =
qty * product.price;

cart.push({

productId,
name:product.name,
qty,
price:product.price,
total:itemTotal

});

renderCart();

}

/* RENDER CART */

function renderCart(){

const body =
document.getElementById(
"cartBody"
);

body.innerHTML="";

grandTotal=0;

cart.forEach(item=>{

grandTotal += item.total;

body.innerHTML += `

<tr>

<td>${item.name}</td>

<td>${item.qty}</td>

<td>₹${item.price}</td>

<td>₹${item.total}</td>

</tr>

`;

});

document.getElementById(
"grandTotal"
).innerText =
"₹"+grandTotal;

}
async function completeSale(){

async function completeSale(){

if(cart.length === 0){

alert("Cart is Empty");
return;

}

const customerName =
document.getElementById("customerName").value.trim();

const customerPhone =
document.getElementById("customerPhone").value.trim();

const customerAddress =
document.getElementById("customerAddress").value.trim();

if(!customerName){

alert("Enter Customer Name");
return;

}

if(!customerPhone){

alert("Enter Customer Phone");
return;

}

/* Check Existing Customer */

let customerId;

const {
data: existingCustomer
} =
await supabaseClient
.from("customers")
.select("*")
.eq("phone", customerPhone)
.maybeSingle();

if(existingCustomer){

customerId = existingCustomer.id;

}else{

const {
data: newCustomer,
error: customerError
} =
await supabaseClient
.from("customers")
.insert([{
name: customerName,
phone: customerPhone,
address: customerAddress
}])
.select()
.single();

if(customerError){

alert(customerError.message);
return;

}

customerId = newCustomer.id;

}

/* Create Sale */

const {
data: sale,
error: saleError
} =
await supabaseClient
.from("sales")
.insert([{
customer_id: customerId,
total_amount: grandTotal
}])
.select()
.single();

if(saleError){

alert(saleError.message);
return;

}

/* Save Items & Reduce Stock */

for(const item of cart){

await supabaseClient
.from("sale_items")
.insert([{
sale_id: sale.id,
product_id: item.productId,
quantity: item.qty,
price: item.price,
subtotal: item.total
}]);

const product =
products.find(
p => p.id === item.productId
);

await supabaseClient
.from("products")
.update({
stock: product.stock - item.qty
})
.eq("id", item.productId);

}

/* Print Invoice */

printInvoice(
sale.id,
customerName,
customerPhone
);

alert("Sale Saved Successfully");

cart = [];

renderCart();

}

}

const customerName =
document.getElementById(
"customerName"
).value;

const customerPhone =
document.getElementById(
"customerPhone"
).value;

const customerAddress =
document.getElementById(
"customerAddress"
).value;

let customerId;

/* CUSTOMER */

const {
data:customer
} =
await supabaseClient
.from("customers")
.insert([{

name:customerName,
phone:customerPhone,
address:customerAddress

}])
.select()
.single();

customerId =
customer.id;

/* SALE */

const {
data:sale
} =
await supabaseClient
.from("sales")
.insert([{

customer_id:customerId,
total_amount:grandTotal

}])
.select()
.single();

/* ITEMS */

for(const item of cart){

await supabaseClient
.from("sale_items")
.insert([{

sale_id:sale.id,
product_id:item.productId,
quantity:item.qty,
price:item.price,
subtotal:item.total

}]);

/* STOCK DEDUCT */

const product =
products.find(
p=>p.id===item.productId
);

await supabaseClient
.from("products")
.update({

stock:
product.stock - item.qty

})
.eq(
"id",
item.productId
);

}

/* PRINT */

printInvoice(
sale.id,
customerName,
customerPhone
);

}
function printInvoice(
invoiceNo,
customerName,
phone
){

const invoice = `

<h2>
Aafiya Fashion Store
</h2>

<hr>

<p>
Invoice #${invoiceNo}
</p>

<p>
Customer:
${customerName}
</p>

<p>
Phone:
${phone}
</p>

<p>
Total:
₹${grandTotal}
</p>

`;

const win =
window.open(
"",
"",
"width=600,height=700"
);

win.document.write(
invoice
);

win.print();

}

function shareWhatsApp(){

const customerPhone =
document.getElementById(
"customerPhone"
).value;

const msg =

`Thank you for shopping at Aafiya Fashion Store.
Your bill amount is ₹${grandTotal}`;

window.open(

`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`

);

}

