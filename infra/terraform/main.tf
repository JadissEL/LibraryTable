# ====================================
# TERRAFORM CONFIGURATION BLOCK
# ====================================
# This block configures Terraform itself and declares required providers
# Learning Path: Infrastructure as Code (IaC)
# - Learn Terraform basics: https://www.terraform.io/intro
# - Understanding HashiCorp Configuration Language (HCL)
# - Version control best practices for infrastructure code

terraform {
  # Specifies the minimum Terraform version required
  # Skills to learn: Semantic versioning, Backward compatibility
  required_version = ">= 1.0.0"
  
  # Declares the providers needed for this infrastructure
  # Skills to learn: Provider architecture, Plugin-based systems
  required_providers {
    kubernetes = {
      # Source of the provider - HashiCorp's official Kubernetes provider
      # Skills to learn: Terraform Registry, Provider ecosystem
      source  = "hashicorp/kubernetes"
      
      # Provider version constraint using semantic versioning
      # Skills to learn: Dependency management, Version constraints
      version = "~> 2.0"
    }
  }
}

# ====================================
# KUBERNETES PROVIDER CONFIGURATION
# ====================================
# Configures the Kubernetes provider with necessary credentials
# Learning Path: Kubernetes Administration
# - Kubernetes architecture
# - Kubernetes authentication and authorization
# - kubectl configuration and context management

provider "kubernetes" {
  # Path to kubeconfig file for Kubernetes cluster access
  # Skills to learn: 
  # - Kubernetes authentication methods
  # - Managing multiple cluster contexts
  # - Security best practices for kubeconfig files
  config_path = var.kubeconfig_path
}
