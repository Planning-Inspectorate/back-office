# Notify Subscribers

Some actions in the Back Office require a notification to be sent to subscribers. For example, when a Project Update is published all subscribers will be notified, via Gov Notify. This function implements that functionality.

## Process Outline

When a Project Update is published, a scheduled message is sent 

Note: "log" here doesn't mean a log message, but a log of notification sending activity.

```mermaid
flowchart TB
    trigger([Project Update Published])
    get(Get Project Update)
    check{Is still published?}
    end1([end])
    format(Sanitise and Format Update)
    isOk{Update is valid?}
    terminate([end with error])
    getSubs(Get Subscriptions)
    finish([end])

    trigger-->get
    get-->check
    check-->|Yes|format
    check-->|No|end1
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
    getSubs-->foreachSub
    foreachSub-->finish

    style foreachSub fill:#eee8d5    
```
