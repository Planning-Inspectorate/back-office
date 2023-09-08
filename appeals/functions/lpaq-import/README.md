# LPA Questionnaire Import

LPA submit a response to the on-going appeal (LPA questionnaire) through the front-office. 

The front-office will send a command via Service Bus for `register-fo-lpaq-subscription`. The back-office will validate the request, create a new appeal in the system, and publish the updated `appeal-bo-case` on Service Bus.

This function handles the command, posting its payload to the back-office appeals api.
