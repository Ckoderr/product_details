var express = require('express');
var router = express.Router();
var pool = require('./pool')
/* GET home page. */
router.get("loginpage", function (req, res) {
    res.render('login', { message: '' });
});

router.post('/check_admin_login', function (req, res, next) {
    try {
        pool.query("select * from admins where emailid=? or mobileno=?)and password=?", [req.body.emailid, req.body.emailid, req.body.password]), fuction(error, result)
        if (error) {
            res.render('loginpage', { message: 'Server Error' });

        }
        else {
            if (result.length == 1) {
                res.render('dashbord');
            }
            else {
                res.render('loginpage', { message: 'Invalid emailid/mobileno/password' });
            }

        }

    }
    catch (e) {
        res.render('loginpage', { message: '' });
    }
})






module.exports = router;
