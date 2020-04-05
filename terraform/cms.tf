
// AWS Certificate Manager requires these CNAMEs to be in place to verify ownership of the domain

// Proves ownership of *.mailmasker-dev.com and mailmasker-dev.com
resource "aws_route53_record" "email-forwarder-certificate-root" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "_8ec9d2aca668ac50b8b317939e4210ca.mailmasker-dev.com."
  type    = "CNAME"
	records = ["_71690af1ee8e8d1b1ced33c987666a27.nhqijqilxf.acm-validations.aws."]
	ttl     = "60"
}

resource "aws_route53_record" "email-forwarder-certificate-app" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "_8b0ce678d371bcb38b04ea18fbb5df73.app.mailmasker-dev.com."
  type    = "CNAME"
	records = ["_7dd9a59af1f7c4707cd90da727afb4eb.nhqijqilxf.acm-validations.aws."]
	ttl     = "60"
}

resource "aws_route53_record" "email-forwarder-certificate-www" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "_edece6c8ebad5809073f0e1ae9f4cc5b.www.mailmasker-dev.com."
  type    = "CNAME"
	records = ["_f4abf3b2ebbbd0ea7bf667c6be813280.nhqijqilxf.acm-validations.aws."]
	ttl     = "60"
}

