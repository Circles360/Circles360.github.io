const json = require("./engineering_degrees.json");
//console.log(json);

var elements = [];

for (var degree in json) {
    //console.log(course);
    if (degree === "SENGAH") {
        //console.log(json[degree]);
        for (var core_level in json[degree]["core_courses"]) {
            if (core_level === "Level 1 Core Courses") {
                json[degree]['core_courses'][core_level].forEach(item => elements.push(item));
                console.log("LEVEL 1================================")
                console.log(json[degree]['core_courses'][core_level]);
            } else if (core_level == "Level 2 Core Courses") {
                console.log(json[degree]['core_courses'][core_level]);
            }
        }
    }
}

console.log("================================");
console.log(elements);