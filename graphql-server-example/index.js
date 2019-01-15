const { ApolloServer, gql } = require('apollo-server');
const mysql = require('mysql');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Typical promise-fication of 'Get' query. Default url is for central bank api
 * */
function httpGet(url='https://www.cbr-xml-daily.ru/daily_json.js') {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.responseText);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}

/**
 * Function gets all data about products from current database
 * */
function askDB(queryText) {
    return new Promise(function(resolve, reject) {
        const connection = mysql.createConnection({
            host     : 'localhost',
            database : 'test',
            user     : 'root',
            password : 'admin',
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                reject(err)
            }
            console.log('Connected as id ' + connection.threadId);
        });
        connection.query(queryText, function (error, results) {
            resolve(results)
        });
        connection.end();
    });
}
/**
 * Ask central bank api for actual money courses
 * Returns array of valutes with courses inside
 * */
getCourses = () => {
    return new Promise(function (resolve) {
        httpGet().then(response=> {
            const parsed = JSON.parse(response).Valute
            let result = []
            for (let key in parsed) {
                result = [...result,parsed[key]]
            }
            resolve(result)
        })
    });

/**
 * Main type schema of GraphQL
 * */
}
const typeDefs = gql`
  type Good {
    id: Int
    name: String
    description: String
    price: Int
  }
  type Valute {
    CharCode: String,
    Value: Float
  }
  type Query {
    goods: [Good],
    courses: [Valute]
  }
`;

/**
 * Resolvers
 * */
const resolvers = {
    Query: {
        goods: () => askDB('SELECT * FROM Good'),
        courses: ()=> getCourses()
    },
};

/**
 * Starts the server
 * */
const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});