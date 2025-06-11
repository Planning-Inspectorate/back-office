locals {
  org              = "pins"
  service_name     = "back-office"
  primary_location = "uk-west"
  # tflint-ignore: terraform_unused_declarations
  secondary_location = "uk-south"

  # resource_suffix           = "${local.service_name}-${var.environment}"
  # secondary_resource_suffix = "${local.service_name}-secondary-${var.environment}"

  tags = merge(
    var.tags,
    {
      CreatedBy   = "terraform"
      Environment = var.environment
      ServiceName = local.service_name
      location    = local.primary_location
    }
  )


####################### IP LIST NEEDED? #######################

  # get the IPs from the ip_blacklist secure file

  ip_blacklist_file_path = "${path.module}/ip_blacklist.json"
  ip_blacklist_data = try(
    jsondecode(file(local.ip_blacklist_file_path)),
    []
  )
  ip_blacklist = [
    for prefix in try(local.ip_blacklist_data.prefixes, [{ ipv4Prefix = "10.255.255.255" }]) :
    lookup(
      prefix,
      "ipv4Prefix",
      lookup(prefix, "ipv6Prefix", null)
    )
  ]
}
