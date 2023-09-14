# LPA Questionnaire Import

LPA submit a response to the on-going appeal (LPA questionnaire) through the front-office. 

The front-office will send a command to the `register-fo-lpaq-subscription`, on the `appeal-fo-lpa-response-submission` topic. The back-office will validate the request, ensures the related appeal exists, and publish its state as an event on the on the `appeal-bo-case` topic, and associated documents on the `appeal-bo-document` topic.

This function handles the command, posting its payload to the back-office appeals api.
