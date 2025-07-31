import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Verify GitHub webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(payload)
  const digest = `sha256=${hmac.digest("hex")}`
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Trigger GitHub Actions workflow
async function triggerWorkflow(owner: string, repo: string, ref = "main") {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/deploy.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: ref,
      }),
    },
  )

  return response.ok
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-hub-signature-256") || ""
    const event = request.headers.get("x-github-event") || ""

    // Verify webhook signature (optional but recommended)
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    if (webhookSecret && !verifySignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)

    console.log(`Received GitHub event: ${event}`)

    // Handle different GitHub events
    switch (event) {
      case "push":
        // Trigger deployment on push to main branch
        if (payload.ref === "refs/heads/main") {
          console.log("Push to main branch detected, triggering deployment...")

          const success = await triggerWorkflow(payload.repository.owner.login, payload.repository.name, "main")

          if (success) {
            console.log("Deployment triggered successfully")
            return NextResponse.json({
              message: "Deployment triggered",
              commit: payload.head_commit.id,
              author: payload.head_commit.author.name,
            })
          } else {
            console.error("Failed to trigger deployment")
            return NextResponse.json({ error: "Failed to trigger deployment" }, { status: 500 })
          }
        }
        break

      case "pull_request":
        // Trigger deployment for PR events (opened, synchronized, etc.)
        if (["opened", "synchronize", "reopened"].includes(payload.action)) {
          console.log(`PR ${payload.action}, triggering preview deployment...`)

          const success = await triggerWorkflow(
            payload.repository.owner.login,
            payload.repository.name,
            payload.pull_request.head.ref,
          )

          if (success) {
            return NextResponse.json({
              message: "Preview deployment triggered",
              pr_number: payload.pull_request.number,
              branch: payload.pull_request.head.ref,
            })
          }
        }
        break

      case "release":
        // Trigger deployment on release published
        if (payload.action === "published") {
          console.log("Release published, triggering production deployment...")

          const success = await triggerWorkflow(
            payload.repository.owner.login,
            payload.repository.name,
            payload.release.tag_name,
          )

          if (success) {
            return NextResponse.json({
              message: "Production deployment triggered",
              release: payload.release.tag_name,
            })
          }
        }
        break

      case "workflow_run":
        // Handle workflow completion events
        if (payload.action === "completed") {
          console.log(`Workflow ${payload.workflow_run.name} completed with status: ${payload.workflow_run.conclusion}`)

          return NextResponse.json({
            message: "Workflow status received",
            workflow: payload.workflow_run.name,
            status: payload.workflow_run.conclusion,
          })
        }
        break

      default:
        console.log(`Unhandled event: ${event}`)
    }

    return NextResponse.json({ message: "Event received but no action taken" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "GitHub Deployment Bot is running",
    timestamp: new Date().toISOString(),
  })
}
