//This code was assisted by ChatGPT, OpenAI.

class SQLQueryManager {
    static defaultRows = new Array(
        { name: 'Sara Brown', dateOfBirth: "1901-01-01" },
        { name: 'John Smith', dateOfBirth: "1941-01-01" },
        { name: 'Jack Ma', dateOfBirth: "1961-01-30" },
        { name: 'Elon Musk', dateOfBirth: "1999-01-01" },
    )
    static endPoint = "https://comp4537-lab5-backend-aa8fl.ondigitalocean.app/api/v1/sql/";
    static defaultQuery = "INSERT INTO patient (name, dateOfBirth) VALUES "

    outputContainer;

    constructor(outputContainer) {
        this.outputContainer = outputContainer;
    }


    handleInsert() {
        let query = SQLQueryManager.defaultQuery;
        for (let i = 0; i < SQLQueryManager.defaultRows.length; i++) {
            query += `('${SQLQueryManager.defaultRows[i].name}', '${SQLQueryManager.defaultRows[i].dateOfBirth}')`
            if (i === SQLQueryManager.defaultRows.length - 1) {
                query += ';';
            } else {
                query += ',';
            }
        }
        this.handlePost(query);
        return;
    }


    handleSubmit() {
        let query = document.getElementById("sql_input_area").value;
        query = query.trim();
        const method = query.split(" ")[0].toUpperCase();
        if (method === "SELECT") {
            this.handleGet(query);
        }
        else if (method === "INSERT") {
            this.handlePost(query);
        } else {
            this.outputContainer.innerHTML = INVALID_QUERY_MESSAGE;
        }
    }

    async handlePost(query) {
        try {
            const response = await fetch(SQLQueryManager.endPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: query
            });

            const data = await response.json();
            if (data.error) {
                this.outputContainer.innerHTML = data.error;
            } else {
                this.outputContainer.innerHTML = data.result;
            }
        } catch (error) {
            this.outputContainer.innerHTML = error;
        }

    }
    async handleGet(query) {
        try {
            const response = await fetch(`${SQLQueryManager.endPoint}"${query}"`);
            const data = await response.json();
            if (data.error) {
                this.outputContainer.innerHTML = data.error;
            } else {
                this.outputContainer.innerHTML = this.createTable(data.result);
            }
        } catch (error) {
            this.outputContainer.innerHTML = error;
        }

    }
    createTable(data) {
        let table = '<table>';
        for (let i = 0; i < data.length; i++) {
            table += '<tr>';
            for (let key in data[i]) {
                table += `<td>${data[i][key]}</td>`;
            }
            table += '</tr>';
        }
        table += '</table>';
        return table;
    }
}