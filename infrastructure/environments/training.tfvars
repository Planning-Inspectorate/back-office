documents_config = {
  domain               = "https://back-office-applications-docs-train.planninginspectorate.gov.uk"
  storage_account_name = "pinsstdocsbotrainingukw"
}

environment = "training"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-applications"
  use_tooling = true

  managed_rule_set         = "DefaultRuleSet"
  managed_rule_set_version = "1.0"
}

resource_group_name = "pins-rg-back-office-training-ukw-001"

web_app_config = {
  name = "pins-app-back-office-wfe-training-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "back-office-training.planninginspectorate.gov.uk"
