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
