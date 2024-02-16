const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const {User, Course} = require("../db")
const {JWT_SECRET} = require("../config")
// User Routes
router.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.create({
        username,
        password
    });
    if (user) {
        res.json({
            message : "User created successfully."
        })
    }else{
        res.status(403).json({
            message : "Wrong info!"
        })
    }
    
});

router.post('/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const isUserPresent = await User.findOne({
        username : username,
        password : password

    })
    if (isUserPresent){
        const token = jwt.sign(username, JWT_SECRET);
        res.json({
            message : token
        })
    }else{
        res.status(403).json({
            message : "User is not authenticated."
        })
    }
});

router.get('/courses', async(req, res) => {
    const courses = await Course.find({});
    res.json({
        message : courses
    });
    
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    const username = req.username;
    const courseId = req.params.courseId;

    const courses = await User.updateOne({
        username : username
    }, {
        "$push" : {
        purchasedCourses : courseId
    }
    });
    if(courses){
        res.json({
            message : "Course purchases successfully."
        })
    }else{
        res.json({
            message : "Course could not be purchases."
        })
    }
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    const username = req.username;
    const user = await User.findOne({
        username : username,
    });
    const courses = await Course.find({
        _id : {
            "$in" : user.purchasedCourses
        }
    });
    if (courses){
        res,json({
            message: courses
        })
    }else{
        res.status(403).json({
            message : "Something went wrong!!"
        })
    }

});

module.exports = router