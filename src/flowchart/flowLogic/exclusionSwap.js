// HELPER FUNCTION to toggle exclusion courses
// Will hide the current course and its edges, unhide the next course and edges
// in the queue. Finds new edges to show by regex substitution???
import { getConnectedEdges } from 'react-flow-renderer';
import getElement from '../flowHelper/getElement';
import checkPrerequisites from './checkPrerequisites.js';
import unselectNode from './unselectNode.js';

export default function exclusionSwap(node, elements, edges, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, exclusionGroups) {
    for (var group of exclusionGroups) {
        if (group.includes(node.id)) {
            // Move this course to the back
            const prevCourse = group.shift();
            group.push(prevCourse);

            // Current course we need to display is now at front of queue
            const curCourse = group[0];

            // Toggle the nodes we are swapping
            for (var e of elements) {
                if (e.id === prevCourse) hiddenNodes[e.id] = 1;
                if (e.id === curCourse) delete hiddenNodes[e.id];
            }

            // Determine the state of the nodes (E.g. COMP6441 can be selectable
            // whilst COMP6841 is not)
            var curNode = getElement(curCourse, elements);
            if (checkPrerequisites(curNode, elements, selectedNodes)) {
                // The new node is selectable
                selectableNodes[curCourse] = 1;

                // Determine previous node condition
                if (selectedNodes.hasOwnProperty(prevCourse)) {
                    // Make current node selected and previous node unselected
                    delete selectedNodes[prevCourse];
                    delete selectableNodes[curCourse];
                    selectedNodes[curCourse] = 1;
                } else if (selectableNodes.hasOwnProperty(prevCourse)) {
                    // Current node is selectable and previous node is unselectable
                    delete selectableNodes[prevCourse];
                }
            } else {
                // The new node is not selectable. Unselect the original node
                unselectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            }

            // Get all the edges of the previuos course and hide all of them
            // Then use regex sub to determine the new edges to reveal
            // Transfer over selected, potential and hover edges if they are in newEdgesList
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

            // Go through each edge we need to hide and check what we should
            // do with the edge in hideEdgesList
            for (const edge of edgesIds) {
                // Hide the edge
                console.log("Hiding " + edge);
                hiddenEdges[edge] = 1;

                // Get the new edge we are trying to reveal. If it exists,
                // mark it as a checked edge (common edge)
                const newEdgeId = edge.replace(prevCourse, curCourse);
                if (getElement(newEdgeId, edges) !== null) {
                    checkedEdges.push(newEdgeId);
                }

                // Transfer the edge property if it exists as an edge of the new
                // node to be revealed

                // If it is selected, unselect it
                if (selectedEdges.hasOwnProperty(edge)) {
                    delete selectedEdges[edge];
                    if (newEdgesIds.includes(newEdgeId)) {
                        selectedEdges[newEdgeId] = 1;
                    }
                }

                // If it is potential, unpotential it.
                if (potentialEdges.hasOwnProperty(edge)) {
                    delete potentialEdges[edge];
                    if (newEdgesIds.includes(newEdgeId)) {
                        potentialEdges[newEdgeId] = 1;
                    }
                }

                // If hover, unhover it
                if (hoverEdges.hasOwnProperty(edge)) {
                    delete hoverEdges[edge];
                    if (newEdgesIds.includes(newEdgeId)) {
                        hoverEdges[newEdgeId] = 1;
                    }
                }
            }

            // If the edge is not a common edge with the new node,
            // make sure the target is not selectable anymore
            for (const edge of edgesIds) {
                const newEdgeId = edge.replace(prevCourse, curCourse);
                if (! checkedEdges.includes(newEdgeId)) {
                    var target = newEdgeId.split('-')[1];

                    // TODO: Temporary fix, make sure target is not the current course
                    if (target === curCourse) continue;

                    if (selectableNodes.hasOwnProperty(target)) {
                        // TODO: This won't work if the target node condition is determined by
                        // units. We can check these conditions at the end???
                        delete selectableNodes[target];
                    }
                }
            }

            // For each edge, show it if BOTH target and source are not hidden
            // Will also show any additional edges
            // (E.g. COMP6441, COMP6841. COMP6841 -> COMP6448 but COMP6441 does not)
            for (const edge of newEdgesIds) {
                var newEdge = getElement(edge, edges);
                const sourceNode = getElement(newEdge.source, elements);
                const targetNode = getElement(newEdge.target, elements);

                // Show the edge if both nodes are not hidden
                if (!hiddenNodes.hasOwnProperty(sourceNode.id) && !hiddenNodes.hasOwnProperty(targetNode.id)) {
                    console.log("Revealing " + edge);
                    delete hiddenEdges[edge];
                }

                // Determine if this edge has been checked before
                if (checkedEdges.includes(edge)) {
                    // It has been checked before.
                    // TODO: This can break if both nodes have same edges
                    // but one has an additional prerequisite
                    continue;
                } else {
                    // It has NOT been checked before
                    if (selectedNodes.hasOwnProperty(curCourse)) {
                        if (sourceNode.id === curCourse) {
                            // Node to be revealed is selected and source of edge.
                            // Make the edge potential
                            potentialEdges[edge] = 1;

                            // Check if the target node is selectable
                            if (! selectableNodes.hasOwnProperty(targetNode.id)) {
                                if (checkPrerequisites(targetNode, elements, selectedNodes)) {
                                    selectableNodes[targetNode.id] = 1;
                                } else {
                                    // TODO: The edge does not meet the prerequisite.
                                    // Not sure what happens here :/
                                }
                            }
                        } else {
                            // Reveal node is selected and target of edge. Check previous
                            // edges/nodes
                            if (curNode.data.conditions.prerequisites !== null) {
                                for (const prereq of curNode.data.conditions.prerequisites) {
                                    if (selectedNodes.hasOwnProperty(prereq)) {
                                        // This node was selected. Make the edge selected
                                        delete potentialEdges['e' + prereq + '-' + curCourse];
                                        selectedEdges['e' + prereq + '-' + curCourse] = 1;
                                    } else {
                                        // This node was not selected. Make sure edge is unselected
                                        delete potentialEdges['e' + prereq + '-' + curCourse];
                                        delete selectedEdges['e' + prereq + '-' + curCourse];
                                    }
                                }
                            }
                        }
                    } else {
                        // The node was not selected before. Delete any potential edges
                        // Make the target node unseletable if prereqs are not met
                        if (potentialEdges.hasOwnProperty(edge)) {
                            delete potentialEdges[edge];
                            if (selectableNodes.hasOwnProperty(targetNode.id)) {
                                if (!checkPrerequisites(targetNode, elements, selectedNodes)) {
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
}