# Handle Subscriptions

Users can subscribe to updates for an NSIP project. The front-office handles the user form, and email verification.

The front-office will send a command via Service Bus for `register-email-subscriber`. The back-office will save the subscriber information, and publish the created `email-subscriber` on Service Bus.

This function handles the command, saves the subscriber, and publishs the event.