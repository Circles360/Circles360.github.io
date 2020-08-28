# courses.json format

| KEY            | TYPE                              | VALUE                                                                    |
|----------------|-----------------------------------|--------------------------------------------------------------------------|
| “course_name”  | string                            | Course name                                                              |
| “course_code”  | string                            | [A-Z]{4}[0-9]{4}                                                         |
| “course_level” | int                               | First digit of course number                                             |
| “units”        | int                               | UOC this course gives                                                    |
| “terms”        | Array of strings / NULL           | Values only of “Summer Term”, “Term 1”, “Term 2” or “Term 3”             |
| “desc”         | string                            | First sentence of course overview (first full stop)                      |
| “conditions”   | Conditions object / NULL          | SEE BELOW                                                                |
| “equivalents”  | Array of course codes / NULL      | E.g. MATH1131 and MATH1141 are equivalent courses                        |
| “builds_into”  | Array of course codes / NULL      | If P is a prerequisite of course C, then P[“builds_into”] will contain C |

## Conditions object
| KEY                               | TYPE                                 | VALUE                                                                                                                                                                        |
|-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| “prerequisites”<br>“corequisites” | Nested arrays of course codes / NULL | [[A]] = A only<br>[[A, B]] = A OR B<br>[[A], [B, C]] = A AND (B OR C)<br>[[A, B], [C, D]] = (A OR B) AND (C OR D)<br>[[[[A],[B]],[[C],[D]]]] = (A AND B) OR (C AND D)        |
| “units _required”                 | int / NULL                           | Number of UOC required before taking this course. If “level_for_units_required” is not null, then this number represents the number of units required at the specified level |
| “level_for_units_required”        | int / NULL                           | Used for the above<br>e.g. “units_required” = 12, “level_for_units_required” = 2<br>Then 12 UOC required in relevant Level 2 courses                                         |
| “core_year”                       | int / NULL                           | Must have completed “core_year”-th core year to begin this course                                                                                                            |
| “other”                           | Array of strings / NULL              | Miscellaneous rules that i didn’t filter out.                                                                                                                                |