I followed the following instructions to make this:
https://medium.com/@wolovim/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af

## Deploying

```
yarn deploy-dev
```

## Running Terraform to manage infrastructure

```
aws-vault exec email-forwarder-dev -- terraform apply
```

## Running locally

### Trusting the certificate

https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904
