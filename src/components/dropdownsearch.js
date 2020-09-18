import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useStoreActions } from "react-flow-renderer";
import getElement from "./getelement.js";

export default function DropdownSearch(props) {
    const [search, setSearch] = useState(null);

    const handleChange = (e, prop) => {
        setSearch(prop.value);
    };

    const { setInitTransform } = useStoreActions((actions) => actions);
    const transformUpdater = (x, y, zoom) => {
        setInitTransform({ x, y, k: zoom });
    };

    const clickDone = () => {
        if (search === null) return;
        const element = getElement(search, props.searchElements);

        transformUpdater(
            -(element.position.x) * 2 + (window.innerWidth * 0.75)/2 - 64,
            -(element.position.y) * 2 + (window.innerHeight)/2 - 64,
            2
        )
    };

    return (
        <>
            <Dropdown
                selection
                search
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
