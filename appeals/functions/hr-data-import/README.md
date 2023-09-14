# Employee Import

ODW will send a command via Service Bus for the `register-odw-hrdata-subscription`, on the `employee` topic. The back-office will import the employee data in its local projection.

This function handles the command, posting its payload to the back-office appeals api.
