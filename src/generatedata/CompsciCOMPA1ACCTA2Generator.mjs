import { node1, node2, node_header, minor_header} from '../styles/nodes.mjs';
import { createRequire } from "module";


const require = createRequire(import.meta.url);
const {lightenHex} = require('./styleGenerator.js');

const data = require("../webscraper/specialisations.json");
const courses = require("../webscraper/courses.json");
const position_data = require("../maps/EngineeringHonoursSoftware/position.json");


var courses_output = [];
var courses_list = {};

function colour_node(node) {
    if (node.id.match(/^COMP/)) node.style = {...node.style, background: '#1EB13C', border: '2px solid #1EB13C'};
    else if (node.id.match(/^MATH/)) node.style = {...node.style, background: '#166DBA', border: '2px solid #166DBA'};
    else if (node.id.match(/^ENGG/)) node.style = {...node.style, background: '#CA1818', border: '2px solid #CA1818'};
    else if (node.id.match(/^ACCT/)) node.style = {...node.style, background: '#885533', border: '2px solid #885533'};
    else if (node.id.match(/^COMM/)) node.style = {...node.style, background: '#D3A437', border: '2px solid #D3A437'};
    else if (node.id.match(/^TABL/)) node.style = {...node.style, background: '#449A94', border: '2px solid #449A94'};
    
    node.textColour = node.style.background;
    node.textSelectedColour = 'white';
    node.selectableColour = lightenHex(node.style.background, 0.7);
    node.selectedColour = node.style.background;
    node.style.background = 'white';
}

// Returns list of node objects for courses fitting the "any" description
function any_course_finder(code, level) {
    var node_list = [];
    for (var course in courses) {
        if (course.match(code) && courses[course].course_level == level) {
            node_list.push({
                id: course,
                type: 'custom1',
                data: courses[course],
                position: {x: 0, y: 0},
                style: node1,
                isHidden: false
            })
        }
    }
    
    return node_list;
}

