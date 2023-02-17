# Events

The following events are emitted by the back office (11)

| Name             | Notes                                       | Version | Payload Schema                                                                         | Status       |
| ---------------- | ------------------------------------------- | ------- | -------------------------------------------------------------------------------------- | ------------ |
| nsip-project     | An NSIP Project Case.                       | 0.1     | [NSIP Project](../apps/api/src/message-schemas/events/nsip-project.schema.json)        | Draft (CD)   |
| representation   | A relevant representation made for an NSIP. | 0.1     | [Representation](../apps/api/src/message-schemas/events/representation.schema.json)    | Waiting (PP) |
| interested-party | An interested party for an NSIP.            | 0.1     | [Service User](../apps/api/src/message-schemas/events/interested-party.schema.json)    | Draft (CD)   |
| nsip-document    | An NSIP Document.                           | 0.1     | [NSIP Document](../apps/api/src/message-schemas/events/nsip-document.schema.json)      | Draft (PP)   |
| exam-timetable   | Examination Timetable.                      | 0.1     | [Exam Timetable](../apps/api/src/message-schemas/events/exam-timetable.schema.json)    | Draft (CD)   |
| nsip-update      | An entry in 'Get Updates' for an NSIP.      | 0.1     | [NSIP Update](../apps/api/src/message-schemas/events/nsip-update.schema.json)          | Waiting      |
| s51-advice       | S51 Advice issued for an NSIP.              | 0.1     | [S51 Advice](../apps/api/src/message-schemas/events/s51-advice.schema.json)            | Waiting      |
| case-schedule    | _Needs Discovery_                           | 0.1     | [Case Schedule](../apps/api/src/message-schemas/events/case-schedule.schema.json)      | Blocked      |
| appeal           | _Needs Discovery_                           | 0.1     | [Appeal](../apps/api/src/message-schemas/events/_appeal.schema.json)                   | Blocked      |
| appeal-document  | _Needs Discovery_                           | 0.1     | [Appeal Document](../apps/api/src/message-schemas/events/_appeal-document.schema.json) | Blocked      |
| final-comments   | _Needs Discovery_                           | 0.1     | [Final Comments](../apps/api/src/message-schemas/events/_final-comment.schema.json)    | Blocked      |

The following events are emitted by ODW (1)

| Name     | Description               | Version | Payload Schema                                                          | S   |
| -------- | ------------------------- | ------- | ----------------------------------------------------------------------- | --- |
| employee | A PINS member of employee | 0.1     | [Employee](../apps/api/src/message-schemas/events/employee.schema.json) | ✓   |
