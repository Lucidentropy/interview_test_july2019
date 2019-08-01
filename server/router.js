let express = require('express');
let router = express.Router();
let request = require('axios');
let path = require('path');

// home page
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/../app/views/index.html'));
});

// php router
router.get('/sql.php/:action?', function (req, res, next) {
    let phppath = 'php ' + path.join(__dirname + '/../app/php/sql.php');
    let action = req.params.action;
    if ( action ) {
        phppath += ' --action=' + action
    }
    const phpExec = execPromise(phppath);

    phpExec.then(function (output) {
        res.send(output);
    })
});

router.post('/sql.php', function (req, res, next) {
    let phppath = 'php ' + path.join(__dirname + '/../app/php/sql.php');
    let action = req.body.action;

    if ( action ) {
        phppath += ' --action=' + action;
        phppath += ' --data="' + req.body.data + '"';
    }
    const phpExec = execPromise(phppath);

    phpExec.then(function (output) {
        res.send(output);
    })
});

// Synchronous Exec
const execPromise = cmd => {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}


module.exports = router;