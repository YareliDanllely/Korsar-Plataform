import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {

  return (
    <div className="h-56 grid grid-cols-2 gap-4 content-start">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}

export default Dashboard;
