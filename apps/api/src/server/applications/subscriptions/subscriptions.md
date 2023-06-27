# Subscriptions

Users can subscribe to updates for an NSIP project. The front-office handles the user form, and email verification.

When a subscription is created, updated, or deleted in the back-office, corresponding events are sent. To match with the PINS data model (see [nsip-subscription.schema.json](../../../message-schemas/events/nsip-subscription.schema.json)), there is one event per subscription type. So if a subsription is updated to remove `applicationSubmitted` and add `applicationDecided`, then a `Delete` and `Create` event will be fired respectively.

The API for subscriptions groups all the subscription types into an array, so that subscriptions can be handled as one entity. Similarly, the [register-nsip-subscription.schema.json](../../../message-schemas/commands/register-nsip-subscription.schema.json) command allows specifying all subscription types in one message.
