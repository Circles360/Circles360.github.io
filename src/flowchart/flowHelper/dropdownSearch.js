import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useStoreActions } from "react-flow-renderer";
import getElement from "./getElement.js";

export default function DropdownSearch(props) {
    const [search, setSearch] = useState(null);

    const handleChange = (e, prop) => {
        setSearch(prop.value);
    };

    const { updateTransform } = useStoreActions((actions) => actions);
    const transformUpdater = (x, y, zoom) => {
        updateTransform({ x, y, k: zoom });
    };

    const clickDone = () => {
        if (search === null) return;
        const element = getElement(search, props.searchElements);

        // Unhide the entire map when searching for a HIDDEN node
        // This is so we don't take them to a blank page
        if (props.hideMap === true && element.isHidden === true) props.toggleHidden();

        transformUpdater(
            -(element.position.x) * 2 + (window.innerWidth * 0.75)/2 - 64,
            -(element.position.y) * 2 + (window.innerHeight)/2 - 64,
            2
        );
            
        // Show the node if it is hidden (At this point, the only hidden nodes
        // are exclusion nodes since we toggle hidemap for nodes hidden by hidemap)
        if (element.isHidden === true) {
            // Determine the current showing node and hide it
            for (const exclusion of element.data.exclusions) {
                for (const course of props.searchElements) {
                    if (course.id === exclusion) {
                        // Check if this exclusion is revealed
                        var exclusionNode = getElement(exclusion, props.searchElements);
                        if (exclusionNode.isHidden === false) {
                            // This is the node we need to toggle
                            props.toggleExclusion(exclusionNode);
                            return;
                        }
                    }
                }
            }
        }
    };

    return (
        <>
            <Dropdown
                selection
                search
                clearable
                options={props.searchNodeOptions}
                placeholder="Looking for a course?"
                onChange={handleChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                      clickDone();
                    }
                  }}
                value={search}
            />
            <Button
                onClick={clickDone}
                icon="search"
                color="blue"
                style={{marginLeft: "5px"}}
            >
            </Button>
        </>
    );
}
