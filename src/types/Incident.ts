export interface Incident {
  id: number;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";  // Severity is now restricted to these values.
  reported_at: Date;
  description: string;
}
