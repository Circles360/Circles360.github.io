// HELPER FUNCTION for selecting and unselecting nodes
// Given a selectable node, pushes onto selected array and then highlights
// potential edges and fills in prereq edges
// Given an unselectable node, deals with it
export default function selectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    if (selectableNodes.hasOwnProperty(node.id)) {
        // SELECT THIS NODE
        selectedNodes[node.id] = 1;
        delete selectableNodes[node.id];

        // Turn its prerequisite potential edges into actual edges
        // Keep grey edges as grey
        if (node.data.conditions.prerequisites !== null) {
            var flatPrereqs = node.data.conditions.prerequisites.flat(Infinity);
            for (const prereq of flatPrereqs) {
                if (potentialEdges.hasOwnProperty('e' + prereq + '-' + node.id)) {
                    selectedEdges['e' + prereq + '-' + node.id] = 1;
                    delete potentialEdges['e' + prereq + '-' + node.id];
                }
            }
        }

        // Unlock its future edges
        if (node.data.unlocks !== null) {
            for (const unlockCourse of node.data.unlocks) {
                // Edges from node to unlocks should be unselected
                if (selectedNodes.hasOwnProperty(unlockCourse)) {
                    // This course is already selected. Make the edge a selected edge
                    selectedEdges['e' + node.id + '-' + unlockCourse] = 1;
                } else {
                    // This course is either unselected or selectable
                    // In either case, add potential edge
                    potentialEdges['e' + node.id + '-' + unlockCourse] = 1;
                }
            }            
        }
    } else {
        var unselectQueue = [node.id];
        while (unselectQueue.length !== 0) {
            var current = getElement(unselectQueue.shift(), elements);
            unselectHelper(current, unselectQueue, selectedNodes, selectedEdges);
        }
        
    }

    return;
}

// Helper function to deal with unselecting a node and adjusting its parent's 
// edges and selectability status
const unselectHelper = (node, unselectQueue, selectedNodes, selectedEdges, selectableNodes, potentialEdges) => {
    // For 1 layer prerequisites, turn selected edges into potential edges. Keep grey edges as grey
    if (node.data.conditions.prerequisites !== null) {
        var flatPrereqs = node.data.conditions.prerequisites.flat(Infinity);
        for (const prereq of flatPrereqs) {
            if (selectedEdges.hasOwnProperty('e' + prereq + '-' + node.id)) {
                // Turn selected edge into potential edge
                potentialEdges['e' + prereq + '-' + node.id] = 1;
                delete selectedEdges['e' + prereq + '-' + node.id];
            }
        }
    }


    // Determine if this node meets prerequisites by checking potential edges
    // If it does, make it selectable. If it doesn't make it unselectable


    if (node.data.unlocks !== null) {
        for (var unlockCourse of node.data.unlocks) {
            // Push its selectable and selected unlocks onto the queue
            if (selectedNodes.hasOwnProperty(unlockCourse) || selectableNodes.hasOwnProperty(unlockCourse)) {
                unselectQueue.push(unlockCourse);
            } else {
                // If the unlock is not selected at all, turn potential edge into grey edge if exists
                // NOTE: If the unlock is non-selected, the edge CANNOT be red
                if (potentialEdges.hasOwnProperty('e' + node.id + '-' + unlockCourse)) {
                    delete potentialEdges.hasOwnProperty('e' + node.id + '-' + unlockCourse);
                }
            }
        }
    }

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