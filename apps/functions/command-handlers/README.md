# deadline-submissions function

This Azure function is responsible for consuming messages from the front office via Service Bus which inform us of when a user uploads a new submission against a timetable item/line item.

## Flow

```mermaid
flowchart TD
    initial[Message consumed from Service Bus]
    nullChecks{"Do case,
    timetable item
    and line item exist?"}
    apiStep[Send blob details to documents API and receive response]
    apiCheck{"Was API call
    successful?"}
    copyStep[Copy blob to container & path given in API response]
    copyCheck{"Was copy of
    blob successful?"}
    failure[Publish failure message to service bus]
    success[Publish success message to service bus]

    initial --> nullChecks

    nullChecks -- No --> failure
    nullChecks -- Yes --> apiStep

    apiStep --> apiCheck
    apiCheck -- No --> failure
    apiCheck -- Yes --> copyStep

    copyStep --> copyCheck
    copyCheck -- No --> failure
    copyCheck -- Yes --> success
```

# Handle Subscriptions

Users can subscribe to updates for an NSIP project. The front-office handles the user form, and email verification.

The front-office will send a command via Service Bus for `register-nsip-subscription`. The back-office will save the subscription information, and publish the created `nsip-subscription` on Service Bus.

This function handles the command, saves the subscription, and publishes the event.
