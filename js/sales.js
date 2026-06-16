/* ==========================
   GLOBAL VARIABLES
========================== */

let products = [];
let cart = [];
let grandTotal = 0;

/* ==========================
   LOAD PRODUCTS
========================== */

async function loadProducts() {

try {

const { data, error } =
await supabaseClient
.from("products")
.select("*")
.order("name");

if(error){
console.error(error);
alert(error.message);
return;
}

products = data || [];

const select =
document.getElementById("productSelect");

if(!select) return;

select.innerHTML =
`<option value="">Select Product</option>`;

products.forEach(product => {

select.innerHTML += `
<option value="${product.id}">
${product.name} (Stock: ${product.stock})
</option>
`;

});

console.log("Products Loaded:", products);

}catch(error){

console.error(error);

}

}

loadProducts();

/* ==========================
   ADD TO CART
========================== */

function addToCart(){

const productId =
Number(
document.getElementById("productSelect").value
);

const qty =
Number(
document.getElementById("qty").value
);

if(!productId){

alert("Select Product");
return;

}

if(qty <= 0){

alert("Enter Valid Quantity");
return;

}

const product =
products.find(
p => Number(p.id) === Number(productId)
);

if(!product){

alert("Product Not Found");
return;

}

if(qty > product.stock){

alert("Not Enough Stock");
return;

}

const itemTotal =
qty * Number(product.price);

cart.push({

productId: product.id,
name: product.name,
qty: qty,
price: Number(product.price),
total: itemTotal

});

renderCart();

}

/* ==========================
   RENDER CART
========================== */

function renderCart(){

const body =
document.getElementById("cartBody");

if(!body) return;

body.innerHTML = "";

grandTotal = 0;

cart.forEach(item => {

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

const totalElement =
document.getElementById("grandTotal");

if(totalElement){

totalElement.innerText =
"₹" + grandTotal;

}

}

/* ==========================
   COMPLETE SALE
========================== */

async function completeSale(){

try{

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

let customerId;

/* ==========================
   Customer History
========================== */
  async function loadCustomerHistory(){

const phone =
document.getElementById(
"searchPhone"
).value.trim();

if(!phone){

alert("Enter Phone Number");
return;

}

const {
data: customer
} =
await supabaseClient
.from("customers")
.select("*")
.eq("phone", phone)
.maybeSingle();

if(!customer){

alert("Customer Not Found");
return;

}

const {
data: sales
} =
await supabaseClient
.from("sales")
.select("*")
.eq("customer_id", customer.id)
.order("id", {
ascending:false
});

const table =
document.getElementById(
"historyTable"
);

table.innerHTML = "";

if(!sales || sales.length === 0){

table.innerHTML = `
<tr>
<td colspan="5">
No Purchase History
</td>
</tr>
`;

return;

}

for(const sale of sales){

const {
data: items
} =
await supabaseClient
.from("sale_items")
.select(`
quantity,
products(name)
`)
.eq("sale_id", sale.id);

let productList = "";

items.forEach(item => {

productList +=
`${item.products.name}
(x${item.quantity})<br>`;

});

table.innerHTML += `

<tr>

<td>#${sale.id}</td>

<td>${customer.name}</td>

<td>${productList}</td>

<td>
${new Date(
sale.created_at
).toLocaleDateString()}
</td>

<td>
₹${sale.total_amount}
</td>

</tr>

`;

}

}
}
   
/* CHECK CUSTOMER */

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

/* CREATE SALE */

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

/* SAVE ITEMS */

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
p => Number(p.id) === Number(item.productId)
);

if(product){

await supabaseClient
.from("products")
.update({
stock: product.stock - item.qty
})
.eq("id", item.productId);

}

}

/* PRINT */

printInvoice(
sale.id,
customerName,
customerPhone
);

alert("Sale Saved Successfully");

/* RESET */

cart = [];

renderCart();

document.getElementById("customerName").value = "";
document.getElementById("customerPhone").value = "";
document.getElementById("customerAddress").value = "";

loadProducts();

}catch(error){

console.error(error);
alert(error.message);

}

}

/* ==========================
   PRINT INVOICE
========================== */

function printInvoice(
invoiceNo,
customerName,
phone
){

const invoice = `

<h2>Aafiya Fashion Store</h2>

<hr>

<p><b>Invoice #${invoiceNo}</b></p>

<p>Customer: ${customerName}</p>

<p>Phone: ${phone}</p>

<p>Total Amount: ₹${grandTotal}</p>

`;

const win =
window.open(
"",
"",
"width=700,height=700"
);

win.document.write(invoice);

win.document.close();

win.print();

}

/* ==========================
   WHATSAPP
========================== */

function shareWhatsApp(){

const customerPhone =
document.getElementById("customerPhone").value;

if(!customerPhone){

alert("Enter Customer Phone");
return;

}

const msg =

`Thank you for shopping at Aafiya Fashion Store.

Bill Amount: ₹${grandTotal}`;

window.open(

`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`

);

}
/* ==========================
   CUSTOMER HISTORY
========================== */

async function loadCustomerHistory(){

const phone =
document.getElementById(
"searchPhone"
).value.trim();

if(!phone){

alert("Enter Phone Number");
return;

}

const {
data: customer,
error: customerError
} =
await supabaseClient
.from("customers")
.select("*")
.eq("phone", phone)
.maybeSingle();

if(customerError){

alert(customerError.message);
return;

}

if(!customer){

alert("Customer Not Found");
return;

}

const {
data: sales,
error: salesError
} =
await supabaseClient
.from("sales")
.select("*")
.eq("customer_id", customer.id)
.order("id", {
ascending: false
});

if(salesError){

alert(salesError.message);
return;

}

const table =
document.getElementById(
"historyTable"
);

table.innerHTML = "";

if(!sales || sales.length === 0){

table.innerHTML = `
<tr>
<td colspan="3">
No Purchase History
</td>
</tr>
`;

return;

}

sales.forEach(sale => {

table.innerHTML += `

<tr>

<td>#${sale.id}</td>

<td>
${new Date(
sale.created_at
).toLocaleDateString()}
</td>

<td>
₹${sale.total_amount}
</td>

</tr>

`;

});

}
