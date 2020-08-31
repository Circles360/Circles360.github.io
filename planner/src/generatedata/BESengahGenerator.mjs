import { node_66ca86, node_ca6f66, node_caa066, node_7766ca } from '../styles/nodes.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const data = require("../webscraper/engineering_degrees.json");
const courses = require("../webscraper/courses.json");
var courses_output = [];

var courses_list = []; // Keeps track of courses in this degree for easier checking later on

// Add course header
courses_list.push({
    id: data.SENGAH.degree_code,
    type: 'header1',
    data: {
        degree_name: data.SENGAH.degree_code,
        degree_code: data.SENGAH.degree_code,
        degree_units: data.SENGAH.degree_units,
        builds_into: ['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1081']
    },
    position: {x: 0, y: 0}
})

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
                node['style'] = node_66ca86;
            } else if (course_name.match(/MATH/)) {
                node['style'] = node_ca6f66;
            } else if (course_name.match(/SENGAH/)){
                node['style'] = node_7766ca;
            } else {
                node['style'] = node_caa066;
            }

            courses_output.push(node);
            courses_list[course_name] = 1;
        }
    }
}

//console.log(courses_output);

// Hard code in some specific requirements
// DESN2000 - add ENG1000 as prerequisite, add DESN3000 as child. Check term which SENGAH can take it in
/*for (var i in courses_output) {
    if (courses_output[i]['id'] == 'DESN2000') {
        courses_output[i]['data']['terms'] = 2;
        courses_output[i]['data']['builds_into'] = ['DESN3000'];
        courses_output[i].data.conditions.prerequisites = ['ENGG1000'];
    }
}*/

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


