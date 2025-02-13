document.getElementById("insert").innerHTML = INSERT_BUTTON;
document.getElementById("submit").innerHTML = SUBMIT_BUTTON;

document.getElementById("insert").addEventListener("click", () => {
    SQLQueryManager.handleInsert();
});
document.getElementById("submit").addEventListener("click", () => {
    SQLQueryManager.handleSubmit();
});