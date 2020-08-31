import { node_green } from '../styles/nodes.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);


const data = require("../webscraper/engineering_degrees.json");
const courses = require("../webscraper/courses.json");
const output = [];

for (var course_group in data['SENGAH']['core_courses']) {
    for (var course in data['SENGAH']['core_courses'][course_group]) {
        var course_name = data['SENGAH']['core_courses'][course_group][course];
        if (course_group.match(/Core/)) {
            output.push({
                id: course_name,
                styles: node_green,
                type: 'custom',
                data: courses[course_name]
            })
        }
    }
}


console.log(output);