import { type NextRequest, NextResponse } from "next/server"

// Manual deployment trigger endpoint
export async function POST(request: NextRequest) {
  try {
    const { owner, repo, ref = "main", workflow = "deploy.yml" } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 })
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref }),
      },
    )

    if (response.ok) {
      return NextResponse.json({
        message: "Deployment triggered successfully",
        owner,
        repo,
        ref,
        workflow,
      })
    } else {
      const error = await response.text()
      return NextResponse.json(
        {
          error: "Failed to trigger deployment",
          details: error,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Manual trigger error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
