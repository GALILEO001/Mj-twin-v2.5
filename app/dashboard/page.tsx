"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, RefreshCw, ExternalLink } from "lucide-react"

interface WorkflowRun {
  id: number
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
  head_branch: string
  head_sha: string
  html_url: string
}

export default function Dashboard() {
  const [owner, setOwner] = useState("")
  const [repo, setRepo] = useState("")
  const [ref, setRef] = useState("main")
  const [isTriggering, setIsTriggering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [message, setMessage] = useState("")

  const triggerDeployment = async () => {
    if (!owner || !repo) {
      setMessage("Please enter owner and repo")
      return
    }

    setIsTriggering(true)
    setMessage("")

    try {
      const response = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, ref }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ Deployment triggered successfully!")
        setTimeout(() => fetchStatus(), 2000) // Refresh status after 2 seconds
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Failed to trigger deployment")
    } finally {
      setIsTriggering(false)
    }
  }

  const fetchStatus = async () => {
    if (!owner || !repo) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/status?owner=${owner}&repo=${repo}`)
      const data = await response.json()

      if (response.ok) {
        setRuns(data.latest_runs || [])
      }
    } catch (error) {
      console.error("Failed to fetch status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (owner && repo) {
      fetchStatus()
    }
  }, [owner, repo])

  const getStatusBadge = (status: string, conclusion: string | null) => {
    if (status === "in_progress") {
      return <Badge variant="secondary">🔄 Running</Badge>
    }
    if (conclusion === "success") {
      return <Badge variant="default">✅ Success</Badge>
    }
    if (conclusion === "failure") {
      return <Badge variant="destructive">❌ Failed</Badge>
    }
    if (conclusion === "cancelled") {
      return <Badge variant="outline">⏹️ Cancelled</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">GitHub Deployment Bot</h1>
        <p className="text-muted-foreground mt-2">Trigger and monitor your GitHub Actions deployments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Deployment Trigger</CardTitle>
          <CardDescription>Manually trigger a deployment for your repository</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner">Repository Owner</Label>
              <Input id="owner" placeholder="e.g., octocat" value={owner} onChange={(e) => setOwner(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="repo">Repository Name</Label>
              <Input id="repo" placeholder="e.g., my-app" value={repo} onChange={(e) => setRepo(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="ref">Branch/Tag</Label>
            <Input id="ref" placeholder="main" value={ref} onChange={(e) => setRef(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button onClick={triggerDeployment} disabled={isTriggering || !owner || !repo} className="flex-1">
              {isTriggering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Triggering...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Trigger Deployment
                </>
              )}
            </Button>

            <Button variant="outline" onClick={fetchStatus} disabled={isLoading || !owner || !repo}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {message && <div className="p-3 rounded-md bg-muted text-sm">{message}</div>}
        </CardContent>
      </Card>

      {runs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
            <CardDescription>
              Latest deployment workflow runs for {owner}/{repo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {runs.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(run.status, run.conclusion)}
                    <div>
                      <div className="font-medium">
                        {run.head_branch} ({run.head_sha})
                      </div>
                      <div className="text-sm text-muted-foreground">{new Date(run.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={run.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Webhook Setup</CardTitle>
          <CardDescription>Configure your GitHub repository to automatically trigger deployments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhook`}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/webhook`)}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Setup Instructions:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to your GitHub repository settings</li>
              <li>Navigate to "Webhooks" and click "Add webhook"</li>
              <li>Paste the webhook URL above</li>
              <li>Set Content type to "application/json"</li>
              <li>Select events: Push, Pull requests, Releases, Workflow runs</li>
              <li>Add webhook</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
