// Returns true if all prerequisites are met for a given node
// Returns false if prerequisites are not met for a given node
// Will only analyse targets of potential edges

import Course from "./degreeplanner-course";

import getElement from './getelement.js';

// NOTE: Assumes that source of potential edges are always selected
export default function checkPrerequisites(node, elements, selectedNodes) {
    if (node.data.conditions.prerequisites !== null && node.data.conditions.prereqs_executable !== null) {
        // Evaluate the condition
        //console.log("HERE");
        //console.log(node.data.conditions.prereqs_executable);
        var condition = node.data.conditions.prereqs_executable;
        //console.log(condition);
        condition = condition.replace(/[A-Z]{4}[A-Z0-9]+/gi, function(match) {
            //console.log(match);
            if (selectedNodes.hasOwnProperty(match)) {
                return 1;
            } else {
                return 0;
            }
        });
        if (eval(condition)) {
            return true;
        } else {
            return false;
        }
    } else {
        // Check if units required exists
        if (node.data.conditions.units_required !== null) {
            if (node.data.conditions.level_for_units_required === null) {
                //console.log("LEVEL FOR UNITS", node.id);
                // See if we meet the total for this course
                var total = 0;
                const target = node.data.conditions.units_required;
                const selectedList = Object.keys(selectedNodes);
                //console.log(selectedNodes);
                for (const selected of selectedList) {
                    //console.log(selected);
                    if (selected === node.id) continue; // The node can't include itself
                    
                    const node = getElement(selected, elements);
                    total += node.data.units;
                    //console.log(node.id + "=" + node.data.units);
                }

                if (total >= target) {
                    return true;
                } else {
                    return false;
                }
            }
        } else if (node.data.conditions.core_year !== null) {

        }
    }



    return true;

    // TODO: Check for corerequsiites and exclusion courses as well
    // TODO: Check for completion of units and core_year

    // Check if these nodes are enough to satisfy prerequisites
    // Get the prerequisite condition and replace courses by 1 if they have been
    // selected and 0 if they have not.
    

}


