let debounceTimer;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

document.addEventListener("click", function (event) {
  const container = document.getElementById("searchContainer");
  if (!container.contains(event.target)) {
    document.getElementById("resultList").style.display = "none";
    document.getElementById("searchBar").value = "";
  }
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
    $("#info-desc").html(generateFormattedDiv(data));
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

function generateFormattedDiv(data) {
  return `<div style="margin: 5px; border-radius: 2px;">
            <h3 style="text-align: center; margin-top: 0;">${data.AtomicNumber} - ${data.Name} <span style="font-weight: normal;">(${data.Symbol})</span></h3>
            <p style="text-align: justify; line-height: 1; font-size: 14px;">
              ${data.Info}
            </p>
            <p style="text-align: center; font-weight: bold; margin-top: 5px;">
              Melting Point: ${data.MeltingPoint}°C &nbsp; | &nbsp; Boiling Point: ${data.BoilingPoint}°C              
            <button onclick="clearElementInfo()" style="border: none; background: none; cursor: pointer; float: right" title="Clear">
            ❌
          </button>
            </p>
          </div>`;
}

function clearElementInfo() {
  $("#info-desc").html("");
}

//search functiionlity
function debouncedSearch() {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const query = document.getElementById("searchBar").value.trim();
    searchDatabase(query);
  }, 500); // 500ms delay
}

function searchDatabase(query) {
  const pattern = query.replace(/\*/g, "%");

  fetch(
    `http://localhost:3000/api/periodicTable/search?query=${encodeURIComponent(
      pattern
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("resultList");
      if (data.length === 0) {
        list.innerHTML = "<li>No matches found</li>";
        list.style.display = "block";
        return;
      }

      // Only take first 3 results
      const topResults = data;

      list.innerHTML = topResults
        .map(
          (el) =>
            `<li class="result-item" style="padding: 5px; border-bottom: 1px solid #eee;" data-symbol="${el.Symbol}">${el.Name} (${el.Symbol})</li>`
        )
        .join("");

      document.querySelectorAll(".result-item").forEach((item) => {
        item.addEventListener("click", async (event) => {
          const symbol = event.target.getAttribute("data-symbol");
          let data = await getDataUsingElementSymbols(symbol);
          $("#info-desc").html(generateFormattedDiv(data));
          document.getElementById("resultList").style.display = "none";
          document.getElementById("searchBar").value = "";
        });
      });

      list.style.display = "block";
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
