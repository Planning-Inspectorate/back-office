resource "azurerm_cdn_frontdoor_origin_group" "wfe" {
  name                     = "${local.org}-fd-${local.service_name}-wfe-${var.environment}"
  cdn_frontdoor_profile_id = data.azurerm_cdn_frontdoor_profile.shared.id
  session_affinity_enabled = true
  provider                 = azurerm.front_door

  health_probe {
    interval_in_seconds = 240
    path                = "/"
    protocol            = "Https"
    request_type        = "HEAD"
  }

  load_balancing {
    additional_latency_in_milliseconds = 0
    sample_size                        = 16
    successful_samples_required        = 3
  }
}

resource "azurerm_cdn_frontdoor_origin" "wfe" {
  name                          = "${local.org}-fd-${local.service_name}-wfe-${var.environment}"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.wfe.id
  enabled                       = true

  certificate_name_check_enabled = true
  provider                       = azurerm.front_door

  host_name          = data.azurerm_linux_web_app.back_office.default_hostname
  origin_host_header = data.azurerm_linux_web_app.back_office.default_hostname
  http_port          = 80
  https_port         = 443
  priority           = 1
  weight             = 1000
}


resource "azurerm_cdn_frontdoor_custom_domain" "wfe" {
  name                     = "${local.org}-fd-${local.service_name}-wfe-${var.environment}"
  cdn_frontdoor_profile_id = data.azurerm_cdn_frontdoor_profile.shared.id
  host_name                = var.web_domain
  provider                 = azurerm.front_door

  tls {
    certificate_type = "ManagedCertificate"
    # minimum_tls_version = "TLS12"
  }
}

resource "azurerm_cdn_frontdoor_route" "wfe" {
  name                          = "${local.org}-fd-${local.service_name}-wfe-${var.environment}"
  cdn_frontdoor_endpoint_id     = data.azurerm_cdn_frontdoor_endpoint.shared.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.wfe.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.wfe.id]
  provider                      = azurerm.front_door

  forwarding_protocol    = "MatchRequest"
  https_redirect_enabled = true
  patterns_to_match      = ["/*"]
  supported_protocols    = ["Http", "Https"]


  cdn_frontdoor_custom_domain_ids = [azurerm_cdn_frontdoor_custom_domain.wfe.id]
  link_to_default_domain          = false
}

resource "azurerm_cdn_frontdoor_custom_domain_association" "wfe" {
  cdn_frontdoor_custom_domain_id = azurerm_cdn_frontdoor_custom_domain.wfe.id
  cdn_frontdoor_route_ids        = [azurerm_cdn_frontdoor_route.wfe.id]
  provider                       = azurerm.front_door
}

