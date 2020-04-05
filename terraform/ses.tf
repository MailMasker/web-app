
// AWS Simple Email Service requires this TXT record to be in place to verify ownership of the domain

resource "aws_route53_record" "email-forwarder-ses" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "_amazonses.mailmasker-dev.com."
  type    = "TXT"
	records = ["oO1XmQmRl83zPLSrL+pea3H3ZbzkWLbreGziWl9l5hM="]
	ttl     = "60"
}
