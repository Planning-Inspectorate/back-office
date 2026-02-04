resource "azurerm_servicebus_subscription" "redaction_process_complete" {
  name               = "cbos"
  topic_id           = data.azurerm_servicebus_topic.redaction_process_complete.id
  max_delivery_count = 1
}

resource "azurerm_servicebus_subscription_rule" "redaction_process_complete" {
  name            = "subscription_rule"
  subscription_id = azurerm_servicebus_subscription.redaction_process_complete.id
  filter_type     = "CorrelationFilter"
  correlation_filter {
    label = "cbos" # Each team will have their requests labelled with an id representing their team
  }
}
