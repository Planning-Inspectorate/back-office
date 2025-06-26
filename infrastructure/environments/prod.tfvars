documents_config = {
  domain               = "https://nsip-documents.planninginspectorate.gov.uk"
  storage_account_name = "pinsstdocsboprodukw001"
}

environment = "prod"

front_door_config = {
  name        = "pins-fd-common-prod"
  rg          = "pins-rg-common-prod"
  ep_name     = "pins-fde-applications-prod"
  use_tooling = false

  managed_rule_set         = "DefaultRuleSet"
  managed_rule_set_version = "1.0"
}
resource_group_name = "pins-rg-back-office-prod-ukw-001"

web_app_config = {
  name = "pins-app-back-office-wfe-prod-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "back-office-applications.planninginspectorate.gov.uk"
