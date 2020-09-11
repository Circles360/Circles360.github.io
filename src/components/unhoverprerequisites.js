// HELPER FUNCTION to delete prerequisite edges
// Usually used after unhovering or onclick
export default function unhoverPrerequisites(hoverEdges) {
    for (var edge in hoverEdges) {
        delete hoverEdges[edge];
    }
}