# Casedata Import

Users submit an appeal request (appellant case) through the front-office. 

The front-office will send a command via Service Bus for `register-fo-casedata-subscription`. The back-office will validate the request and if successful, create a new appeal in the system, and publish the created `appeal-bo-case` on Service Bus.

This function handles the command, posting its payload to the back-office appeals api.
