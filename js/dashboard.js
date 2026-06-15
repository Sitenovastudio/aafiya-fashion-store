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

function loadDashboardStats() {

    const totalProducts =
        localStorage.getItem("totalProducts") || 0;

    const totalSales =
        localStorage.getItem("totalSales") || 0;

    const totalRevenue =
        localStorage.getItem("totalRevenue") || 0;

    const lowStock =
        localStorage.getItem("lowStock") || 0;

    document.getElementById(
        "totalProducts"
    ).innerText = totalProducts;

    document.getElementById(
        "totalSales"
    ).innerText = totalSales;

    document.getElementById(
        "totalRevenue"
    ).innerText = "₹" + totalRevenue;

    document.getElementById(
        "lowStock"
    ).innerText = lowStock;

}

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
