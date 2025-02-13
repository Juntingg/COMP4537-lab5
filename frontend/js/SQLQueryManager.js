//This code was assisted by ChatGPT, OpenAI.

class SQLQueryManager {
    static defaultRows = new Array(
        { name: 'Sara Brown', dateOfBirth: "1901-01-01" },
        { name: 'John Smith', dateOfBirth: "1941-01-01" },
        { name: 'Jack Ma', dateOfBirth: "1961-01-30" },
        { name: 'Elon Musk', dateOfBirth: "1999-01-01" },
    )
    static endPoint = "http://localhost:3000/api";
    static defaultQuery = "INSERT INTO Patients (name, dateOfBirth) VALUES "

    outputContainer;

    constructor(outputContainer) {
        this.outputContainer = outputContainer;
    }


    static handleInsert() {
        let query = this.defaultQuery;
        for (let i = 0; i < this.defaultRows.length; i++) {
            query += `("${this.defaultRows[i].name}", "${this.defaultRows[i].dateOfBirth}")`
            if (i === this.defaultRows.length - 1) {
                query += ';';
            } else {
                query += ',';
            }
        }
        this.handlePost(query);
        return;
    }


    static handleSubmit() {
        let query = document.getElementById("sql_input_area").value;
        query = query.trim();
        const method = query.split(" ")[0].toUpperCase();
        if (method === "SELECT") {
            this.handleGet(query);
        }
        else if (method === "INSERT") {
            this.handlePost(query);
        }else {
            this.outputContainer.innerHTML = INVALID_QUERY_MESSAGE;
        }
    }

    static async handlePost(query) {
        try {
            const response = await fetch(this.endPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: query })
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
    static async handleGet(query) {
        try {
            const response = await fetch(`${this.endPoint}?query=${query}`);
            const data = await response.json();
            if (data.error) {
                this.outputContainer.innerHTML = data.error;
            } else {
                this.outputContainer.innerHTML = this.createTable(data);
            }
        } catch (error) {
            this.outputContainer.innerHTML = error;
        }

    }
    static createTable(data){
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