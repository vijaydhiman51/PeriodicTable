document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  document
    .getElementById("pt-table-main")
    .addEventListener("click", function (event) {
      handleTableClick(event);
    });
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
