import { useOutletContext } from "react-router-dom";
import { DashboardContextType } from "../../pages/DashboardPageLayout";

export default function useDashboard() {
  return useOutletContext<DashboardContextType>()
}