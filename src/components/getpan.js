import React from 'react';
import { useStoreState } from 'react-flow-renderer';

export default function GetPan() {
    const transform = useStoreState((store) => store.transform);
    return (
        <button onClick={()=> alert(transform)}>SEE POSITION</button>
    )
}