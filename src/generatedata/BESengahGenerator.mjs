import { node1, node2, node_header} from '../styles/nodes.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const data = require("../webscraper/specialisations.json");
const courses = require("../webscraper/courses.json");
const position_data = require("../maps/EngineeringHonoursSoftware/position.json");

var courses_output = [];
var courses_list = {}; // Keeps track of courses in this degree for easier checking later on

// Colours a node accordingly
function colour_node(node) {
    if (node.id.match(/^COMP/)) node.style = {...node.style, background: '#66ca86'};
    else if (node.id.match(/^MATH/)) node.style = {...node.style, background: '#00a2e0'};
    else if (node.id.match(/^ENGG/)) node.style = {...node.style, background: '#ca300a'};
    else if (node.id.match(/^DESN/)) node.style = {...node.style, background: '#db8600'};
    else if (node.id.match(/^SENG/)) node.style = {...node.style, background: '#dece3e'};
    else if (node.id.match(/^ELEC/)) node.style = {...node.style, background: '#06493d'};
    else if (node.id.match(/^INFS/)) node.style = {...node.style, background: '#30b5ba'};
    else if (node.id.match(/^TELE/)) node.style = {...node.style, background: '#c79c46'};
    else if (node.id.match(/^x/)) {
        // Find the colour of one of its children
        var colour;
        for (var course of courses_output) {
            if (course.id === node.data.children[0]) {
                colour = course.style.background;
                break;
            }
        }
        node.style = {...node.style, borderColor: colour};
    }
}

// Returns list of node objects for courses fitting the "any" description
function any_course_finder(code, level) {
    var node_list = [];
    for (var course in courses) {
        if (course.match(code) && courses[course].course_level == level) {
            //console.log("FOUND " + course);
            node_list.push({
                id: course,
                type: 'custom1',
                data: courses[course],
                position: {x: 0, y: 0},
                // className: 'node1',
                style: node1,
                isHidden: false
            })
        }
    }
    
    return node_list;
}

