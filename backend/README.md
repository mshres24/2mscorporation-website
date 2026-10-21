# Careers application mailer (AWS)

The "Apply" modal on `/careers/<slug>` POSTs a JSON body (applicant details + resume as
base64) to `VITE_APPLY_ENDPOINT`. A Lambda behind a public Function URL turns that into
an email, with the resume attached, to the hiring team via SES. Until the endpoint is
configured the modal shows a notice and submissions are disabled.

Everything below is done in the AWS Console. Use one region for all of it
(the SES identity was created in **us-east-1 / N. Virginia**, so use that everywhere).

## 1. SES — verify who can send and receive

SES console → **Identities** → **Create identity**.

- Recommended: verify the **domain** `2mscorporation.com`. SES shows three DKIM CNAME
  records; add them to the domain's DNS. Once they propagate (minutes to an hour) the
  domain shows **Verified**, and *any* `@2mscorporation.com` address can send and receive.
- If you cannot touch DNS, verify these **email addresses** individually instead
  (each gets a click-to-verify email):
  - sender: `careers@2mscorporation.com`
  - recipients: `medhaj@2mscorporation.com`, `megha@2mscorporation.com`,
    `pranaya@2mscorporation.com`

A new SES account is in the **sandbox**: it can only deliver to verified addresses.
That is fine here, since the three recipients are verified. (Only needed later, if you
want applicants to get a confirmation email: **Account dashboard → Request production
access**.)

## 2. IAM — execution role for the Lambda

IAM console → **Roles** → **Create role**

- Trusted entity: **AWS service** → use case **Lambda** → Next
- Attach permission: `AWSLambdaBasicExecutionRole` (CloudWatch logs) → Next
- Name: `2ms-careers-apply-role` → Create role

Open the role → **Add permissions → Create inline policy → JSON**, name it `ses-send`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": "*"
    }
  ]
}
```

## 3. Lambda — the function

Lambda console → **Create function** → *Author from scratch*

- Function name: `2ms-careers-apply`
- Runtime: **Node.js 20.x**
- Architecture: arm64 (cheaper) or x86_64
- Permissions → *Change default execution role* → **Use an existing role** →
  `2ms-careers-apply-role`
- Create function

Then on the function page:

1. **Code** tab → open `index.mjs`, replace its contents with
   [`apply-lambda.mjs`](apply-lambda.mjs) → **Deploy**.
   (No `npm install` or zip upload: `@aws-sdk/client-sesv2` ships with the Node 20
   runtime.)
2. **Configuration → General configuration → Edit**: Timeout **30 sec**, Memory **256 MB**.
3. **Configuration → Environment variables → Edit**:

   | Key | Value |
   |---|---|
   | `SENDER` | `careers@2mscorporation.com` |
   | `RECIPIENTS` | `medhaj@2mscorporation.com,megha@2mscorporation.com,pranaya@2mscorporation.com` |

4. **Configuration → Function URL → Create function URL**
   - Auth type: **NONE**
   - Tick **Configure cross-origin resource sharing (CORS)**:
     - Allow origin: `https://2mscorporation.com` (add `http://localhost:3000` for local testing)
     - Allow methods: `POST`
     - Allow headers: `content-type`
     - Max age: `86400`
   - Save, then copy the URL (looks like `https://abc123.lambda-url.us-east-1.on.aws/`).

   Creating the URL with auth NONE automatically adds the resource-based policy that
   allows public invocation; nothing else to configure. CORS is handled entirely by
   this Function URL setting; the Lambda code deliberately sends no CORS headers
   (duplicates make browsers reject the response). Tighten "Allow origin" to the
   live site origin once it is deployed.

## 4. Frontend

Put the Function URL in the build environment. Locally, create `.env` in the repo root:

```
VITE_APPLY_ENDPOINT=https://abc123.lambda-url.us-east-1.on.aws/
```

For the hosted site, set the same variable where the site is built (Amplify
environment variables, CI secrets, etc.). Vite inlines it at build time, so rebuild
(`npm run build`) and redeploy after changing it.

## 5. Test

Open `/careers/corporate-president` → **Apply for this role** → fill the form, attach a
small PDF → **Submit application**. All three inboxes receive
"Application: Corporate President - <name>" with the resume attached and Reply-To set to
the applicant. If something fails, the modal shows the error, and the Lambda's
CloudWatch log group `/aws/lambda/2ms-careers-apply` has the details.

Quick test of the Lambda alone (replace the URL):

```bash
curl -X POST https://abc123.lambda-url.us-east-1.on.aws/ -H "content-type: application/json" -d "{\"jobTitle\":\"Test\",\"name\":\"Test User\",\"email\":\"you@example.com\",\"message\":\"hello\"}"
```

Expect `{"ok":true}` and an email with no attachment.

## Request format (for reference)

```json
{
  "jobSlug": "corporate-president",
  "jobTitle": "Corporate President",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-0100",
  "linkedin": "https://linkedin.com/in/janedoe",
  "message": "Cover note...",
  "resume": { "filename": "resume.pdf", "contentType": "application/pdf", "data": "<base64>" }
}
```

Limits enforced by the Lambda: resume must be PDF/DOC/DOCX and at most 4 MB.
(Function URL payload limit is 6 MB, which the base64-encoded 4 MB fits in.)

## Hosting note

The careers pages are client-side routes (`/careers`, `/careers/<slug>`). If the site is
hosted on S3/CloudFront, deep links need to resolve to `index.html`: set the CloudFront
**custom error response** for 403/404 → `/index.html` with response code 200 (or use
Amplify / Netlify-style SPA rewrite rules).
