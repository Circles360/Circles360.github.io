// HELPER FUNCTION to toggle exclusion courses
// Will hide the current course and its edges, unhide the next course and edges
// in the queue. Finds new edges to show by regex substitution???
import { getConnectedEdges } from 'react-flow-renderer';
import getElement from './getelement.js';
import checkPrerequisites from './checkprerequisites.js';
import unselectNode from './unselectnode.js';

export default function exclusionSwap(node, elements, edges, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, exclusionGroups) {
    /*console.log("EXCLUSION SWAP");
    console.log(exclusionGroups);
    console.log(node.id);*/
    const newElements = [...elements];
    for (var group of exclusionGroups) {
        //console.log("CHECKING", group);
        if (group.includes(node.id)) {
            //console.log("FOUND THE EXCLUSION GROUP");
            //console.log(group);

            // Move this to the back
            const prevCourse = group.shift();
            group.push(prevCourse);

            // Current course we need to display is now at front of queue
            const curCourse = group[0];

            //console.log(prevCourse);-
            //console.log(curCourse);


            // Toggle the nodes themselves accordingly
            for (var e of elements) {
                if (e.id === prevCourse) {
                    /*console.log(e);
                    console.log("HIDING");
                    console.log(prevCourse);*/
                    e.isHidden = true;
                    //console.log(e);
                } else if (e.id === curCourse) {
                    /*console.log(e);
                    console.log("REVEALING");
                    console.log(curCourse);*/
                    e.isHidden = false;
                    //console.log(e);
                }
            }

            // Determine state of the nodes (E.g. COMP6441 can be selectable
            // whilst COMP6841 is not)
            var curNode = getElement(curCourse, elements);
            if (checkPrerequisites(curNode, elements, selectedNodes)) {
                // The new node is selectable
                //console.log("================== SELECTABLE", curCourse);
                selectableNodes[curCourse] = 1;
                
                // Determine previous node condition
                if (selectedNodes.hasOwnProperty(prevCourse)) {
                    //console.log("PREVIOUS SELECTED", prevCourse);
                    delete selectedNodes[prevCourse];
                    delete selectableNodes[curCourse];
                    selectedNodes[curCourse] = 1;
                } else if (selectableNodes.hasOwnProperty(prevCourse)) {
                    //console.log("PREVIOUS SELECTABLE", prevCourse);
                    delete selectableNodes[prevCourse];
                }
            } else {
                // The new node is not selectable
                // Unselect the original node
                unselectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            }         

            // Get all the edges of the previous course and hide all of them
            // Then use regex sub to determine the new edges to reveal
            // Transfer over selected, potential and hover edges if they are in newedgeslist
            var edgesList = getConnectedEdges([node], edges);
            var newEdgesList = getConnectedEdges([curNode], edges);
            var edgesIds = [];
            var newEdgesIds = [];
            for (const edge of edgesList) {
                edgesIds.push(edge.id);
            }
            for (const newEdge of newEdgesList) {
                newEdgesIds.push(newEdge.id);
            }        

            // Stores all the common edges
            var checkedEdges = [];

            // Go through each edge we need to hide and check what we should do
            // with the edge in hideEdgesList
            for (const edge of edgesList) {
                var hideEdge = getElement(edge.id, elements);
                hideEdge.isHidden = true;
                var newEdgeId = hideEdge.id.replace(prevCourse, curCourse);
                if (getElement(newEdgeId, edges) !== null) {
                    checkedEdges.push(newEdgeId);
                } 

                // If selected, unselect it
                if (selectedEdges.hasOwnProperty(hideEdge.id)) {
                    delete selectedEdges[hideEdge.id];
                    if (newEdgesIds.includes(newEdgeId)) {
                        // This is in the newEdges list. Transfer the edge property
                        selectedEdges[newEdgeId] = 1;
                    }
                }

                // If potential, unpotential it
                if (potentialEdges.hasOwnProperty(hideEdge.id)) {
                    delete potentialEdges[hideEdge.id];
                    if (newEdgesIds.includes(newEdgeId)) {
                        // This is in the newEdges list. Transfer the edge property
                        potentialEdges[newEdgeId] = 1;
                    }
                }

                // If hover, unhover it
                if (hoverEdges.hasOwnProperty(hideEdge.id)) {
                    delete hoverEdges[hideEdge.id];
                    if (newEdgesIds.includes(newEdgeId)) {
                        // This is in the newEdges list. Transfer the edge property
                        hoverEdges[newEdgeId] = 1;
                    }
                }
            }
            
            //console.log("CHECKED EDGES", checkedEdges);
            
            for (const edge of edgesIds) {
                const newEdgeId = edge.replace(prevCourse, curCourse);
                if (! checkedEdges.includes(newEdgeId)) {
                    // Old edge which has not been transferred to new edge.
                    // Deal with the TARGET NODE SELECTABILITY right here
                    var target = newEdgeId.split('-')[1];
                    //console.log("CHECKING", newEdgeId);
                    //console.log("TARGET IS", target);
                    // Note that we cannot use newEdge.target as this edge
                    // DOES NOT EXIST ( i think )

                    // TODO: TEMPORARY FIX. Make sure target is not current course
                    if (target === curCourse) continue;

                    if (selectableNodes.hasOwnProperty(target)) {
                        //console.log("Deleting " + target);
                        delete selectableNodes[target];
                    }
                }
            }

            // For each edge, show it IF TARGET AND SOURCE ARE NOT HIDDEN
            // Will also show any additional edges
            // (Example: COMP6441, COMP6841. COMP6841 -> COMP6448 but COMP6441 does not)
            for (const newEdge of newEdgesList) {
                var edge = getElement(newEdge.id, elements);
                const sourceNode = getElement(edge.source, elements);
                const targetNode = getElement(edge.target, elements);
                if ((!sourceNode.isHidden) && (!targetNode.isHidden)) {
                    // Show the edge if both nodes are not hidden
                    edge.isHidden = false;    
                }

                // Determine if this edge has been checked before
                if (checkedEdges.includes(newEdge.id)) {
                    // It has been checked before
                    // TODO: THIS CAN BREAK if both nodes have same edges
                    // but one has an additional prerequisite??????
                    continue;
                } else {
                    //console.log(newEdge.id + " NOT BEEN CHECKED BEFORE")
                    // It has NOT been checked before
                    if (selectedNodes.hasOwnProperty(curCourse)) {
                        //console.log(curCourse + " was previously selected");
                        
                        if (sourceNode.id === curCourse) {
                            // Reveal node is selected and source of edge. Make potential edge.
                            potentialEdges[newEdge.id] = 1;
                            // Check if the target node is selectable
                            if (! selectableNodes.hasOwnProperty(edge.target)) {
                                if (checkPrerequisites(targetNode, elements, selectedNodes)) {
                                    //console.log(edge.target + " DOES MEET PREREQS");
                                    selectableNodes[targetNode.id] = 1;
                                } else {
                                    //console.log(edge.target + " DOES NOT MEET PREREQS");
                                }
                            }
                        } else {
                            // Reveal node is selected and target of edge. Check previous edges/nodes
                            if (curNode.data.conditions.prerequisites !== null) {
                                for (const prereq of curNode.data.conditions.prerequisites) {
                                    if (selectedNodes.hasOwnProperty(prereq)) {
                                        // This node was selected. Make the edge selected
                                        if (potentialEdges.hasOwnProperty('e' + prereq + '-' + curCourse)) delete potentialEdges['e' + prereq + '-' + curCourse];
                                        selectedEdges['e' + prereq + '-' + curCourse] = 1;
                                    } else {
                                        // This node was not selected. Make sure the edge is unselected
                                        if (potentialEdges.hasOwnProperty('e' + prereq + '-' + curCourse)) delete potentialEdges['e' + prereq + '-' + curCourse];
                                        if (selectedEdges.hasOwnProperty('e' + prereq + '-' + curCourse)) delete selectedEdges['e' + prereq + '-' + curCourse];
                                    }
                                }
                            }
                        }
                    } else {
                        //console.log(curCourse + " was not previously selected")
                        // The node was not selected before. Delete any potential edges
                        // Make target node unselectable if prereqs are not met
                        if (potentialEdges.hasOwnProperty(edge.id)) {
                            //console.log("DELETING " + edge.id);
                            delete potentialEdges[edge.id];
                            if (selectableNodes.hasOwnProperty(edge.target)) {
                                //console.log(edge.target + " WAS SELECTABLE")
                                if (! checkPrerequisites(targetNode, elements, selectedNodes)) {
                                    //console.log(edge.target + " DOES NOT MEET PREREQS");
                                    delete selectableNodes[targetNode.id];
                                }
                            }
                        }
                    }
                }
            }

            break;
        }
    }

    return newElements;
}