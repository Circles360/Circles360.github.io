import React, { useState } from "react";
import { Button, Dropdown, Grid } from "semantic-ui-react";
import { useStoreActions } from "react-flow-renderer";
import dataJSON from "../maps/EngineeringHonoursSoftware/data.json";
import getElement from "./getelement.js";

const nodeOptions = [];
const elementsList = [];

for (const code in dataJSON) {
    const id = dataJSON[code].id;
    //console.log("Printing id", id);
    if (id.includes("-")) continue;

    elementsList.push(dataJSON[code]);
    nodeOptions.push({
        key: id,
        value: id,
        text: id,
    });
}

console.log("Printing NodeOptions", nodeOptions);

export default function DropdownSearch() {
    const [search, setSearch] = useState(null);

    /*state = {
        search: null,
        getOptions: nodeOptions
    }*/

    const handleChange = (e, prop) => {
        setSearch(prop.value);
    };

    const { setInitTransform } = useStoreActions((actions) => actions);
    const transformUpdater = (x, y, zoom) => {
        setInitTransform({ x, y, k: zoom });
    };

    const clickDone = () => {
        if (search === null) return;
        const element = getElement(search, elementsList);
        transformUpdater(
            -element.position.x + 600,
            -element.position.y + 350,
            1
        );
    };

    return (
        <>
            <Dropdown
                selection
                search
                options={nodeOptions}
                placeholder="Can't find a course?"
                onChange={handleChange}
                value={search}
            />
            <Button
                onClick={clickDone}
                icon="search"
                color="red"
                style={{marginLeft: "5px"}}
            >
            </Button>
        </>
    );
}
