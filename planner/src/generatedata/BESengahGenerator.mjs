import { node_74b8cc, node_66ca86, node_ffad1f } from '../styles/nodes.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const data = require("../webscraper/engineering_degrees.json");
const courses = require("../webscraper/courses.json");
var courses_output = [];

var courses_list = {}; // Keeps track of courses in this degree for easier checking later on

// Get all the courses for software engineering
for (var course_group in data['SENGAH']['core_courses']) {
    for (var course in data['SENGAH']['core_courses'][course_group]) {
        var course_name = data['SENGAH']['core_courses'][course_group][course];
        if (course_group.match(/Core/)) {
            const node = {
                id: course_name,
                type: 'custom1',
                data: courses[course_name],
                position: {x: 0, y: 0}
            }
            
            if (course_name.match(/COMP/)) {
                node['style'] = node_74b8cc;
            } else if (course_name.match(/MATH/)) {
                node['style'] = node_66ca86;
            } else {
                node['style'] = node_ffad1f;
            }

            courses_output.push(node);
            courses_list[course_name] = 1;
        }
    }
}

console.log(courses_output);

// Generate the edges
var n_courses = courses_output.length;
var edges_output = [];
for (var i = 0; i < n_courses; i++) {
    // Find the children
    if (courses_output[i]['data']['builds_into'] == null) {
        continue;
    }

    var n_children = courses_output[i]['data']['builds_into'].length;
    for (var j = 0; j < n_children; j++) {
        // Do not create the edge if the child course does not exist in our degree
        if (courses_output[i]['data']['builds_into'][j] in courses_list) {
            edges_output.push({
                id: 'e' + courses_output[i]['id'] + '-' + courses_output[i]['data']['builds_into'][j],
                source: courses_output[i]['id'],
                target: courses_output[i]['data']['builds_into'][j],
                type: 'default',
                animated: false,
                arrowHeadType: 'arrowclosed'
            })
        }
    }
}


//console.log(edges_output);
const output = courses_output.concat(edges_output);

// Write to the file
const fs = require('fs');
fs.writeFile('../maps/EngineeringHonoursSoftware/data.json', JSON.stringify(output), (err) => {
    // In case of error
    if (err) throw err;
})
