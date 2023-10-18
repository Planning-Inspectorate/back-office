# Integrations

## Outgoing Events

The ODT services emit events to Service Bus Topics from within Appeals Back Office and Applications Back Office. These events use ECST to communicate state changes to entities. The Service Bus namespace and associated Topics are managed within ODT.

| Topic Name          | Version | Payload Schema                                                                                | Producer(s)                 | Known Consumers                  |
| ------------------- | ------- | --------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------- |
| service-user        | 1.0     | [Service User](../apps/api/src/message-schemas/events/service-user.schema.json)               | Appeals BO, Applications BO | ODW, Appeals FO, Applications FO |
| nsip-project        | 1.0     | [NSIP Project](../apps/api/src/message-schemas/events/nsip-project.schema.json)               | Applications BO             | ODW, Applications FO             |
| nsip-exam-timetable | 0.1     | [Exam Timetable](../apps/api/src/message-schemas/events/nsip-exam-timetable.schema.json)      | Applications BO             | ODW, Applications FO             |
| nsip-folder         | TODO    | TODO                                                                                          | Applications BO             | ODW                              |
| nsip-document       | 0.1     | [NSIP Document](../apps/api/src/message-schemas/events/nsip-document.schema.json)             | Applications BO             | ODW, Applications FO             |
| s51-advice          | 0.1     | [S51 Advice](../apps/api/src/message-schemas/events/s51-advice.schema.json)                   | Applications BO             | ODW, Applications FO             |
| nsip-representation | 0.1     | [Representation](../apps/api/src/message-schemas/events/representation.schema.json)           | Applications BO             | ODW, Applications FO             |
| nsip-project-update | 0.1     | [NSIP Project Update](../apps/api/src/message-schemas/events/nsip-project-update.schema.json) | Applications BO             | ODW, Applications FO             |
| nsip-subscription   | 0.1     | [NSIP Subscription](../apps/api/src/message-schemas/events/nsip-subscription.schema.json)     | Applications BO             | ODW                              |
| appeal-bo-case      | 0.1     | [Appeal](../appeals/api/src/message-schemas/pins-appeal.schema.json)                          | Appeals BO                  | ODW, Appeals FO                  |
| appeal-bo-document  | 0.1     | [Appeal Document](../appeals/api/src/message-schemas/pins-document.schema.json)               | Appeals BO                  | ODW, Appeals FO                  |

## Incoming Events (Operational)

The ODW service will emit events which will be used by core services within ODT.

TODO: There are other pieces of data such as LPAs and Listed Buildings

| Topic Name | Version | Payload Schema                                                          | Producer(s) | Known Consumers |
| ---------- | ------- | ----------------------------------------------------------------------- | ----------- | --------------- |
| employee   | 0.1     | [Employee](../apps/api/src/message-schemas/events/employee.schema.json) | ODW         | Appeals BO      |

## Incoming Events (Migration)

Temporary Service Bus Topics will be configured to migrate existing data from within legacy services such as Horizon. After Migration, ODT services will cease to use these Topics.

This table is essentially a copy of the outgoing events, but without topics for nsip-project-update and nsip-subscription. Data is being migrated directly from Worpress to ODT for those topics.

| Topic Name                  | Version | Payload Schema                                                                           | Producer(s) | Known Consumers |
| --------------------------- | ------- | ---------------------------------------------------------------------------------------- | ----------- | --------------- |
| migrate-service-user        | 1.0     | [Service User](../apps/api/src/message-schemas/events/service-user.schema.json)          | ODW         | Applications BO |
| migrate-nsip-project        | 1.0     | [NSIP Project](../apps/api/src/message-schemas/events/nsip-project.schema.json)          | ODW         | Applications BO |
| migrate-nsip-exam-timetable | 0.1     | [Exam Timetable](../apps/api/src/message-schemas/events/nsip-exam-timetable.schema.json) | ODW         | Applications BO |
| migrate-nsip-folder         | TODO    | TODO                                                                                     | ODW         | Applications BO |
| migrate-nsip-document       | 0.1     | [NSIP Document](../apps/api/src/message-schemas/events/nsip-document.schema.json)        | ODW         | Applications BO |
| migrate-s51-advice          | 0.1     | [S51 Advice](../apps/api/src/message-schemas/events/s51-advice.schema.json)              | ODW         | Applications BO |
| migrate-nsip-representation | 0.1     | [Representation](../apps/api/src/message-schemas/events/representation.schema.json)      | ODW         | Applications BO |
| migrate-appeal              | 0.1     | [Appeal](../apps/api/src/message-schemas/events/_appeal.schema.json)                     | ODW         | Appeals FO      |
| migrate-appeal-document     | 0.1     | [Appeal Document](../apps/api/src/message-schemas/events/_appeal-document.schema.json)   | ODW         | Appeals FO      |
