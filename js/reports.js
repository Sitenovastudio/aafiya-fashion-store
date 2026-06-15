let salesData = [];

async function loadReports(){

const { data:sales } =
await supabaseClient
.from("sales")
.select(`
*,
customers (
name
)
`)
.order("id",{ascending:false});

salesData = sales || [];

loadCards();
loadTable();
loadChart();
loadLowStock();

}

loadReports();

function loadCards(){

let todayTotal = 0;
let monthTotal = 0;

const today =
new Date().toISOString().split("T")[0];

const currentMonth =
new Date().getMonth();

salesData.forEach(sale=>{

const saleDate =
new Date(sale.sale_date);

if(
sale.sale_date.startsWith(today)
){

todayTotal +=
Number(sale.total_amount);

}

if(
saleDate.getMonth() === currentMonth
){

monthTotal +=
Number(sale.total_amount);

}

});

document.getElementById(
"todaySales"
).innerText =
"₹"+todayTotal;

document.getElementById(
"monthSales"
).innerText =
"₹"+monthTotal;

document.getElementById(
"totalOrders"
).innerText =
salesData.length;

}

function loadTable(){

const table =
document.getElementById(
"salesTable"
);

table.innerHTML="";

salesData.forEach(sale=>{

table.innerHTML += `

<tr>

<td>${sale.id}</td>

<td>
${sale.customers?.name || "Walk In"}
</td>

<td>
₹${sale.total_amount}
</td>

<td>
${new Date(
sale.sale_date
).toLocaleDateString()}
</td>

</tr>

`;

});

}

function loadChart(){

const labels = [];
const values = [];

salesData.slice(0,10)
.reverse()
.forEach(sale=>{

labels.push(
sale.id
);

values.push(
sale.total_amount
);

});

new Chart(

document.getElementById(
"salesChart"
),

{

type:"line",

data:{

labels:labels,

datasets:[{

label:"Revenue",

data:values,

borderWidth:3,

fill:false

}]

}

}

);

}

async function loadLowStock(){

const { data } =
await supabaseClient
.from("products")
.select("*")
.lt("stock",5);

document.getElementById(
"lowStockCount"
).innerText =
data.length;

}

function exportCSV(){

let csv =

"ID,Customer,Total,Date\n";

salesData.forEach(sale=>{

csv +=

`${sale.id},
${sale.customers?.name || "Walk In"},
${sale.total_amount},
${sale.sale_date}\n`;

});

const blob =
new Blob(
[csv],
{type:"text/csv"}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"sales-report.csv";

a.click();

}

