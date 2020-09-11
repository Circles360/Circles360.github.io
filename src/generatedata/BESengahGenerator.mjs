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
                style: node1
            })
        }
    }
    
    return node_list;
}

// Recursive function to delete irreleavnt prerequisites from a given
// prerequisites array
/*function getRelevantPrereq(array) {
    var to_remove = [];
    for (var child of array) {
        //console.log("CHECKING", child);
        if (Array.isArray(child)) {
            getRelevantPrereq(child);
        } else {
            // Remove the child if it is not in our program
            if (! courses_list.hasOwnProperty(child)) {
                to_remove.push(child);
            }
        }
    }

    for (var r of to_remove) {
        console.log(array);
        var index = array.indexOf(r);
        array.splice(index, 1);
        console.log(r);
        console.log(index);
        console.log("REMOVED", r);
        console.log(array);
    }
    return array;
}*/

// TODO:
// Given an exclusion node and one of its child nodes, go into that child node
// and replace mentions of their children in unlocks with themselves
/*function alterPrerequisites(exclusion_node, child) {
    for (var course in courses_output) {

    }
}

// Given an exclusion node, goes through all the nodes and alters their
// prerequisites and unlocks to point to the exclusion node instead.
function substitute_exclusion_group(exclusion_node) {
    for (var course of courses_output) {
        if (exclusion_node.data.children.includes(course.id)) {
            // For each course in prerequisite, alter unlocks
            // For each course in unlocks, alter prerequisite
            const all_prereqs = course.data.conditions.prerequisites.flat(Infinity);
            for (const prereq of all_prereqs) {
                alterPrerequisites(exclusion_node, prereq);
            }
            alterPrerequisites()
            alterUnlocks()
            for (var prereq in courses_output) {
                if (course.data.conditions.prerequisites.includes(prereq.data))
            }

            // Break after one because we assume exclusion courses are essentially identical in the degree
            break;
        }
    }
}*/


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
        course.data.conditions.prerequisites = [['ENGG1000']];
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
// INFS3830 prerequisites = 3603
for (const course of courses_output) {
    if (course.id === 'ENGG1000') {
        course.data.unlocks.push('ENGG2600');
    } else if (course.id === 'ENGG2600') {
        course.data.conditions.prerequisites = [['ENGG1000']];
        course.data.unlocks = ['ENGG3600']
    } else if (course.id === 'ENGG3600') {
        course.data.conditions.prerequisites = [['ENGG2600']];
        course.data.unlocks = ['ENGG4600'];
    } else if (course.id === 'ENGG4600') {
        course.data.conditions.prerequisites = [['ENGG3600']];
    } else if (course.id === 'INFS3830') {
        course.data.conditions.prerequisites = ['INFS3603'];
        course.data.conditions.prereqs_executable = "INFS3603";
    } else if (course.id === 'INFS3873') {
        course.data.conditions.prerequisites = ['INFS3603'];
        course.data.conditions.prereqs_executable = "INFS3603";
    }
}





// Go through all courses and alter prerequisites/unlocks to only contain courses
// in the degree. For free electives, we will refer back to the courses.json file.
/*for (var course of courses_output) {
    console.log(course.id);
    console.log(course.data.conditions.prerequisites);
    if (course.data.conditions.prerequisites !== null) {
        course.data.conditions.prerequisites = getRelevantPrereq(course.data.conditions.prerequisites);
    }
    console.log("========================================================");
    console.log(course.data.conditions.prerequisites);
    console.log("========================================================");

    // Store the unlock if it is in our degree
    if (course.data.unlocks !== null) {
        course.data.unlocks = course.data.unlocks.filter(item => courses_list.hasOwnProperty(item));
    }
}*/


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




// Create encapsulating nodes for exclusion courses
var exclusion_groups = []; // Holds all exclusion groups
var exclusion_list = {};  // Quick checking if we have already excluded this course
/*console.log("===========================================");
for (var course of courses_output) {
    if (course.data.exclusions === null) continue;
    if (exclusion_list.hasOwnProperty(course.id)) continue;

    //console.log(course.id);
    //console.log(course.data.exclusions);
    // Get all courses in our program which it excludes
    var exclusion_courses = [];
    for (var exclude of course.data.exclusions) {
        if (!courses_list.hasOwnProperty(exclude)) continue;
        exclusion_courses.push(exclude);
        exclusion_list[exclude] = 1;
    }

    // Check if we found any exclusion courses
    if (exclusion_courses.length === 0) continue;
    exclusion_courses.push(course.id);
    exclusion_groups.push(exclusion_courses);
    exclusion_list[course.id] = 1;
}*/

//console.log(exclusion_groups);

/*var exclusion_nodes = []; // Contains exclusion group nodes for easier checking
for (var group of exclusion_groups) {
    // Create an exclusion node
    var e = {
        id: 'x' + group.join('or'),
        type: 'custom2',
        data: {
            id: 'x' + group.join('or'),
            children: [],
            terms: [],
            conditions: null,
            unlocks: [],
        },
        position: {x: 0, y: 0},
        style: node2
    }
    
    for (var course of group) {
        e.data.children.push(course);
    }

    // Assuming that the conditions for exclusions courses are the same
    e.data.conditions = courses[group[0]].conditions;
    e.data.terms = courses[group[0]].terms;
    e.data.unlocks = courses[group[0]].unlocks;

    colour_node(e);

    //console.log(e);
    courses_output.push(e);
    exclusion_nodes.push(e);
}*/




// Add course header
courses_output.unshift({
    id: data.SENGAH.code,
    type: 'header1',
    data: {
        degree_name: data.SENGAH.name,
        degree_code: data.SENGAH.code,
        units: data.SENGAH.units,
        unlocks: ['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1141', 'MATH1081'],
        conditions: {
            prerequisites: null,
            corequisites: null
        },
        exclusions: null,
        equivalents: null,
    },
   // className: 'node_header',
    style: node_header,
    position: {x: 0, y: 0}
})
courses_output[0].style.background = '#7766ca';
courses_list['SENGAH'] = 1;



// Hard code in prerequisites for starting courses
for (var course of courses_output) {
    if (['COMP1511', 'ENGG1000', 'MATH1131', 'MATH1141', 'MATH1081'].includes(course.id)) {
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
    // Do not generate for individual grouped exclusion nodes
    if (exclusion_list.hasOwnProperty(course.id)) continue;

    // Find the children
    if (course.data.unlocks === null) {
        continue;
    }

    for (const child of course.data.unlocks) {
        if (courses_list.hasOwnProperty(child)) {
            var new_edge = {
                source: course.id,
                type: 'straight',
                style: {opacity: 0.20, stroke: 'grey'},
                animated: false
            }
            if (exclusion_list.hasOwnProperty(child)) {
                // This is part of an exclusion group. Connect the group nodes
                // to each other instead.
                /*for (var group of exclusion_nodes) {
                    // Add the edge if it hasn't been added.
                    if (group.data.children.includes(child)) {
                        if (! edges_list.hasOwnProperty('e' + course.id + '-' + group.id)) {
                            new_edge.id = 'e' + course.id + '-' + group.id;
                            new_edge.target = group.id;
                            edges_output.push(new_edge);
                            edges_list[new_edge.id] = 1;
                        }


                        break;
                    }
                }*/
            } else {
                // Not part of an exclusion group. Normal node to normal node edge.
                if ( edges_list.hasOwnProperty('e' + course.id + '-' + child)) continue;
                new_edge.id = 'e' + course.id + '-' + child;
                new_edge.target = child;
                edges_output.push(new_edge);
                edges_list[new_edge.id] = 1;
            }
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
