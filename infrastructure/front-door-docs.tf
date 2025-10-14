# use a data block to read the storage account as its not in this repo yet
data "azurerm_storage_account" "documents" {
  name                = var.documents_config.storage_account_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_cdn_frontdoor_origin_group" "docs" {
  name                     = "${local.org}-fd-${local.service_name}-docs-${var.environment}"
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

resource "azurerm_cdn_frontdoor_origin" "docs" {
  name                          = "${local.org}-fd-${local.service_name}-docs-${var.environment}"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.docs.id
  enabled                       = true
  provider                      = azurerm.front_door

  certificate_name_check_enabled = true

  host_name          = local.documents.blob_endpont
  origin_host_header = local.documents.blob_endpont
  http_port          = 80
  https_port         = 443
  priority           = 1
  weight             = 1000
}

resource "azurerm_cdn_frontdoor_custom_domain" "docs" {
  name                     = "${local.org}-fd-${local.service_name}-docs-${var.environment}"
  cdn_frontdoor_profile_id = data.azurerm_cdn_frontdoor_profile.shared.id
  host_name                = local.documents.domain
  provider                 = azurerm.front_door

  tls {
    certificate_type = "ManagedCertificate"
  }
}

resource "azurerm_cdn_frontdoor_route" "docs" {
  name                          = "${local.org}-fd-${local.service_name}-docs-${var.environment}"
  cdn_frontdoor_endpoint_id     = data.azurerm_cdn_frontdoor_endpoint.shared.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.docs.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.docs.id]
  provider                      = azurerm.front_door

  forwarding_protocol    = "MatchRequest"
  https_redirect_enabled = true
  patterns_to_match      = ["/*"]
  supported_protocols    = ["Http", "Https"]

  # link the domain to the route
  cdn_frontdoor_custom_domain_ids = [azurerm_cdn_frontdoor_custom_domain.docs.id]
  link_to_default_domain          = false

  # link the ruleset to the route
  cdn_frontdoor_rule_set_ids = [azurerm_cdn_frontdoor_rule_set.robot_header_tags.id]
}

resource "azurerm_cdn_frontdoor_custom_domain_association" "docs" {
  cdn_frontdoor_custom_domain_id = azurerm_cdn_frontdoor_custom_domain.docs.id
  cdn_frontdoor_route_ids        = [azurerm_cdn_frontdoor_route.docs.id]
  provider                       = azurerm.front_door
}

# add robot header tags to files/routes which should not be indexed
resource "azurerm_cdn_frontdoor_rule_set" "robot_header_tags" {
  name                     = "RobotsHeaderTags"
  cdn_frontdoor_profile_id = data.azurerm_cdn_frontdoor_profile.shared.id
}

resource "azurerm_cdn_frontdoor_rule" "robot_header_tags_book_reference" {
  name                      = "RobotsHeaderTagsBookReference"
  cdn_frontdoor_rule_set_id = azurerm_cdn_frontdoor_rule_set.robot_header_tags.id
  order                     = 1
  behavior_on_match         = "Continue"

  actions {
    response_header_action {
      header_action = "Append"
      header_name   = "X-Robots-Tag"
      value         = "noindex,nofollow"
    }
  }

  conditions {
    url_filename_condition {
      operator     = "Contains"
      match_values = ["book"]
      transforms   = ["Lowercase"]
    }
  }
}
