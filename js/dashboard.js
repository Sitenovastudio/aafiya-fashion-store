/* ==========================
   MOBILE SIDEBAR
========================== */

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("show");

    });

}

/* ==========================
   DARK MODE
========================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const darkModeEnabled =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        darkModeEnabled
    );

    updateModeStatus();

}

/* Load Saved Mode */

window.addEventListener("load", () => {

    const darkMode =
        localStorage.getItem("darkMode");

    if (darkMode === "true") {

        document.body.classList.add("dark");

    }

    updateModeStatus();

});

/* Update Status */

function updateModeStatus() {

    const status =
        document.getElementById("modeStatus");

    if (!status) return;

    if (
        document.body.classList.contains("dark")
    ) {

        status.innerText = "On";

        status.style.color = "#16a34a";

    } else {

        status.innerText = "Off";

        status.style.color = "#dc2626";

    }

}

/* ==========================
   DASHBOARD DATA
========================== */

/*
Temporary demo values

Later:
Replace with Supabase API
*/

async function loadDashboardStats() {

try {

const { count: productCount } =
await supabaseClient
.from("products")
.select("*", {
count: "exact",
head: true
});

const { count: salesCount } =
await supabaseClient
.from("sales")
.select("*", {
count: "exact",
head: true
});

const { data: salesData } =
await supabaseClient
.from("sales")
.select("total_amount");

const totalRevenue =
salesData?.reduce(
(sum, sale) =>
sum + Number(sale.total_amount || 0),
0
) || 0;

const { count: lowStockCount } =
await supabaseClient
.from("products")
.select("*", {
count: "exact",
head: true
})
.lt("stock", 5);

document.getElementById(
"totalProducts"
).innerText =
productCount || 0;

document.getElementById(
"totalSales"
).innerText =
salesCount || 0;

document.getElementById(
"totalRevenue"
).innerText =
"₹" + totalRevenue;

document.getElementById(
"lowStock"
).innerText =
lowStockCount || 0;

}
catch(error){

console.error(error);

}

}

loadDashboardStats();

loadDashboardStats();


/* ==========================
   GREETING
========================== */

const username =
    localStorage.getItem("username");

if (username) {

    console.log(
        "Welcome " + username
    );

}

/* ==========================
   AUTO CLOSE SIDEBAR
========================== */

document.addEventListener("click", function (e) {

    if (
        window.innerWidth < 768 &&
        sidebar &&
        sidebar.classList.contains("show")
    ) {

        if (
            !sidebar.contains(e.target) &&
            e.target !== menuBtn
        ) {

            sidebar.classList.remove("show");

        }

    }

});
