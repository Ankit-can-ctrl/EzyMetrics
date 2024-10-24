import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Layout,
  LayoutDashboard,
  Users,
  BarChart,
  FileText,
  Settings,
  Plus,
  Download,
  X,
} from "lucide-react";

// Dummy data remains the same
const performanceData = [
  { name: "Jan", leads: 400, conversions: 240 },
  { name: "Feb", leads: 300, conversions: 139 },
  { name: "Mar", leads: 200, conversions: 980 },
  { name: "Apr", leads: 278, conversions: 390 },
  { name: "May", leads: 189, conversions: 480 },
];

const leadsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "New",
    value: "$1,200",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Contacted",
    value: "$3,400",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Qualified",
    value: "$2,800",
  },
];

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("performance");
  const [reportPeriod, setReportPeriod] = useState("month");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const asideRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        asideRef.current &&
        !asideRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle mobile menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const reportData = {
        title: `EzyMetrics ${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        } Report`,
        period: reportPeriod,
        date: new Date().toLocaleDateString(),
        data: reportType === "performance" ? performanceData : leadsData,
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ezymetrics-${reportType}-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowReportModal(false);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const SidebarLink = ({ icon: Icon, text, id, onClick }) => (
    <button
      onClick={onClick || (() => setActiveSection(id))}
      className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors
        ${
          activeSection === id
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
    >
      <Icon size={20} />
      <span>{text}</span>
    </button>
  );

  const Widget = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Settings className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-end">
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        ref={asideRef}
        className={`
        fixed lg:static w-64 h-full bg-white border-r transition-transform duration-200 ease-in-out z-20
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <Layout className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">EzyMetrics</span>
          </div>

          <nav className="space-y-2">
            <SidebarLink
              icon={LayoutDashboard}
              text="Dashboard"
              id="dashboard"
            />
            <SidebarLink icon={Users} text="Leads" id="leads" />
            <SidebarLink icon={BarChart} text="Analytics" id="analytics" />
            <SidebarLink
              icon={FileText}
              text="Reports"
              id="reports"
              onClick={() => setShowReportModal(true)}
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex space-x-2">
              <button
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Layout className="h-4 w-4" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Add Widget</span>
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Widget title="Total Leads">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-500">+12.3% from last month</p>
            </Widget>

            <Widget title="Conversion Rate">
              <div className="text-2xl font-bold">23.5%</div>
              <p className="text-xs text-gray-500">+2.1% from last month</p>
            </Widget>

            <Widget title="Revenue">
              <div className="text-2xl font-bold">$45,678</div>
              <p className="text-xs text-gray-500">+15.8% from last month</p>
            </Widget>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Widget title="Performance Overview">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#2563eb" />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#16a34a"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Widget>

            <Widget title="Recent Leads">
              <div className="h-80 overflow-auto">
                <div className="space-y-4">
                  {leadsData.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">
                          {lead.email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{lead.value}</div>
                        <div className="text-xs text-gray-500">
                          {lead.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Widget>
          </div>
        </div>
      </main>

      {/* Report Generation Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Generate Report</h2>
          <p className="text-sm text-gray-500">
            Select the type of report and time period you want to generate.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="performance">Performance Report</option>
              <option value="leads">Leads Report</option>
              <option value="revenue">Revenue Report</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Time Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isGeneratingReport ? (
                "Generating..."
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
