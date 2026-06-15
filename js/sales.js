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

let customerId;

/* CHECK CUSTOMER */

const { data: existingCustomer } =
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

await supabaseClient
.from("products")
.update({
stock: product.stock - item.qty
})
.eq("id", item.productId);

}

/* PRINT */

printInvoice(
sale.id,
customerName,
customerPhone
);

alert("Sale Saved Successfully");

cart = [];

renderCart();

}
