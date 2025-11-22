import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DashboardAlert } from "@/actions/dashboard"
import {
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react"

interface DashboardAlertsProps {
  alerts: DashboardAlert[]
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  if (alerts.length === 0) {
    return null
  }

  const getIcon = (type: DashboardAlert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "destructive":
        return <AlertCircle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Alertas</h2>
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={alert.type}>
          {getIcon(alert.type)}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
