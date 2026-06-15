let products = [];

const form =
document.getElementById("productForm");

const table =
document.getElementById("productTable");

const searchInput =
document.getElementById("searchInput");


/* LOAD PRODUCTS */

async function loadProducts(){

const { data, error } =
await supabaseClient
.from("products")
.select("*")
.order("id", {
ascending: false
});

if(error){

console.error(error);
alert(error.message);
return;

}

products = data || [];

renderProducts(products);

}

/* RENDER */

function renderProducts(products){

table.innerHTML="";

products.forEach(product=>{

table.innerHTML += `

<tr>

<td>
${
product.image_url
? `<img src="${product.image_url}" width="60">`
: "No Image"
}
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

const product = {

name: document.getElementById("name").value,
category: document.getElementById("category").value,
size: document.getElementById("size").value,
color: document.getElementById("color").value,
price: document.getElementById("price").value,
stock: document.getElementById("stock").value,
image_url: imageUrl

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

const { error } =
await supabaseClient
.from("products")
.delete()
.eq("id", id);

if(error){

alert(error.message);
return;

}

loadProducts();

}

/* EDIT */

async function editProduct(id){

const {
data: product,
error
} =
await supabaseClient
.from("products")
.select("*")
.eq("id", id)
.single();

if(error){

console.error(error);
alert(error.message);
return;

}

const newName =
prompt(
"Product Name",
product.name
);

if(newName === null) return;

const newCategory =
prompt(
"Category",
product.category || ""
);

if(newCategory === null) return;

const newSize =
prompt(
"Size",
product.size || ""
);

if(newSize === null) return;

const newColor =
prompt(
"Color",
product.color || ""
);

if(newColor === null) return;

const newPrice =
prompt(
"Price",
product.price
);

if(newPrice === null) return;

const newStock =
prompt(
"Stock Quantity",
product.stock
);

if(newStock === null) return;

const { error: updateError } =
await supabaseClient
.from("products")
.update({

name: newName.trim(),
category: newCategory.trim(),
size: newSize.trim(),
color: newColor.trim(),
price: Number(newPrice),
stock: Number(newStock)

})
.eq("id", id);

if(updateError){

console.error(updateError);
alert(updateError.message);
return;

}

alert("Product Updated Successfully");

loadProducts();

}

/* SEARCH */

searchInput.addEventListener(
"keyup",
async()=>{

const keyword=
searchInput.value;

const { data, error } =
await supabaseClient
.from("products")
.select("*")
.ilike(
"name",
`%${keyword}%`
);

if(error){

console.error(error);
return;

}

renderProducts(data || []);
}
);

loadProducts();
