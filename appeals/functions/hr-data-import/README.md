# Employee Import

ODW will send a command via Service Bus for `employee-topic-subscription`. The back-office will import the employee data in its local projection.

This function handles the command, posting its payload to the back-office appeals api.
