// This is based on https://www.deployawebsite.com/static-sites/s3-terraform/
// and https://medium.com/runatlantis/hosting-our-static-site-over-ssl-with-s3-acm-cloudfront-and-terraform-513b799aec0f

provider "aws" {
  region = "us-east-1"
}

variable "root_domain_name" {
  type = map

  default = {
    dev = "mailmasker-dev.com"
    prod = "mailmasker.com"
  }
}

variable "app_domain_name" {
  type = map

  default = {
    dev = "app.mailmasker-dev.com"
    prod = "app.mailmasker.com"
  }
}

variable "www_domain_name" {
  type = map

  default = {
    dev = "www.mailmasker-dev.com"
    prod = "www.mailmasker.com"
  }
}

resource "aws_s3_bucket" "email-forwarder-www" {
  bucket = "email-forwarder-www-dev"
  acl    = "public-read"
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::email-forwarder-www-${terraform.workspace}/*"]
    }
  ]
}
POLICY

  // S3 understands what it means to host a website.
  website {
    // Here we tell S3 what to use when a request comes in to the root
    // ex. https://www.runatlantis.io
    index_document = "index.html"
    // The page to serve up if a request results in an error or a non-existing
    // page.
    error_document = "/404/"
  }
}

resource "aws_cloudfront_distribution" "email-forwarder-www" {
  enabled         = true
  is_ipv6_enabled = true

  origin {
    domain_name = aws_s3_bucket.email-forwarder-www.bucket_domain_name
    origin_id   = "wwwS3"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id = "wwwS3"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 7200
    max_ttl                = 86400
  }

  aliases = [lookup(var.www_domain_name, terraform.workspace)]

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:747558615165:certificate/06a648d7-dcf4-40af-8ece-b8a1ae85f1e4"
	  ssl_support_method = "sni-only"
  }
}

resource "aws_s3_bucket" "email-forwarder-app" {
  bucket = "email-forwarder-app-dev"
  acl    = "public-read"
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::email-forwarder-app-${terraform.workspace}/*"]
    }
  ]
}
POLICY

  // S3 understands what it means to host a website.
  website {
    // Here we tell S3 what to use when a request comes in to the root
    // ex. https://www.runatlantis.io
    index_document = "index.html"
    // The page to serve up if a request results in an error or a non-existing
    // page.
    error_document = "/404/"
  }
}

resource "aws_cloudfront_distribution" "email-forwarder-app" {
  enabled         = true
  is_ipv6_enabled = true

  origin {
    domain_name = aws_s3_bucket.email-forwarder-app.bucket_domain_name
    origin_id   = "email-forwarder-app-S3"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id = "email-forwarder-app-S3"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 7200
    max_ttl                = 86400
  }

  aliases = [lookup(var.app_domain_name, terraform.workspace)]

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:747558615165:certificate/06a648d7-dcf4-40af-8ece-b8a1ae85f1e4"
	  ssl_support_method = "sni-only"
  }
}


resource "aws_route53_zone" "zone" {
  name = lookup(var.root_domain_name, terraform.workspace)
}

resource "aws_route53_record" "email-forwarder-app" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = lookup(var.app_domain_name, terraform.workspace)
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.email-forwarder-app.domain_name
    zone_id                = aws_cloudfront_distribution.email-forwarder-app.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "email-forwarder-www" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = lookup(var.www_domain_name, terraform.workspace)
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.email-forwarder-www.domain_name
    zone_id                = aws_cloudfront_distribution.email-forwarder-www.hosted_zone_id
    evaluate_target_health = true
  }
}
