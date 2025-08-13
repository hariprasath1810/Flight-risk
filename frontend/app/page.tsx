// frontend/app/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { User, BarChart, Briefcase, Mail, Loader, AlertTriangle, Sparkles, ServerCrash } from 'lucide-react';

// --- Type Definitions ---
type AnalysisResult = {
  risk_analysis: string;
  career_path: string;
  manager_communication: string;
};

type EmployeeData = {
  name: string;
  role: string;
  tenure_months: number;
  performance_score: number;
  satisfaction_score: number;
  recent_feedback: string;
  manager_name: string;
};

// --- Main Page Component ---
export default function HomePage() {
  const [formData, setFormData] = useState<EmployeeData>({
    name: "Jane Doe",
    role: "Senior Software Engineer",
    tenure_months: 24,
    performance_score: 4.5,
    satisfaction_score: 3,
    recent_feedback: "Expressed boredom with current projects and mentioned a lack of growth opportunities.",
    manager_name: "John Smith",
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred. Is the backend server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-brand-primary" />
                <h1 className="text-2xl font-bold text-brand-secondary">
                    AI Employee Retention Agent
                </h1>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Input Form Section --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-brand-secondary mb-4 flex items-center">
              <User className="mr-2 h-6 w-6 text-brand-primary" />
              Employee Data Input
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Employee Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="role" id="role" value={formData.role} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="tenure_months" className="block text-sm font-medium text-gray-700">Tenure (Months)</label>
                <input type="number" name="tenure_months" id="tenure_months" value={formData.tenure_months} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="performance_score" className="block text-sm font-medium text-gray-700">Performance Score (1-5)</label>
                <input type="number" name="performance_score" id="performance_score" step="0.1" min="1" max="5" value={formData.performance_score} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="satisfaction_score" className="block text-sm font-medium text-gray-700">Satisfaction Score (1-5)</label>
                <input type="number" name="satisfaction_score" id="satisfaction_score" step="1" min="1" max="5" value={formData.satisfaction_score} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="recent_feedback" className="block text-sm font-medium text-gray-700">Recent Feedback</label>
                <textarea name="recent_feedback" id="recent_feedback" value={formData.recent_feedback} onChange={handleInputChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">Manager's Name</label>
                <input type="text" name="manager_name" id="manager_name" value={formData.manager_name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400">
                {isLoading ? <><Loader className="animate-spin mr-2" /> Analyzing...</> : "Run Analysis"}
              </button>
            </form>
          </div>

          {/* --- Results Section --- */}
          <div className="lg:col-span-2 space-y-8">
            {isLoading && (
              <div className="flex justify-center items-center h-full bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <Loader className="h-12 w-12 text-brand-primary animate-spin mx-auto" />
                  <p className="mt-4 text-lg font-medium text-gray-700">AI agents are collaborating...</p>
                  <p className="text-sm text-gray-500">This may take a moment.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ServerCrash className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {analysis && (
              <div className="space-y-8">
                <ResultCard title="Flight Risk Analysis" icon={<AlertTriangle className="text-red-500" />}>
                  <div className="prose prose-sm max-w-none">{formatText(analysis.risk_analysis)}</div>
                </ResultCard>
                <ResultCard title="Career Path Recommendation" icon={<Briefcase className="text-green-500" />}>
                  <div className="prose prose-sm max-w-none">{formatText(analysis.career_path)}</div>
                </ResultCard>
                <ResultCard title="Manager Communication Draft" icon={<Mail className="text-blue-500" />}>
                  <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border border-gray-200">{formatText(analysis.manager_communication)}</div>
                </ResultCard>
              </div>
            )}
            {!isLoading && !error && !analysis && (
              <div className="flex justify-center items-center h-full bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-lg font-medium text-gray-700">Analysis will appear here</p>
                  <p className="text-sm text-gray-500">Fill out the form and click "Run Analysis" to begin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Result Card Component ---
const ResultCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-brand-secondary mb-4 flex items-center">
      <span className="mr-3 h-6 w-6 flex items-center justify-center">{icon}</span>
      {title}
    </h3>
    <div className="text-gray-600 space-y-2">
      {children}
    </div>
  </div>
);
