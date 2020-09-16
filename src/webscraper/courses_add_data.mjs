import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const coursesJSON = require("./courses.json");
var newCourses = {};

const courses = Object.keys(coursesJSON);

for (const course of courses) {
    //console.log(course);
    newCourses[course] = {
        "data": coursesJSON[course],
    };
    console.log(newCourses[course]);
}


const fs = require('fs');
fs.writeFile('./courses_with_data.json', JSON.stringify(newCourses), (err) => {
    // In case of error
    if (err) throw err;
})