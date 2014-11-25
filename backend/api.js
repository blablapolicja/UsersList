var mysql 	= require('mysql'),
    express = require('express'),
    http 	= require('http'),
    app 	= express(),
    bodyParser = require('body-parser');

var connectionPool = mysql.createPool({
    host     : 'localhost',
    user     : 'root', //change user if needed
    password : '', //change password if needed
    database : 'UserList'
});

app.use(bodyParser());
app.use('/',express.static('../frontend'));
app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' === req.method) return res.send(200);
  next();
});

app.get('/api/users/:id1', getUsers);
app.put('/api/userEdit/:id', editUser);

function getUsers (req,res) {
	connectionPool.getConnection(function(err, connection){
		if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var id1 = req.params.id1;
                id2 = parseInt(id1) + 9;
			connection.query('SELECT * FROM UserList WHERE Id BETWEEN ? AND ?', [id1,id2], function(err,rows){
				if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send(rows);
                connection.release();
			});
		}
	});
}

function editUser (req,res) {
    connectionPool.getConnection(function(err, connection){
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var data = req.body;
            var id = req.params.id;
            connection.query('UPDATE UserList SET ? WHERE Id=?', [data, id], function(err,rows){
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                } else {
                    res.send({
                        result: 'success',
                        err:    '',
                        json:   rows,
                        length: rows.length
                    });
                }
                connection.release();
            });
        }
    });
}

app.listen(8090);

console.log("Listen on 8090");