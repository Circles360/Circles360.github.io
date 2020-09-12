// Returns true if all prerequisites are met for a given node
// Returns false if prerequisites are not met for a given node
// Will only analyse targets of potential edges
// NOTE: Assumes that source of potential edges are always selected
export default function checkPrerequisites(node, selectedNodes) {
    if (node.data.conditions.prerequisites === null) return true;
    if (node.data.conditions.prereqs_executable === null) return true;

    // TODO: Check for corerequsiites and exclusion courses as well

    // Check if these nodes are enough to satisfy prerequisites
    // Get the prerequisite condition and replace courses by 1 if they have been
    // selected and 0 if they have not.
    
    console.log(node.id);
    var condition = node.data.conditions.prereqs_executable;
    condition = condition.replace(/[A-Z]{4}[0-9]{4}/gi, function(match) {
        if (selectedNodes.hasOwnProperty(match)) return 1;
        else return 0;
    })

    console.log(condition);
    if (eval(condition)) {
        return true;
    } else {
        return false;
    }
}


