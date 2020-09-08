// Helper function for showing prerequisites
// Will show the prerequisites until the furthest selected node
export default function showPrerequisites(elements, node, selectedNodes, nodesData) {
    // Only works when clicking an unselected node
    if (selectedNodes.hasOwnProperty(node.id)) return elements;
    if (node.data.conditions.prerequisites === null) return elements;

    // Build a path of prerequisites until it hits a selected node.
    var changeEdges = {}; // List of edges we will change
    var parentList = []; // List of parents

    // TODO: Check how it deals with exclusions??? Maybe deal with in generator

    var flat_prereqs = node.data.conditions.prerequisites.flat(Infinity);
    for (var prereq of flat_prereqs) {
        // Highlight this edge
        changeEdges['e' + prereq + '-' + node.id] = 1;
        
        // Do not add to queue if the prereq is a selected node
        if (selectedNodes.hasOwnProperty(prereq)) continue;
        selectedNodes[prereq] = 1;

        parentList.push(prereq);
    }

    // Keep adding prerequisites until we hit selected nodes. Go until
    // parentList is empty
    while (parentList.length !== 0) {
        var current = getElement(parentList.shift(), nodesData);
        
        // Do not bother exploring if this node has been selected or has no prereqs
        if (selectedNodes.hasOwnProperty(current)) continue;
        if (current.data.conditions.prerequisites === null) continue;

        var flat_prereqs = current.data.conditions.prerequisites.flat(Infinity);
        for (var prereq of flat_prereqs) {
            changeEdges['e' + prereq + '-' + current.id] = 1;

            // Do not add to queue if prereq is a selected node
            if (selectedNodes.hasOwnProperty(prereq)) continue;
            selectedNodes[prereq] = 1;

            // Select the node
            parentList.push(prereq);
        }
    }

    
    // For each edge, highlight it for now
    const newElements = elements.map((e) => {
        if (changeEdges.hasOwnProperty(e.id)) {
            console.log("HI", e.style.stroke);
            if (e.style.stroke === 'grey') {
                console.log("Changed to red");
                return {...e, style: {...e.style, stroke: 'red', opacity: 1}, animated: true};
            } else if (e.style.stroke === 'red') {
                return {...e, style: {...e.style, stroke: 'grey', opacity: 0.2}, animated: false};
            }
        }
        return e;
    })
    
    return newElements;
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