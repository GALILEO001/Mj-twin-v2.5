import { type NextRequest, NextResponse } from "next/server"

// Get deployment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 })
    }

    // Get latest workflow runs
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=10`, {
      headers: {
        Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      const deploymentRuns = data.workflow_runs.filter((run: any) => run.name === "Deploy to Production")

      return NextResponse.json({
        latest_runs: deploymentRuns.slice(0, 5).map((run: any) => ({
          id: run.id,
          status: run.status,
          conclusion: run.conclusion,
          created_at: run.created_at,
          updated_at: run.updated_at,
          head_branch: run.head_branch,
          head_sha: run.head_sha.substring(0, 7),
          html_url: run.html_url,
        })),
      })
    } else {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: response.status })
    }
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
