var MongoClient = require('mongodb').MongoClient;
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url == "/") {
        return setHomePage(req, res);
    }    
	    
    if (req.url == "/process") {
	    return process(req, res);
    }

    function setHomePage(req, res) {
        return res.end(`
        <!doctype html>
        <html>
        <head>
        <title>Form</title>
        </head>
        <body>
            <form method='post' action='/process'>
                <label>Input Compnay Name or Stock Ticker: </label>
                <input type='text' name='filter'>
                </br>
                <label>Select Type: </label>
                <input type='radio' name='type' value='Company'>Company
                <input type='radio' name='type' value='Ticker'>Ticker
                </br>
                <input type='submit'>
            </form>
        </body>

        </html>
        `);
    }

    function process(req, res) {
        const body = [];
        req.on('data', function (data) {
            body.push(data);
        });

        res.write('Check console to view results of Query!');

        req.on('end', function() {
            const reqBody = Buffer.concat(body).toString();
            const params = new URLSearchParams(reqBody);
            // company name or ticker
            const filter = params.get('filter');
            // specifys name or ticker
            const type = params.get('type');
            // log to console
            console.log(filter);
            console.log(type);

            const uri = "mongodb+srv://test_db:123@cluster0.d1cd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

            MongoClient.connect(uri, function (err, db) {
                if (err) { return console.log(err); }

                var dbo = db.db('Stock');

                var collection = dbo.collection('PublicCompanies');
                if (err) { return console.log(err); }
                console.log('connected to db');

                if (type == 'Ticker') {
                    var query = {'Ticker': filter};
                    collection.find(query).toArray(function (err, items) {
                        if (err) { 
                            return console.log(err); 
                        } else {
                            console.log("Company Data: ");
                            for (i=0; i < items.length; i++) {
                                console.log(items[i]);
                            }
                        }

                    });
                } else if (type == 'Company') {
                    var query = {'CompanyName': filter};
                    collection.find(query).toArray(function (err, items) {
                        if (err) { 
                            return console.log(err); 
                        } else {
                            console.log("Company Data: ");
                            for (i=0; i < items.length; i++) {
                                console.log(items[i]);
                            }
                        }

                    });
                }
            });
        });
        return res.end();
    }
}).listen(8080);