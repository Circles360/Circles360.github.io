// HELPER FUNCTION to find prerequisites
// Will adjust the selectedNodes and seletecdEdges dictionaries appropriately
export default function getPrerequisites(elements, node, selectedNodes, selectedEdges) {
    // ==============================================
    // ========== CLICKING A SELECTED NODE ==========
    // ==============================================
    if (selectedNodes.hasOwnProperty(node.id)) {
        var unselectQueue = [node.id];

        console.log("=====================", selectedEdges);
        // Unselect nodes and their prereqs 1 layer down. Push their selected children 
        // to unselect queue. Repeat process until queue is empty. This will unselect
        // nodes which were previously dependant on this node. 
        // TODO: THAT WE NEED TO DEAL WITH "OR" CONDITIONS.
        while (unselectQueue.length !== 0) {
            var current = getElement(unselectQueue.shift(), elements);
            unselectHelper(current, unselectQueue, selectedNodes, selectedEdges);
        }

        return;
    }

    // =================================================
    // ========== CLICKING AN UNSELECTED NODE ==========
    // =================================================
    selectedNodes[node.id] = 1;

    // Build a path of prerequisites until it hits a selected node
    if (node.data.conditions.prerequisites === null) return;
    var parentList = [];

    var flat_prereqs = node.data.conditions.prerequisites.flat(Infinity);
    for (var prereq of flat_prereqs) {
        // Highlight this edge
        selectedEdges['e' + prereq + '-' + node.id] = 1;

        // Do not add to queue if the prereq is a selected node
        if (selectedNodes.hasOwnProperty(prereq)) continue;
        selectedNodes[prereq] = 1;

        parentList.push(prereq);
    }

    // Keep adding prerequisites until we hit selected nodes. Go until
    // parentList is empty
    while (parentList.length !== 0) {
        var current = getElement(parentList.shift(), elements);
        
        // Do not bother exploring if this node has been selected or has no prereqs
        if (selectedNodes.hasOwnProperty(current)) continue;
        if (current.data.conditions.prerequisites === null) continue;

        var flat_prereqs = current.data.conditions.prerequisites.flat(Infinity);
        for (var prereq of flat_prereqs) {
            selectedEdges['e' + prereq + '-' + current.id] = 1;

            // Do not add to queue if prereq is a selected node
            if (selectedNodes.hasOwnProperty(prereq)) continue;
            selectedNodes[prereq] = 1;

            // Select the node
            parentList.push(prereq);
        }
    }

    return;
}

// Helper function to unselect a node. Will unhighlight all prereqs 1 layer down
// Will also push selected children onto a queue
const unselectHelper = (node, unselectQueue, selectedNodes, selectedEdges) => {
    delete selectedNodes[node.id]

    // Unselect prereq edges 1 layer down
    if (node.data.conditions.prerequisites !== null) {
        var flat_prereqs = node.data.conditions.prerequisites.flat(Infinity);
        for (var prereq of flat_prereqs) {
            console.log("Checking", 'e' + prereq + '-' + node.id);
            if (selectedEdges.hasOwnProperty('e' + prereq + '-' + node.id)) {
                console.log("SELECTED", prereq);
                delete selectedEdges['e' + prereq + '-' + node.id];
            }
        }
    }

    // Push selected unlocks onto queue
    if (node.data.unlocks === null) return;
    for (var child of node.data.unlocks) {
        if (selectedNodes.hasOwnProperty(child)) unselectQueue.push(child);
    }

    return;
}


// Given an id, returns the element
const getElement = (id, elementsData) => {
    for (var e of elementsData) {
        if (e.id === id) {
            return e;
        }
    }
    return null;
}