const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const {JWT_SECRET} = require("../config");
const router = Router();
const jwt = require("jsonwebtoken")

// Admin Routes
router.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const response = await Admin.create({
        username,
        password
    });
    res.json({
        message : "Admin created successfully."
    });
    
});

router.post('/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const isUserPresent = await Admin.findOne({
        username : username,
        password : password
    });
    if (isUserPresent){
        const token = jwt.sign(username, JWT_SECRET);
        res.json({
            message : token
        })
    }else{
        res.json({
            message : "Wrong username/password."
        })
    }
    
});

router.post('/courses', adminMiddleware, async(req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink

    });
    res.json({
        message : "Course created successfully.",
        course_id : newCourse._id
    })
    
    
    
});

router.get('/courses', adminMiddleware, async(req, res) => {
    const courses = await Course.find({});
    res.json({
        message : courses
    });
});

module.exports = router;






