// HELPER FUNCTION for selecting and unselecting nodes
// Alters brightness of selected node and pushes onto selected array for now
export default function selectNode(elements, node) {
    var newElements = [...elements];
    for (var e of newElements) {
        if (node.id === e.id) {
            if (e.style.filter === 'brightness(0.75)') {
                e.style.filter = 'brightness(1.25)';
                console.log("BRIGHTER");
            }
            else {
                e.style.filter = 'brightness(0.75)';
                console.log("DARKER");
            }
            break;
        }
    }  


    return newElements;
}