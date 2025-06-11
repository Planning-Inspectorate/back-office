# variables should be sorted A-Z

# variable "common_config" {
#   description = "Config for the common resources, such as action groups"
#   type = object({
#     resource_group_name = string
#     action_group_names = object({
#       iap      = string
#       its      = string
#       info_sec = string
#     })
#   })
# }

variable "environment" {
  description = "The name of the environment in which resources will be deployed"
  type        = string
}

variable "front_door_config" {
  description = "Config for the frontdoor in tooling subscription"
  type = object({
    name        = string
    rg          = string
    ep_name     = string
    use_tooling = bool
  })
}

variable "web_app_config" {
  description = "Config to retrive web app details for forntdoor"
  type = object({
    name = string
    rg   = string
  })
}

variable "tags" {
  description = "A collection of tags to assign to taggable resources"
  type        = map(string)
  default     = {}
}

variable "tooling_config" {
  description = "Config for the tooling subscription resources"
  type = object({
    container_registry_name = string
    container_registry_rg   = string
    network_name            = string
    network_rg              = string
    subscription_id         = string
  })
}

# variable "vnet_config" {
#   description = "VNet configuration"
#   type = object({
#     address_space                       = string
#     apps_subnet_address_space           = string
#     main_subnet_address_space           = string
#     secondary_address_space             = string
#     secondary_apps_subnet_address_space = string
#     secondary_subnet_address_space      = string
#   })
# }

# tflint-ignore: terraform_unused_declarations
variable "waf_rate_limits" {
  description = "Config for Service Bus"
  type = object({
    enabled             = bool
    duration_in_minutes = number
    threshold           = number
  })
}

variable "web_domain" {
  description = "Settings for the web app"
  type        = string
}
