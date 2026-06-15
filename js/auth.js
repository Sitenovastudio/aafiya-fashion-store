/* ==========================
   LOGIN SYSTEM
========================== */
if(error){
   console.error(error);
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        /* Demo Login */

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", username);

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Username or Password");

        }

    });

}

/* ==========================
   SESSION PROTECTION
========================== */

function checkAuth() {

    const loggedIn =
        localStorage.getItem("loggedIn");

    if (
        loggedIn !== "true" &&
        !window.location.pathname.includes("index.html")
    ) {

        window.location.href = "index.html";

    }

}

/* Run Protection */

if (
    window.location.pathname.includes("dashboard.html")
) {

    checkAuth();

}

/* ==========================
   LOGOUT
========================== */

function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");

        window.location.href = "index.html";

    }

}
