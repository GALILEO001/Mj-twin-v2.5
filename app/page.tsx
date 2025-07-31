import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bot, GitBranch, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">GitHub Deployment Bot</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Automatically trigger and monitor your GitHub Actions deployments with intelligent webhook handling
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Auto Triggers</CardTitle>
              <CardDescription>Automatically trigger deployments on push, PR, and release events</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Push to main branch</li>
                <li>• Pull request events</li>
                <li>• Release published</li>
                <li>• Custom webhook events</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Manual Control</CardTitle>
              <CardDescription>Trigger deployments manually with full control over branch and workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Manual deployment triggers</li>
                <li>• Branch/tag selection</li>
                <li>• Workflow monitoring</li>
                <li>• Real-time status updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Smart Monitoring</CardTitle>
              <CardDescription>Monitor deployment status and get detailed insights into your workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Deployment history</li>
                <li>• Status tracking</li>
                <li>• Error reporting</li>
                <li>• GitHub integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription className="text-gray-300">Simple setup, powerful automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Configure Webhook</h3>
                <p className="text-sm text-gray-300">Add the webhook URL to your GitHub repository settings</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Auto Deploy</h3>
                <p className="text-sm text-gray-300">
                  Push code or create releases to automatically trigger deployments
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Monitor & Control</h3>
                <p className="text-sm text-gray-300">Track deployment status and manually trigger when needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
