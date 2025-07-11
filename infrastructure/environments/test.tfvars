documents_config = {
  domain               = "https://back-office-applications-docs-test.planninginspectorate.gov.uk"
  storage_account_name = "pinsstdocsbotestukw001"
}

environment = "test"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-applications"
  use_tooling = true

  managed_rule_set         = "DefaultRuleSet"
  managed_rule_set_version = "1.0"
}

resource_group_name = "pins-rg-back-office-test-ukw-001"

web_app_config = {
  name = "pins-app-back-office-wfe-test-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "back-office-test.planninginspectorate.gov.uk"
