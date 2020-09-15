// HELPER FUNCTION FOR unselecting nodes
// Determines if any nodes not connected to unselect node needs to be unselected.
// For example, nodes which rely on N units completed
import checkPrerequisites from './checkprerequisites.js';
import checkPrequisiteUnits from './checkprerequisites.js';
import unselectNode from './unselectnode.js';
import getElement from './getelement.js';

export default function unselectUnconnected(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    console.log("UNSELECTUNCONNECTED");
    const selectedNodesList = Object.keys(selectedNodes);
    for (const selected of selectedNodesList) {
        console.log("CHECKING " + selected);
        // Determine if prerequisites are met
        if (selected === 'COMP6441') {
            console.log("!!!!!!!!!!!!!!!!!!!!!");
            console.log(selectedNodes);
        }
        const selectedNode = getElement(selected, elements);
        if (! checkPrerequisites(selectedNode, elements, selectedNodes)) {
            // Prerequisites are not met
            unselectNode(elements, selectedNode, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            continue;
        }

        // CASE if the node is selected and it has n_course prerequisite 
        if (selectedNode.data.conditions.units_required !== null) {
            console.log("+++++++++++++++++++", selectedNode.id);
            // Units required exists
            // Do not count the nodes it "unlocks" towards its unit count
            // DO not count nodes with a higher "units_required" towards its unit count
            // NOTE: This might backfire if it has an unlock which DOES NOT
            // require it as a prerequisite
            
            var trueSelectedNodes = {...selectedNodes};

            if (selectedNode.data.unlocks !== null) {
                // Create unlock queue to process "selected" unlocks"
                const selectedUnlockQueue = [];
                for (const unlockCourse of selectedNode.data.unlocks) {
                    if (selectedNodes.hasOwnProperty(unlockCourse)) selectedUnlockQueue.push(unlockCourse);
                }

                while (selectedUnlockQueue.length !== 0) {
                    const curUnlock = getElement(selectedUnlockQueue.shift(), elements);
                    console.log("------------- deleting " + curUnlock.id);
                    delete trueSelectedNodes[curUnlock.id];

                    if (curUnlock.data.unlocks !== null) {
                        for (const unlockCourse of curUnlock.data.unlocks) {
                            if (selectedNodes.hasOwnProperty(unlockCourse)) selectedUnlockQueue.push(unlockCourse);
                        }
                    }
                }
            }

            // We now have a list of nodes which will count towards our current node's unit requirements
            // Final check = Check for other selected nodes which have unit requirements
            // Do not count them unless their unit requirements are smaller than current node's.
            const trueSelectedNodesList = Object.keys(trueSelectedNodes);
            for (const selected of trueSelectedNodesList) {
                console.log("Checking ", selected);
                const selectedUnitsNode = getElement(selected, elements);
                if (selectedUnitsNode.data.conditions.units_required !== null) {
                    if (selectedUnitsNode.data.conditions.units_required >= selectedNode.data.conditions.units_required) {
                        delete trueSelectedNodes[selected];
                    }
                }
            }

            console.log("TRUE SELECTED LOOKS LIKE", trueSelectedNodes);
            // Perform prerequisite unit check once more
            if (! checkPrequisiteUnits(selectedNode, elements, trueSelectedNodes)) {
                unselectNode(elements, selectedNode, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            }
        }
    }

    const selectableNodesList = Object.keys(selectableNodes);
    for (const selectable of selectableNodesList) {
        // Determine if prerequisites are met
        const selectableNode = getElement(selectable, elements);
        if (! checkPrerequisites(selectableNode, elements, selectedNodes)) {
            // Prerequisites are not met
            delete selectableNode[selectable];
        }
    }
}