import { node1, node_header} from '../styles/nodes.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const data = require("../webscraper/engineering_degrees.json");
const courses = require("../webscraper/courses.json");
const position_data = require("../maps/EngineeringHonoursSoftware/position.json");

var courses_output = [];
var courses_list = []; // Keeps track of courses in this degree for easier checking later on

// Add course header
courses_output.push({
    id: data.SENGAH.degree_code,
    type: 'header1',
    data: {
        degree_name: data.SENGAH.degree_name,
        degree_code: data.SENGAH.degree_code,
        degree_units: data.SENGAH.degree_units,
        builds_into: ['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1081']
    },
    style: node_header,
    position: {x: 0, y: 0}
})

courses_output[0].style.background = '#7766ca';


// Get all the courses for software engineering
/*for (var course_group in data['SENGAH']['core_courses']) {
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
            } else {
                node['style'] = node_caa066;
            }

            courses_output.push(node);
            courses_list[course_name] = 1;
        }
    }
}*/

// Colours a node accordingly
function colour_node(node) {
    if (node.id.match(/COMP/)) node.style = {...node.style, background: '#66ca86'};
    else if (node.id.match(/MATH/)) node.style = {...node.style, background: '#00a2e0'};
    else if (node.id.match(/ENGG/)) node.style = {...node.style, background: '#ca300a'};
    else if (node.id.match(/DESN/)) node.style = {...node.style, background: '#db8600'};
    else if (node.id.match(/SENG/)) node.style = {...node.style, background: '#dece3e'};
    else if (node.id.match(/ELEC/)) node.style = {...node.style, background: '#06493d'};
    else if (node.id.match(/INFS/)) node.style = {...node.style, background: '#30b5ba'};
    else if (node.id.match(/TELE/)) node.style = {...node.style, background: '#c79c46'};
}

// Returns list of node objects for courses fitting the "any" description
function any_course_finder(code, level) {
    var node_list = [];
    for (var course in courses) {
        if (course.match(code) && courses[course].course_level == level) {
            console.log("FOUND " + course);
            node_list.push({
                id: course,
                type: 'custom1',
                data: courses[course],
                position: {x: 0, y: 0},
                style: node1
            })
        }
    }
    return node_list;
}



// Get all the courses for software engineering
for (const course_group in data.SENGAH.core_courses) {
    //console.log(course_group);
    //console.log(data.SENGAH.core_courses);
    for (const course of data.SENGAH.core_courses[course_group]) {
        var node_list = [];
        if (course.match(/^[A-Z]{4}[0-9]{4}$/)) {
            var node = {
                id: course,
                type: 'custom1',
                data: courses[course],
                position: {x: 0, y: 0},
                style: node1,
            }
            node_list.push(node);
        } else if (course.match(/^any level/)) {
            //console.log(course);
            // Get all courses which fit this criteria
            const level = course.match(/any level (\d)/)[1];
            console.log(level);
            const course_type = course.match(/any level \d (.*) course/)[1];
            var code;

            // Temporary hard code fix for now
            if (course_type === 'Computer Science') code = 'COMP';
            else if (course_type === 'Electrical Engineering') code = 'ELEC';
            else if (course_type === 'Information Systems') code = 'INFS';
            else if (course_type === 'Mathematics') code = 'MATH';
            else if (course_type === 'Telecommunications') code = 'TELE';

            node_list = any_course_finder(code, level);
        }
        
        for (const node of node_list) {
            //console.log(courses_list[node])
            if (!courses_list[node.id]) {
                // Colour and add the node if we have not added it before
                console.log("ADDING " + node.id);
                colour_node(node);
                courses_list[node.id] = 1;
                courses_output.push(node);
            }
        }
    }
}


// Hard code in some specific requirements
// DESN2000 - add ENG1000 as prerequisite. Check term which SENGAH can take it in
for (const course of courses_output) {
    if (course.id === 'DESN2000') {
        //console.log(course);
        course.data.terms = ['Term 2'];
        course.data.conditions.prerequisites = [['ENGG1000']];
        for (const parent of courses_output) {
            if (parent.id === 'ENGG1000') {
                parent.data.builds_into.push('DESN2000');
                break;
            }
        }
        break;
    }
}



// Generate the position for each node
for (const node of position_data) {
    //console.log(node);
    for (const course of courses_output) {
        if (node.id === course.id) {
            course.position.x = node.position.x;
            course.position.y = node.position.y;
            break;
        }
    }
}

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


