import React, { Component } from 'react'
import { Button, Dropdown } from 'semantic-ui-react'

import programsJSON from "../webscraper/programs.json"
import specialisationsJSON from "../webscraper/specialisations.json"

const MAJORS = 1;
const MINORS = 2;
const HONOURS = 3;

const courseOptions = {}
const programOptions = []

console.log(programsJSON)

for (const code in programsJSON) {
    if (programsJSON[code].degrees_involved.majors.length === 0 && programsJSON[code].degrees_involved.honours.length === 0) continue;

    programOptions.push({
        "key": code,
        "value": code,
        "text": code + " - " + programsJSON[code].name
    })

    courseOptions[code] = programsJSON[code].degrees_involved
}

for (const code in courseOptions) {
    for (const type in courseOptions[code]) {

        const replacement = [];
        for (const spec of courseOptions[code][type]) {
            if (!(spec in specialisationsJSON)) continue;
            replacement.push({
                "key": spec,
                "value": spec,
                "text": spec + " - " + specialisationsJSON[spec].name
            })
        }
        courseOptions[code][type] = replacement;
    }
}

// returns MAJORS if Majors but no Minors
// returns MINORS if Majors and Minors exist
// returns HONOURS if Honours exist
const getMajors = (code) => {
    if (!(code in courseOptions)) {
        console.log("code not found in majors", code);
        return [];
    }

    if (courseOptions[code].honours.length) return [HONOURS, courseOptions[code].honours];
    if (courseOptions[code].minors.length) return [MINORS, courseOptions[code].majors];
    return [MAJORS, courseOptions[code].majors];
}

const getMinors = (code) => {
    if (!(code in courseOptions)) {
        console.log("code not found in minors", code);
        return [];
    }

    return courseOptions[code].minors;
}

class DropdownDegrees extends Component {
    state = {
        programOptions: programOptions,
        majorOptions: [],
        minorOptions: [],

        disabledPrimary: true,
        disabledSecondary: true,

        valProgram: null,
        valPrimary: null,
        valSecondary: null,

        phPrimary: "Select",
        phSecondary: "N/A"
    }

    chooseProgram = (e, program) => {
        const [type, majors] = getMajors(program.value)
        console.log(program.value)
        this.setState({
            valProgram: program.value,

            valPrimary: null,
            disabledPrimary: false,
            majorOptions: majors,
            phPrimary: "Select Major",

            valSecondary: null,
            disabledSecondary: true,
            minorOptions: [],
            phSecondary: "N/A"
        })

        if (type === HONOURS) this.setState({phPrimary: "Select Honour"})
        else if (type === MAJORS) this.setState({phPrimary: "Select Major"})
        else {
            this.setState({
                phPrimary: "Select Major",
                phSecondary: "Select Minor",
                minorOptions: getMinors(program.value),
                disabledSecondary: false,
            });
        }
    }

    choosePrimary = (e, spec) => {
        this.setState({
            valPrimary: spec.value
        })
    }

    chooseSecondary = (e, minor) => {
        this.setState({
            valSecondary: minor.value
        })
    }

    clickDone = () => {
        console.log('Running click')
        // console.log(this.state)
        console.log(this.state.valProgram, this.state.valPrimary, this.state.valSecondary)
    }

    render() {
        return <>
            <Dropdown
                selection
                search
                onChange={this.chooseProgram}
                options= {this.state.programOptions}
                enabled
                placeholder= 'Select Program'
            />{' '}
            <Dropdown
                selection
                search
                onChange={this.choosePrimary}
                options= {this.state.majorOptions}
                disabled= {this.state.disabledPrimary}
                value= {this.state.valPrimary}
                placeholder= {this.state.phPrimary}
            />{' '}
            <Dropdown
                selection
                search
                onChange={this.chooseSecondary}
                options= {this.state.minorOptions}
                disabled= {this.state.disabledSecondary}
                value= {this.state.valSecondary}
                placeholder= {this.state.phSecondary}
            />
            <div>
                <Button
                    onClick={this.clickDone}
                    style={{marginTop: "20px"}}
                >Done! Print to console</Button>
            </div>
        </>;
    }
}

export default DropdownDegrees
