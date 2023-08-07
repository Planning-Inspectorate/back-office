# Notify Subscribers

Some actions in the Back Office require a notification to be sent to subscribers. For example, when a Project Update is published all subscribers will be notified, via Gov Notify. This function implements that functionality.

## Process Outline

Note: "log" here doesn't mean a log message, but a log of notification sending activity.

```mermaid
flowchart TB
    trigger([Timer Trigger])
    get(Get Project Updates<br/>that have been published >1hr ago)
    subgraph foreachUpdate [For each Project Update]
        direction TB
        format(Sanitise and Format Update)
        isOk{Update is valid}
        terminate([end with error])
        getSubs(Get Subscriptions)
        format-->isOk
        isOk-->|Yes|getSubs
        isOk-->|No|terminate
        subgraph foreachSub [For each Subscription]
            direction TB

            addRecord(Record Sub+Update in log table)
            trySend(Send email notification)
            sent{Success?}
            subTermError([Record error in log table])
            subTermSuccess([Record success in log table])

            addRecord-->trySend-->sent
            sent-->|Yes|subTermSuccess
            sent-->|No|subTermError
        end
    end
    subgraph checks [Check log records]
        direction TB

        getLogs(Get log records for unsent messages)
        getLogs-->trySend
    end
    trigger-->|every X mins|get
    trigger-->|every X mins|checks
    get-->foreachUpdate
    getSubs-->foreachSub

    style foreachUpdate fill:#6c71c4   
    style foreachSub fill:#268bd2  
```
