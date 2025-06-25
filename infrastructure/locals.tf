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

  documents = {
    # strip leading "https://" and trailing "/" to leave just the domain names
    domain       = replace(replace(var.documents_config.domain, "https://", ""), "/", "")
    blob_endpont = replace(replace(data.azurerm_storage_account.documents.primary_blob_endpoint, "https://", ""), "/", "")
  }
}
