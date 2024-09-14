import { Card, Button, Table } from 'flowbite-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem, ChartTypeRegistry, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {

  return (
    <div className="h-56 grid grid-cols-2 gap-4 content-start">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}

export default Dashboard;
