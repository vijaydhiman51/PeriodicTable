document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  const authToken = localStorage.getItem("authToken");
  const loggedinUser = localStorage.getItem("usernamePT");

  document
    .getElementById("pt-table-main")
    .addEventListener("click", function (event) {
      handleTableClick(event);
    });

  if (authToken && loggedinUser) {
    const { token, expiryTime } = JSON.parse(authToken);

    if (new Date().getTime() > expiryTime) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("usernamePT");
      return;
    }
    const loginbtn = $("#LoginBtn");
    loginbtn.attr("data-state", "Logout");
    loginbtn.text("Logout");
    $("#username").html(loggedinUser);
  }
}

async function handleTableClick(event) {
  const target = event.target;
  const row = target.closest("section.pt-element");
  if (row?.id && !["lan", "act"].includes(row.id)) {
    let data = await getDataUsingElementSymbols(row.id);
    console.log("Row data:", data);
    $("#info-desc").html(data.Info);
  }
}

function getDataUsingElementSymbols(symbol) {
  return fetch(`http://localhost:3000/api/periodicTable/getBySymbol/${symbol}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("API is down or something went wrong:", error.message);
    });
}

function onLoginClick() {
  const btn = $("#LoginBtn");

  if (btn.attr("data-state") === "Logout") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usernamePT");
    btn.attr("data-state", "Login");
    btn.text("Login");
    $("#username").html("");
  } else {
    const popupWidth = 500;
    const popupHeight = 400;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    window.open(
      "/periodicTableFrontend/LoginPopup.html", 
      "LoginPopup",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=no,scrollbars=yes`
    );

    window.addEventListener("message", function (event) {
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.status === "Login successful") {
        const token = event.data.jwtToken;
        const expiryTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem(
          "authToken",
          JSON.stringify({ token, expiryTime })
        );
        localStorage.setItem("usernamePT", event.data.username);
        btn.attr("data-state", "Logout");
        btn.text("Logout");
        $("#username").html(event.data.username);
      }
    });
  }
}
