// HELPER FUNCTION to toggle exclusion courses
// Will hide the current course and its edges, unhide the next course and edges
// in the queue. Finds new edges to show by regex substitution???
import { getConnectedEdges } from 'react-flow-renderer';
import getElement from './getelement.js';
import checkPrerequisites from './checkprerequisites.js';
import unselectNode from './unselectnode.js';

export default function exclusionSwap(node, elements, edges, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, exclusionGroups) {
    console.log("EXCLUSION SWAP");
    console.log(exclusionGroups);
    console.log(node.id);
    const newElements = [...elements];
    for (var group of exclusionGroups) {
        console.log("CHECKING", group);
        if (group.includes(node.id)) {
            console.log("FOUND THE EXCLUSION GROUP");
            console.log(group);

            // Move this to the back
            const prevCourse = group.shift();
            group.push(prevCourse);

            // Current course we need to display is now at front of queue
            const curCourse = group[0];

            console.log(prevCourse);
            console.log(curCourse);


            // Toggle the nodes themselves accordingly
            for (var e of elements) {
                if (e.id === prevCourse) {
                    console.log(e);
                    console.log("HIDING");
                    console.log(prevCourse);
                    e.isHidden = true;
                    console.log(e);
                } else if (e.id === curCourse) {
                    console.log(e);
                    console.log("REVEALING");
                    console.log(curCourse);
                    e.isHidden = false;
                    console.log(e);
                }
            }

            // Get all the edges of the previous course and hide all of them
            // Then use regex sub to determine the new edges to reveal
            // Transfer over selected, potential and hover edges
            var edgesList = getConnectedEdges([node], edges);
            //var newEdgesList = [];
            for (const hideEdge of edgesList) {
                for (const edge of newElements) {
                    if (hideEdge.id === edge.id) {
                        edge.isHidden = true;
                        console.log("HIDING", edge.id);

                        // Get the name of the new edge
                        var newEdge = hideEdge.id.replace(prevCourse, curCourse);
                        console.log("SHOWING", newEdge);

                        // Keep selected, potential and hover edges
                        if (selectedEdges.hasOwnProperty(hideEdge.id)) {
                            delete selectedEdges[hideEdge.id];
                            selectedEdges[newEdge] = 1;
                        }

                        if (potentialEdges.hasOwnProperty(hideEdge.id)) {
                            delete potentialEdges[hideEdge.id];
                            potentialEdges[newEdge] = 1;
                        }
                        
                        if (hoverEdges.hasOwnProperty(hideEdge.id)) {
                            delete hoverEdges[hideEdge.id];
                            hoverEdges[newEdge] = 1;
                        }

                        //newEdgesList.push(newEdge);
                        break;
                    }
                }
            }
            // Determine state of the nodes (E.g. COMP6441 can be selectable
            // whilst COMP6841 is not)
            var curNode = getElement(curCourse, elements);
            if (checkPrerequisites(curNode, selectedNodes)) {
                // The new node is selectable
                if (selectedNodes.hasOwnProperty(prevCourse)) {
                    delete selectedNodes[prevCourse];
                    selectedNodes[curCourse] = 1;
                } else if (selectableNodes.hasOwnProperty(prevCourse)) {
                    delete selectableNodes[prevCourse];
                    selectableNodes[curCourse] = 1;
                }
            } else {
                // The new node is not selectable
                // Unselect the original node
                unselectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            }         

            // For each edge, show it IF TARGET AND SOURCE ARE NOT HIDDEN
            // Will also show any additional edges
            // (Example: COMP6441, COMP6841. COMP6841 -> COMP6448 but COMP6441 does not)
            var newEdgesList = getConnectedEdges([curNode], edges);
            for (const newEdge of newEdgesList) {
                for (const edge of newElements) {
                    if (newEdge.id === edge.id) {
                        const sourceNode = getElement(edge.source, elements);
                        const targetNode = getElement(edge.target, elements);
                        if ((!sourceNode.isHidden) && (!targetNode.isHidden)) {
                            edge.isHidden = false;
                            
                            // If the new node is selected, make this edge blue
                            // Else, make this edge grey. Deals with differing edge
                            // cases COMP6441 and COMP6841
                            if (selectedNodes.hasOwnProperty(curCourse)) {
                                console.log("SELECTED");
                                console.log("ADDING " + edge.id);
                                potentialEdges[edge.id] = 1;
                            } else {
                                console.log("NOT SELECTED");
                                if (potentialEdges.hasOwnProperty(edge.id)) {
                                    delete potentialEdges[edge.id];
                                }
                            }
                        }
                        break;
                    }
                }
            }
   


            break;
        }
    }

    return newElements;
}