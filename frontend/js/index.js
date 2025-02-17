document.getElementById("insert").innerHTML = INSERT_BUTTON;
document.getElementById("submit").innerHTML = SUBMIT_BUTTON;

const outputElement = document.getElementById("output");
const sqlQueryManager = new SQLQueryManager(outputElement);

document.getElementById("insert").addEventListener("click", () => {
    sqlQueryManager.handleInsert();
});
document.getElementById("submit").addEventListener("click", () => {
    sqlQueryManager.handleSubmit();
});