// Get the courses for COMPA1
for (const course_group in data.COMPA1.structure) {
    // TEMPORARY FIX
    if (data.COMPA1.structure[course_group].courses === null) continue;

    for (const course of data.COMPA1.structure[course_group].courses) {
        var node_list = [];
        if (Array.isArray(course)) {
            // Deal with choice courses (e.g. MATH1131/MATH1141)
            for (const option of course) {
                node_list.push({
                    id: option,
                    type: 'custom1',
                    data: courses[option],
                    position: {x: 0, y: 0},
                    style: node1,
                    isHidden: false
                });
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
                });
            } else if (course.match(/^[A-Z]{4}[0-9]/)) {
                // Course levels. Get all courses which fit this criteria
                const level = course.match(/(\d)/)[1];
                const code = course.match(/([A-Z]{4})/)[1];
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

// Get the courses for ACCTA2 Minor
for (const course_group in data.ACCTA2.structure) {
    // TEMPORARY FIX
    if (data.ACCTA2.structure[course_group].courses === null) continue;

    for (const course of data.ACCTA2.structure[course_group].courses) {
        var node_list = [];
        if (Array.isArray(course)) {
            // Deal with choice courses (e.g. MATH1131/MATH1141)
            for (const option of course) {
                node_list.push({
                    id: option,
                    type: 'custom1',
                    data: courses[option],
                    position: {x: 0, y: 0},
                    style: node1,
                    isHidden: false
                });
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
                });
            } else if (course.match(/^[A-Z]{4}[0-9]/)) {
                // Course levels. Get all courses which fit this criteria
                const level = course.match(/(\d)/)[1];
                const code = course.match(/([A-Z]{4})/)[1];
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




// ========== HARD CODE IN SPECIFIC REQUIREMENTS ==========
// ENGG2600-ENGG3600-ENGG4600 + 48 units
// COMM1140 available only in term 2 and 3
for (const course of courses_output) {
    if (course.id === 'ENGG2600') {
        course.data.unlocks = ['ENGG3600']
        course.data.conditions.units_required = 48;
    } else if (course.id === 'ENGG3600') {
        course.data.conditions.prerequisites = ['ENGG2600'];
        course.data.conditions.prereqs_executable = 'ENGG2600';
        course.data.unlocks = ['ENGG4600'];
        course.data.conditions.units_required = 48;
    } else if (course.id === 'ENGG4600') {
        course.data.conditions.prerequisites = ['ENGG3600'];
        course.data.conditions.prereqs_executable = 'ENGG3600';
        course.data.conditions.units_required = 48;
    } else if (course.id === 'COMM1140') {
        course.data.terms = ['Term 1', 'Term 2'];
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

// NEW: SORT THE TERMS IN ORDER for nicer display when hovering
// NEW: Cut off prerequisites at the front in "raw" so it looks nicer when displaying
for (var course of courses_output) {
    if (course.data.terms !== null) {
        //console.log(course.id + " SORTING TERMS " + course.data.terms);
        course.data.terms.sort();
        //console.log(course.data.terms);
    }
    if (course.data.conditions.raw !== null) {
        course.data.conditions.raw = course.data.conditions.raw.replace(/Pre-?requisite: /, "");
    }
}

// Add COMPA1 course header
courses_output.unshift({
    id: data.COMPA1.code,
    type: 'header1',
    data: {
        degree_name: data.COMPA1.name,
        degree_code: data.COMPA1.code,
        units: 0,
        unlocks: ['COMP1511', 'MATH1131', 'MATH1141'],
        conditions: {
            prerequisites: null,
            corequisites: null,
            units_required: null,
            level_for_units_required: null
        },
        exclusions: null,
        equivalents: null,
        desc: "This is the default plan for students in the 3778 BSc in Computer Science Program or in dual degrees involving Computer Science"
    },
   // className: 'node_header',
    style: node_header,
    textColour: 'black',
    textSelectedColour: 'black',
    selectedColour: 'lightgrey',
    selectableColour: 'black', // THIS SHOULD NEVER GET CALLED
    position: {x: 0, y: 0}
})
courses_output[0].style['border'] = '2px solid black';
courses_list['COMPA1'] = 1;
// Hard code in prerequisites for starting courses
for (var course of courses_output) {
    if (['COMP1511', 'MATH1131', 'MATH1141'].includes(course.id)) {
        console.log(course.id);
        course.data.conditions.prerequisites = ['COMPA1'];
    }
}

// Add ACCTA2 course header
courses_output.unshift({
    id: data.ACCTA2.code,
    type: 'header1',
    data: {
        degree_name: data.ACCTA2.name,
        degree_code: data.ACCTA2.code,
        units: 0,
        unlocks: ['COMM1140'],
        conditions: {
            prerequisites: null,
            corequisites: null,
            units_required: null,
            level_for_units_required: null
        },
        exclusions: null,
        equivalents: null,
        desc: "Accounting is concerned with the provision of information for the management of economic resources and activities by means of measurement, communication and interpretation of financial data; with the development of information systems; and with the financial accountability and management of business and public enterprises"
    },
   // className: 'node_header',
    style: node_header,
    textColour: '#885533',
    textSelectedColour: '#885533',
    selectedColour: 'lightgrey',
    selectableColour: 'black', // THIS SHOULD NEVER GET CALLED
    position: {x: 0, y: 0}
})
courses_output[0].style['border'] = '2px solid #885533';
courses_list['ACCTA2'] = 1;
// Hard code in prerequisites for starting courses
for (var course of courses_output) {
    if (['COMM1140'].includes(course.id)) {
        console.log(course.id);
        course.data.conditions.prerequisites = ['ACCTA2'];
    }
}
console.log(data.ACCTA2.name);

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
            //console.log(exclusion);
            exclusion_list[exclusion] = 1;
            group.push(exclusion);
        }
    }

    if (group.length > 0) {
        exclusion_list[course.id] = 1;
        group.unshift(course.id);
        exclusion_groups.push(group);
        //console.log(course.id);
        //console.log(course.data.exclusions);
        //console.log("====================");
    }
}
// For each course in exclusion groups, change their type to customnode2
for (const exclusion of Object.keys(exclusion_list)) {
    for (const course of courses_output) {
        if (course.id === exclusion) {
            course.type = "custom2";
        }
    }
}

// Get all the corequisites
for (const course of courses_output) {
    if (course.data.conditions.corequisites === null) continue;
    //console.log(course.id);
    for (const corerequisite of course.data.conditions.corequisites) {
        console.log(corerequisite);
    }
    //console.log("=============");
}
const output = courses_output.concat(edges_output);

//console.log(courses_output);

// Write to the file
const fs = require('fs');
fs.writeFile('../maps/ComputerScienceCOMPA1/data.json', JSON.stringify(output), (err) => {
    // In case of error
    if (err) throw err;
})

// Write exclusion data to another file
fs.writeFile('../maps/ComputerScienceCOMPA1/data_exclusion.json', JSON.stringify(exclusion_groups), (err) => {
    // In case of error
    if (err) throw err;
})