// Get all the courses for software engineering
for (const course_group in data.SENGAH.structure) {
    // TEMPORARY FIX
    if (data.SENGAH.structure[course_group].courses === null) continue;

    for (const course of data.SENGAH.structure[course_group].courses) {
        //console.log(course);
        var node_list = [];

        if (Array.isArray(course)) {
            // Deal with choice courses (e.g. MATH1131/1141)
            for (const option of course) {
                node_list.push({
                    id: option,
                    type: 'custom1',
                    data: courses[option],
                    position: {x: 0, y: 0},
                    style: node1,
                    isHidden: false
                })
            }
        } else {
            // Normal course
            if (course.match(/^[A-Z]{4}[0-9]{4}$/)) {
                node_list.push({
                    id: course,
                    type: 'custom1',
                    data: courses[course],
                    position: {x: 0, y: 0},
                    style: node1,
                    isHidden: false
                })
            } else if (course.match(/^[A-Z]{4}[0-9]/)) {
                // Course levels
                // Get all courses which fit this criteria
                const level = course.match(/(\d)/)[1];
                //console.log(level);
                const code = course.match(/([A-Z]{4})/)[1];
                //console.log(code);
            
                node_list = any_course_finder(code, level);
            }
        }
        
        for (const node of node_list) {
            if (! courses_list.hasOwnProperty(node.id)) {
                // Colour and add the node if we have not added it before
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
        course.data.conditions.prerequisites = ['ENGG1000'];
        course.data.conditions.prereqs_executable = 'ENGG1000'
        for (const parent of courses_output) {
            if (parent.id === 'ENGG1000') {
                parent.data.unlocks.push('DESN2000');
                break;
            }
        }
        break;
    }
}
// ENGG1000-ENGG2600-ENGG3600-ENGG4600
// INFS3830 and INFS3873 prerequisites = 3603
// COMP4961 cannot be taken (not doing the right program)
for (const course of courses_output) {
    if (course.id === 'ENGG1000') {
        course.data.unlocks.push('ENGG2600');
    } else if (course.id === 'ENGG2600') {
        course.data.conditions.prerequisites = ['ENGG1000'];
        course.data.conditions.prereqs_executable = 'ENGG1000';
        course.data.unlocks = ['ENGG3600']
    } else if (course.id === 'ENGG3600') {
        course.data.conditions.prerequisites = ['ENGG2600'];
        course.data.conditions.prereqs_executable = 'ENGG2600';
        course.data.unlocks = ['ENGG4600'];
    } else if (course.id === 'ENGG4600') {
        course.data.conditions.prerequisites = ['ENGG3600'];
        course.data.conditions.prereqs_executable = 'ENGG3600';
    } else if (course.id === 'INFS3830') {
        course.data.conditions.prerequisites = ['INFS3603'];
        course.data.conditions.prereqs_executable = "INFS3603";
    } else if (course.id === 'INFS3873') {
        course.data.conditions.prerequisites = ['INFS3603'];
        course.data.conditions.prereqs_executable = "INFS3603";
    } else if (course.id === "COMP4961") {
        course.data.conditions.prerequisites = [];
        course.data.conditions.prereqs_executable = "0";
    }
}

// Go through the unlocks for each course and if it is not a node in our graph,
// delete it. If the array is empty, set it to null
for (var course of courses_output) {
    if (course.data.unlocks === null) continue;
    course.data.unlocks = course.data.unlocks.filter((unlockCourse) => {
        if (courses_list.hasOwnProperty(unlockCourse)) return unlockCourse;
    })

    if (course.data.unlocks.length === 0) {
        course.data.unlocks = null;
    }
}

// Add course header
courses_output.unshift({
    id: data.SENGAH.code,
    type: 'header1',
    data: {
        degree_name: data.SENGAH.name,
        degree_code: data.SENGAH.code,
        units: 0,
        unlocks: ['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1141'],
        conditions: {
            prerequisites: null,
            corequisites: null
        },
        exclusions: null,
        equivalents: null,
        desc: "Software Engineering is an Engineering profession concerned with the processes, methods, and tools for the design and development of high quality, reliable software systems."
    },
   // className: 'node_header',
    style: node_header,
    position: {x: 0, y: 0}
})
courses_output[0].style.background = '#7766ca';
courses_list['SENGAH'] = 1;



// Hard code in prerequisites for starting courses
for (var course of courses_output) {
    if (['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1141'].includes(course.id)) {
        console.log(course.id);
        course.data.conditions.prerequisites = ['SENGAH'];
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
var edges_output = [];
var edges_list = {};

for (const course of courses_output) {
    if (course.data.unlocks === null) continue;
    for (const child of course.data.unlocks) {
        if (courses_list.hasOwnProperty(child)) {
            var newEdge = {
                id: 'e' + course.id + '-' + child,
                source: course.id,
                target: child,
                type: 'straight',
                style: {opacity: 0.2, stroke: 'grey'},
                animated: false,
                isHidden: false
            }
            edges_list['e' + course.id + '-' + child] = 1;
            edges_output.push(newEdge);
        }
    }
}

console.log("====================");
// Generate exclusion course data
var exclusion_groups = []; // Holds all exclusion groups
var exclusion_list = {};  // Quick checking if we have already excluded this course
// Create exclusion nodes
for (var course of courses_output) {
    if (exclusion_list.hasOwnProperty(course.id)) continue; 
    if (course.data.exclusions === null) continue;

    var group = [];
    for (const exclusion of course.data.exclusions) {
        if (courses_list.hasOwnProperty(exclusion)) {
            // Create an exclusion course with this node as it exists in our program
            console.log(exclusion);
            exclusion_list[exclusion] = 1;
            group.push(exclusion);
        }
    }

    if (group.length > 0) {
        exclusion_list[course.id] = 1;
        group.unshift(course.id);
        exclusion_groups.push(group);
        console.log(course.id);
        console.log(course.data.exclusions);
        console.log("====================");
    }
}

console.log(exclusion_groups);

// set isHidden to true for the last exclusion course in each group and their edges
/*for (var group of exclusion_groups) {
    const last = group.pop();

    for (var course of courses_output) {
        if (last === course.id) {
            course.isHidden = true;
            
            // Get all the edges and hide them too
            for (var edge of edges_output) {
                if (edge.source === last || edge.target === last) {
                    console.log("hiding " + edge.id);
                    edge.isHidden = true;
                }
            }
            break;
        }
    }

    group.push(last);
}*/


// Get all the corequisites
for (const course of courses_output) {
    if (course.data.conditions.corequisites === null) continue;
    console.log(course.id);
    for (const corerequisite of course.data.conditions.corequisites) {
        console.log(corerequisite);
    }
    console.log("=============");
}



//console.log(edges_output);
const output = courses_output.concat(edges_output);

// Write to the file
const fs = require('fs');
fs.writeFile('../maps/EngineeringHonoursSoftware/data.json', JSON.stringify(output), (err) => {
    // In case of error
    if (err) throw err;
})

// Write exclusion data to another file
fs.writeFile('../maps/EngineeringHonoursSoftware/data_exclusion.json', JSON.stringify(exclusion_groups), (err) => {
    // In case of error
    if (err) throw err;
})