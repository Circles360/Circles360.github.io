// HELPER FUNCTION to determine which previously unselectable nodes
// are now selectable
export default function getSelectable(elements, selectedNodes, selectedEdges, seletableNodes, potentialEdges) {
    // Analyse the target of potential edges for potential nodes
    var analyseNodes = {};
    const potentialEdgesKeys = Object.keys(potentialEdges);
    for (var edge of potentialEdgesKeys) {
        // Get the target course
        const target = edge.split('-')[1];

        if ((! selectedNodes.hasOwnProperty(target)) && (! selectableNodes.hasOwnProperty(target))) {
            analyseNodes[edge.split('-')[1]] = 1;
        }
    }

    const analyseNodesKeys = Object.keys(analyseNodes);
    for (var node of analyseNodesKeys) {
        // Determine if the prerequisite has been met
        

        // IDEA ON HOW TO START: For each list, ensure at least one criteria has been
        // met. If the criteria is another list, go into it. Can push to queue or do recursive?
    }

}