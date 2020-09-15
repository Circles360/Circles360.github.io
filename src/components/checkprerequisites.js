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
        return(checkPrerequisiteUnits(node, elements, selectedNodes));
    }



    return true;

    // TODO: Check for corerequsiites and exclusion courses as well
    // TODO: Check for completion of units and core_year

    // Check if these nodes are enough to satisfy prerequisites
    // Get the prerequisite condition and replace courses by 1 if they have been
    // selected and 0 if they have not.
    

}

// Perform prerequisite check for units given the node to check, elements and all
// the selected nodes. Returns true/false
export function checkPrerequisiteUnits(node, elements, selectedNodes) {
    if (node.data.conditions.units_required !== null) {
        if (node.data.conditions.level_for_units_required === null) {
            // See if we meet the total for this course
            var total = 0;
            const target = node.data.conditions.units_required;
            console.log(selectedNodes);
            const selectedList = Object.keys(selectedNodes);
            for (const selected of selectedList) {
                if (selected === node.id) continue; // The node can't include itself
                const takenNode = getElement(selected, elements);
                total += takenNode.data.units;
            }

            if (total >= target) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
            // Only check specific level courses
        }
    } else if (node.data.conditions.core_year !== null) {
        return true;
    }

    return true;
}