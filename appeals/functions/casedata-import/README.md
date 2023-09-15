# Casedata Import

Users submit an appeal request (appellant case) through the front-office. 

The front-office will send a command to the `register-fo-casedata-subscription`, on the `appeal-fo-appellant-submission` topic. The back-office will validate the request and, if successful, create a new appeal in the system, publishing its state as an event on the `appeal-bo-case` topic, and associated documents on the `appeal-bo-document` topic.

This function handles the command, posting its payload to the back-office appeals api.
