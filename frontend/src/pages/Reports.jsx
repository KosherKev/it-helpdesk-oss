import { useState } from "react";
import dashboardService from "../services/dashboardService";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'general' // 'general' or 'performance'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!filters.startDate || !filters.endDate) {
        toast.error('Please select a date range');
        return;
    }

    try {
      setLoading(true);
      const res = await dashboardService.generateReport(filters);
      if (res.success) {
        setReportData(res.data);
        toast.success('Report generated successfully');
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>

      {/* Filter Card */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
        <form onSubmit={handleGenerate} className="flex flex-wrap gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                    type="date" 
                    className="input-field"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                    type="date" 
                    className="input-field"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select 
                    className="input-field min-w-[200px]"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                    <option value="general">General Ticket Report</option>
                    <option value="performance">Technician Performance</option>
                </select>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary h-[42px]"
            >
                {loading ? 'Generating...' : 'Generate Report'}
            </button>
        </form>
      </div>

      {/* Results Section */}
      {reportData && (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    Report Results
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({format(new Date(reportData.filter.startDate), 'MMM d')} - {format(new Date(reportData.filter.endDate), 'MMM d, yyyy')})
                    </span>
                </h2>
                <span className="text-sm text-gray-500">Generated at {format(new Date(reportData.generatedAt), 'HH:mm')}</span>
            </div>

            {filters.type === 'general' ? (
                <div className="card p-0 overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">Ticket #</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.data.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono">{ticket.ticketNumber}</td>
                                    <td className="p-4">{ticket.title}</td>
                                    <td className="p-4">
                                        <span className={`badge 
                                            ${ticket.status === 'open' ? 'badge-info' : 
                                              ticket.status === 'resolved' ? 'badge-success' : 
                                              ticket.status === 'in-progress' ? 'badge-warning' :
                                              'badge-neutral'}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`badge 
                                            ${ticket.priority === 'urgent' ? 'badge-danger' : 
                                              ticket.priority === 'high' ? 'badge-warning' : 
                                              'badge-neutral'}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {format(new Date(ticket.createdAt), 'MMM d, HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">Technician ID</th>
                                <th className="p-4">Avg Resolution Time (ms)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.data.map((stat, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono">{stat._id || 'Unassigned'}</td>
                                    <td className="p-4">
                                        {stat.avgResolutionTime ? 
                                            `${(stat.avgResolutionTime / (1000 * 60 * 60)).toFixed(1)} hours` : 
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      )}
    </div>
  )
}
