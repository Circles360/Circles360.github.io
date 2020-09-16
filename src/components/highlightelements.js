// Helper functions to highlight nodes and edges
// Will highlight/unhighlight nodes based on selectedNodes dictionary
import { isEdge } from "react-flow-renderer";

const selectedEdgeAnimated = {
    stroke: "#e94646",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}
const selectedEdgeStatic = {
    stroke: "#454545",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}

const hoverEdge = {
    stroke: "#454545",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}

const potentialHoverEdge = {
    stroke: "#454545",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}
const potentialEdge = {
    stroke: "#cecece",
    strokeWidth: 1,
    opacity: 1,
    transition: "0.3s ease"
}

const unselectedEdge = {
    stroke: "#cecece",
    strokeWidth: 1,
    opacity: 1,
    transition: "0.3s ease"
}

export default function highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    const newElements = elements.map((e) => {
        // It is an edge
        if (isEdge(e)) {
            if (selectedEdges.hasOwnProperty(e.id)) {
                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: selectedEdgeAnimated, animated: true};
                else return {...e, style: selectedEdgeStatic, animated: false};
            } else if (potentialEdges.hasOwnProperty(e.id)) {
                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: potentialHoverEdge, animated: true};
                else return {...e, style: potentialEdge, animated: false};
            } else if (hoverEdges.hasOwnProperty(e.id)) {
                return {...e, style: hoverEdge, animated: true};
            } else {
                return {...e, style: unselectedEdge, animated: false};
            }
        }

        // It is a node
        if (selectedNodes.hasOwnProperty(e.id)) {
            // SELECTED NODE
            const selected = e.selected;
            return {...e, style: selected};

            // if (e.style.background === 'white') {
            //     // It was previously a selectable node. Adjust colours accordingly
            //     const backgroundColour = e.style.color;
            //     // return {...e, style: {...e.style, color: 'white', background: backgroundColour, filter: 'brightness(1.15)'}}
            //     return {...e};
            // } else {
            //     // It was an unselected node or an already selected node. Simply make sure its brightness is adjusted
            //     // return {...e, style: {...e.style, filter: 'brightness(1.15)'}};
            //     return {...e};
            // }
        } else if (selectableNodes.hasOwnProperty(e.id)) {
            // NOT SELECTED BUT CAN BE SELECTED
            const canSelect = e.canSelect;
            return {...e, style: canSelect};
            // 
            // if (e.style.background === 'white') {
            //     // It was already a selectable node. Do not need to adjust
            //     return {...e};
            // } else {
            //     // It was an unselected node or an already selected node. Adjust text colour and background
            //     const textColour = e.style.background;
            //     // return {...e, style: {...e.style, color: textColour, background: 'white', filter: 'brightness(1.15)'}};
            //     return {...e};
            // }
        } else {
            // NOT SELECTED AND SHOULD NOT BE SHOWN AS CAN SELECTED
            const cannotSelect = e.cannotSelect;
            return {...e, style: cannotSelect};
            // CONDITIONS NOT MET YET
            // if (e.style.background === 'white') {
            //     // It was a selectable node previously. Adjust colours accordingly
            //     const backgroundColour = e.style.color;
            //     return {...e};
            //     // return {...e, style: {...e.style, color: 'white', background: backgroundColour, filter: 'brightness(0.65)'}}; 
            // } else {
            //     // It was either unselected or an already selected node. Simply adjust brightness
            //     // return {...e, style: {...e.style, filter: 'brightness(0.65)'}};
            //     return {...e};
            // }
        }
    })

    return newElements;
}