# WAF policy
resource "azurerm_cdn_frontdoor_firewall_policy" "wfe" {
  name                              = replace("${local.org}-waf-${local.service_name}-wfe-${var.environment}", "-", "")
  resource_group_name               = var.front_door_config.rg
  enabled                           = true
  mode                              = "Prevention"
  redirect_url                      = "https://${var.web_domain}/error/firewall-error"
  custom_block_response_status_code = 429
  sku_name                          = "Premium_AzureFrontDoor"
  provider                          = azurerm.front_door


  tags = local.tags

  managed_rule {
    type    = "Microsoft_DefaultRuleSet"
    version = "2.1"
    action  = "Block"

    override {
      rule_group_name = "RFI"

      rule {
        # Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link
        action  = "Block"
        enabled = true
        rule_id = "931130"

        exclusion {
          # Exclusion to fix BOAS-153
          match_variable = "RequestBodyPostArgNames" # PostParamValue:applicant.website
          operator       = "Equals"
          selector       = "applicant.website"
        }
      }
    }

    override {
      rule_group_name = "LFI"

      rule {
        # Path Traversal Attack (/../)
        action  = "Block"
        enabled = true
        rule_id = "930100"

        exclusion {
          # Exclusion to allow acceptance of cookies
          match_variable = "RequestCookieNames" # "CookieValue:cookie_policy"
          operator       = "Equals"
          selector       = "cookie_policy"
        }
      }

      rule {
        # Path Traversal Attack (/../)
        action  = "Block"
        enabled = true
        rule_id = "930110"

        exclusion {
          # Exclusion to allow acceptance of cookies
          match_variable = "RequestCookieNames" # "CookieValue:cookie_policy"
          operator       = "Equals"
          selector       = "cookie_policy"
        }
      }
    }

    override {
      rule_group_name = "SQLI"

      rule {
        # SQL Injection Attack Detected via libinjection
        action  = "Log"
        enabled = true
        rule_id = "942100"
      }

      rule {
        # SQL Injection Attack: Common Injection Testing Detected
        action  = "Log"
        enabled = true
        rule_id = "942110"
      }

      rule {
        # SQL Injection Attack: SQL Operator Detected
        action  = "Log"
        enabled = true
        rule_id = "942120"
      }

      rule {
        # SQL Injection Attack: Common DB Names Detected
        action  = "Log"
        enabled = true
        rule_id = "942140"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942150"
      }

      rule {
        # Detects blind sqli tests using sleep() or benchmark()
        action  = "Log"
        enabled = true
        rule_id = "942160"
      }

      rule {
        # Detects SQL benchmark and sleep injection attempts including conditional queries
        action  = "Log"
        enabled = true
        rule_id = "942170"
      }

      rule {
        # Detects basic SQL authentication bypass attempts 1/3
        action  = "Log"
        enabled = true
        rule_id = "942180"
      }

      rule {
        # Detects MSSQL code execution and information gathering attempts
        action  = "Log"
        enabled = true
        rule_id = "942190"
      }

      rule {
        # Detects chained SQL injection attempts 1/2
        action  = "Log"
        enabled = true
        rule_id = "942210"
      }

      rule {
        # Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash
        action  = "Log"
        enabled = true
        rule_id = "942220"
      }

      rule {
        # Detects conditional SQL injection attempts
        action  = "Log"
        enabled = true
        rule_id = "942230"
      }

      rule {
        # Detects MySQL charset switch and MSSQL DoS attempts
        action  = "Log"
        enabled = true
        rule_id = "942240"
      }

      rule {
        # Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections
        action  = "Log"
        enabled = true
        rule_id = "942250"
      }

      rule {
        # Looking for basic sql injection. Common attack string for mysql, oracle, and others.
        action  = "Log"
        enabled = true
        rule_id = "942270"
      }

      rule {
        # Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts
        action  = "Log"
        enabled = true
        rule_id = "942280"
      }

      rule {
        # Finds basic MongoDB SQL injection attempts
        action  = "Log"
        enabled = true
        rule_id = "942290"
      }

      rule {
        # Detects MySQL comments, conditions, and ch(a)r injections
        action  = "Log"
        enabled = true
        rule_id = "942300"
      }

      rule {
        # Detects chained SQL injection attempts 2/2
        action  = "Log"
        enabled = true
        rule_id = "942310"
      }

      rule {
        # Detects MySQL and PostgreSQL stored procedure/function injections
        action  = "Log"
        enabled = true
        rule_id = "942320"
      }

      rule {
        # Detects classic SQL injection probings 1/2
        action  = "Log"
        enabled = true
        rule_id = "942330"
      }

      rule {
        # Detects basic SQL authentication bypass attempts 3/3
        action  = "Log"
        enabled = true
        rule_id = "942340"
      }

      rule {
        # Detects MySQL UDF injection and other data/structure manipulation attempts
        action  = "Log"
        enabled = true
        rule_id = "942350"
      }

      rule {
        # Detects concatenated basic SQL injection and SQLLFI attempts
        action  = "Log"
        enabled = true
        rule_id = "942360"
      }

      rule {
        # Detects basic SQL injection based on keyword alter or union
        action  = "Log"
        enabled = true
        rule_id = "942361"
      }

      rule {
        # Detects classic SQL injection probings 2/3
        action  = "Log"
        enabled = true
        rule_id = "942370"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942380"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942390"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942410"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942470"
      }

      rule {
        # SQL Injection Attack
        action  = "Log"
        enabled = true
        rule_id = "942480"
      }

      rule {
        # Detects MySQL comment-/space-obfuscated injections and backtick termination
        action  = "Log"
        enabled = true
        rule_id = "942200"
      }

      rule {
        # Detects basic SQL authentication bypass attempts 2/3
        action  = "Log"
        enabled = true
        rule_id = "942260"
      }

      rule {
        # Suspicious use of SQL keywords
        action  = "Log"
        enabled = true
        rule_id = "942400"
      }

      rule {
        # Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)
        action  = "Log"
        enabled = true
        rule_id = "942430"
      }

      rule {
        # SQL Comment Sequence Detected
        action  = "Log"
        enabled = true
        rule_id = "942440"
      }

      rule {
        # SQL Hex Encoding Identified
        action  = "Log"
        enabled = true
        rule_id = "942450"
      }
    }

    override {
      rule_group_name = "RCE"

      rule {
        # Remote Command Execution: Direct Unix Command Execution
        action  = "Log"
        enabled = true
        rule_id = "932150"
      }
    }

    # Exception for ASB-2059 - Exclude all rules for this selector.
    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "comment"
    }

    # Exclusions for APPLICS-631 - Exclude all rules for this selector.
    # POST project update content, which is a strict subset of HTML
    # only applies Back Office, so should be removed from others with new Front Door
    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "applicant.organisationName"
    }


    # Exception for ASB-1692 merged with ASB-1928 - Exclude all rules for this selector.
    # POST project update content, which is a strict subset of HTML
    # only applies Back Office, so should be removed from others with new Front Door
    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "backOfficeProjectUpdateContent"
    }

    # Exclusions for APPLICS-631 - Exclude all rules for this selector.
    # POST project update content, which is a strict subset of HTML
    # only applies Back Office, so should be removed from others with new Front Door
    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "backOfficeProjectUpdateContentWelsh"
    }

    # Exclusions for APPLICS-380 - Exclude all rules for this selector.
    # POST BO project description and locationDescription, POST document fileName
    # only applies Back Office fields.
    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "geographicalInformation.locationDescription"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "geographicalInformation.locationDescriptionWelsh"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "fileName"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "description"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "descriptionWelsh"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "title"
    }

    exclusion {
      match_variable = "RequestBodyPostArgNames"
      operator       = "Equals"
      selector       = "titleWelsh"
    }
  }

  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.1"
    action  = "Block"
  }

  # custom rules in priority order to match the API
  custom_rule {
    name     = "IpBlock"
    action   = "Block"
    enabled  = true
    priority = 10
    type     = "MatchRule"

    match_condition {
      match_variable     = "RemoteAddr"
      operator           = "IPMatch"
      negation_condition = false
      match_values = [
        "10.255.255.255" # placeholder value
      ]
    }
  }

  custom_rule {
    name                           = "RateLimitHttpRequest"
    action                         = "Block"
    enabled                        = true
    priority                       = 100
    type                           = "RateLimitRule"
    rate_limit_duration_in_minutes = var.waf_rate_limits.duration_in_minutes
    rate_limit_threshold           = var.waf_rate_limits.threshold

    match_condition {
      match_variable = "RequestMethod"
      operator       = "Equal"
      match_values = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "COPY",
        "MOVE",
        "HEAD",
        "OPTIONS"
      ]
    }
  }

  lifecycle {
    ignore_changes = [
      # match the first custom rule (IpBlock) and ignore the match values (IPs)
      # managed in Portal
      custom_rule[0].match_condition[0].match_values
    ]
  }
}

resource "azurerm_cdn_frontdoor_security_policy" "wfe" {
  name                     = replace("${local.org}-sec-${local.service_name}-wfe-${var.environment}", "-", "")
  cdn_frontdoor_profile_id = data.azurerm_cdn_frontdoor_profile.shared.id
  provider                 = azurerm.front_door

  security_policies {
    firewall {
      cdn_frontdoor_firewall_policy_id = azurerm_cdn_frontdoor_firewall_policy.wfe.id

      association {
        domain {
          cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_custom_domain.wfe.id
        }
        patterns_to_match = ["/*"]
      }
    }
  }
}
