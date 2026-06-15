const form =
document.getElementById("productForm");

const table =
document.getElementById("productTable");

const searchInput =
document.getElementById("searchInput");

/* LOAD PRODUCTS */

async function loadProducts() {

const { data,error } =
await supabaseClient
.from("products")
.select("*")
.order("id",{ascending:false});

if(error){

console.log(error);
return;

}

renderProducts(data);

}

/* RENDER */

function renderProducts(products){

table.innerHTML="";

products.forEach(product=>{

table.innerHTML += `

<tr>

<td>

<img
src="${product.image_url}"
width="60">

</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>${product.size}</td>

<td>₹${product.price}</td>

<td>${product.stock}</td>

<td>

<button
onclick="editProduct(${product.id})"
class="btn btn-success">

Edit

</button>

<button
onclick="deleteProduct(${product.id})"
class="btn btn-danger">

Delete

</button>

</td>

</tr>

`;

});

}

/* IMAGE UPLOAD */

async function uploadImage(file){

const fileName =
Date.now()+"-"+file.name;

const { error } =
await supabaseClient
.storage
.from("product-images")
.upload(
fileName,
file
);

if(error){

alert(error.message);
return null;

}

const {
data
} =
supabaseClient
.storage
.from("product-images")
.getPublicUrl(fileName);

return data.publicUrl;

}

/* ADD PRODUCT */

form.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const imageFile =
document.getElementById("image").files[0];

let imageUrl="";

if(imageFile){

imageUrl=
await uploadImage(imageFile);

}

const product={

name:name.value,
category:category.value,
size:size.value,
color:color.value,
price:price.value,
stock:stock.value,
image_url:imageUrl

};

const { error } =
await supabaseClient
.from("products")
.insert([product]);

if(error){

alert(error.message);
return;

}

alert("Product Added");

form.reset();

loadProducts();

}
);

/* DELETE */

async function deleteProduct(id){

if(!confirm(
"Delete Product?"
)) return;

await supabaseClient
.from("products")
.delete()
.eq("id",id);

loadProducts();

}

/* EDIT */

async function editProduct(id){

const newPrice =
prompt("New Price");

if(!newPrice) return;

await supabaseClient
.from("products")
.update({
price:newPrice
})
.eq("id",id);

loadProducts();

}

/* SEARCH */

searchInput.addEventListener(
"keyup",
async()=>{

const keyword=
searchInput.value;

const { data }=
await supabaseClient
.from("products")
.select("*")
.ilike(
"name",
`%${keyword}%`
);

renderProducts(data);

}
);

loadProducts();
