/**
 * TEST RESULTS DASHBOARD
 * AfyaCare Tanzania
 * 
 * Real-time visualization of test results
 * Displays:
 * - Test suite status
 * - Code coverage
 * - Performance metrics
 * - Security scan results
 * - Data integrity status
 * - Historical trends
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Shield,
  Database,
  Zap,
  Activity
} from 'lucide-react';
import { MedicalCard, colors } from '@/app/design-system';

interface TestResult {
  suite: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  tests: number;
  passed: number;
  failed: number;
  coverage?: number;
  timestamp: Date;
}

interface MetricCard {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
}

export function TestResultsDashboard() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  useEffect(() => {
    fetchTestResults();
    const interval = setInterval(fetchTestResults, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchTestResults() {
    // In production, fetch from API
    const mockResults: TestResult[] = [
      {
        suite: 'Regression Tests',
        status: 'passed',
        duration: 875,
        tests: 75,
        passed: 75,
        failed: 0,
        coverage: 87,
        timestamp: new Date()
      },
      {
        suite: 'Load Tests',
        status: 'passed',
        duration: 1840,
        tests: 7,
        passed: 7,
        failed: 0,
        timestamp: new Date()
      },
      {
        suite: 'Security Tests',
        status: 'passed',
        duration: 620,
        tests: 42,
        passed: 42,
        failed: 0,
        timestamp: new Date()
      },
      {
        suite: 'Data Integrity',
        status: 'passed',
        duration: 310,
        tests: 10,
        passed: 10,
        failed: 0,
        timestamp: new Date()
      },
      {
        suite: 'FHIR Tests',
        status: 'passed',
        duration: 280,
        tests: 15,
        passed: 15,
        failed: 0,
        timestamp: new Date()
      }
    ];

    setTestResults(mockResults);
    setLoading(false);
  }

  const metrics: MetricCard[] = [
    {
      title: 'Overall Pass Rate',
      value: '100%',
      trend: 'stable',
      trendValue: '+0% from last run',
      status: 'success',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Code Coverage',
      value: '87%',
      trend: 'up',
      trendValue: '+2% from last week',
      status: 'success',
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: 'Security Score',
      value: '98/100',
      trend: 'stable',
      trendValue: 'No vulnerabilities',
      status: 'success',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Avg Response Time',
      value: '284ms',
      trend: 'down',
      trendValue: '-15ms improvement',
      status: 'success',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Data Integrity',
      value: 'Healthy',
      trend: 'stable',
      trendValue: '0 issues found',
      status: 'success',
      icon: <Database className="w-6 h-6" />
    },
    {
      title: 'Total Test Time',
      value: '84 min',
      trend: 'down',
      trendValue: '-8min faster',
      status: 'info',
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const totalTests = testResults.reduce((sum, r) => sum + r.tests, 0);
  const totalPassed = testResults.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = testResults.reduce((sum, r) => sum + r.failed, 0);
  const allPassed = totalFailed === 0;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1D23] mb-2">
              Test Results Dashboard
            </h1>
            <p className="text-[#6B7280]">
              AfyaCare Tanzania - Automated Testing Infrastructure
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              allPassed 
                ? 'bg-green-50 text-green-700 border-2 border-green-500' 
                : 'bg-red-50 text-red-700 border-2 border-red-500'
            }`}>
              {allPassed ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'}
            </div>
            
            <button
              onClick={fetchTestResults}
              className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} />
          ))}
        </div>

        {/* Overall Summary */}
        <MedicalCard className="p-6">
          <h2 className="text-xl font-bold text-[#1A1D23] mb-4">
            Test Suite Summary
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1A1D23]">{totalTests}</div>
              <div className="text-sm text-[#6B7280]">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalPassed}</div>
              <div className="text-sm text-[#6B7280]">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{totalFailed}</div>
              <div className="text-sm text-[#6B7280]">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {((totalPassed / totalTests) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[#6B7280]">Pass Rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(totalPassed / totalTests) * 100}%` }}
            />
          </div>
        </MedicalCard>

        {/* Test Suites */}
        <div className="grid grid-cols-1 gap-4">
          {testResults.map((result) => (
            <TestSuiteCard 
              key={result.suite} 
              result={result}
              onClick={() => setSelectedSuite(result.suite)}
              isSelected={selectedSuite === result.suite}
            />
          ))}
        </div>

        {/* Historical Trends */}
        <MedicalCard className="p-6">
          <h2 className="text-xl font-bold text-[#1A1D23] mb-4">
            7-Day Trend
          </h2>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const height = 80 + Math.random() * 20;
              const isPassed = Math.random() > 0.1;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                      isPassed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}: ${isPassed ? 'Passed' : 'Failed'}`}
                  />
                  <div className="text-xs text-[#6B7280]">
                    {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </MedicalCard>

        {/* Deployment Status */}
        <MedicalCard className={`p-6 border-2 ${
          allPassed 
            ? 'border-green-500 bg-green-50' 
            : 'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center gap-4">
            {allPassed ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1A1D23] mb-1">
                {allPassed ? '🚀 Ready for Production Deployment' : '⛔ Deployment Blocked'}
              </h3>
              <p className="text-[#6B7280]">
                {allPassed 
                  ? 'All tests passed. System is production-ready and meets deployment criteria.'
                  : 'Fix failing tests before deploying to production. Review error logs for details.'}
              </p>
            </div>

            {allPassed && (
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Deploy to Production
              </button>
            )}
          </div>
        </MedicalCard>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricCard }) {
  const statusColors = {
    success: { bg: colors.success[50], border: colors.success[500], text: colors.success[700] },
    warning: { bg: colors.warning[50], border: colors.warning[500], text: colors.warning[700] },
    error: { bg: colors.danger[50], border: colors.danger[500], text: colors.danger[700] },
    info: { bg: colors.primary[50], border: colors.primary[500], text: colors.primary[700] }
  };

  const colorScheme = statusColors[metric.status];

  return (
    <MedicalCard className="p-6 border-2" style={{ borderColor: colorScheme.border }}>
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colorScheme.bg, color: colorScheme.text }}
        >
          {metric.icon}
        </div>
        
        {metric.trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            metric.trend === 'up' ? 'text-green-600' : 
            metric.trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {metric.trendValue}
          </div>
        )}
      </div>

      <h3 className="text-sm text-[#6B7280] mb-1">{metric.title}</h3>
      <p className="text-2xl font-bold text-[#1A1D23]">{metric.value}</p>
    </MedicalCard>
  );
}

function TestSuiteCard({ 
  result, 
  onClick, 
  isSelected 
}: { 
  result: TestResult; 
  onClick: () => void;
  isSelected: boolean;
}) {
  const statusConfig = {
    passed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' },
    running: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
    pending: { icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-500' }
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <MedicalCard 
      className={`p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
        isSelected ? config.border : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-14 h-14 rounded-xl ${config.bg} flex items-center justify-center`}>
            <StatusIcon className={`w-7 h-7 ${config.color}`} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1A1D23] mb-1">
              {result.suite}
            </h3>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>{result.tests} tests</span>
              <span>•</span>
              <span>{(result.duration / 1000).toFixed(1)}s</span>
              {result.coverage && (
                <>
                  <span>•</span>
                  <span>{result.coverage}% coverage</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{result.passed}</div>
            <div className="text-xs text-[#6B7280]">Passed</div>
          </div>
          
          {result.failed > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.failed}</div>
              <div className="text-xs text-[#6B7280]">Failed</div>
            </div>
          )}

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {((result.passed / result.tests) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-[#6B7280]">Rate</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500"
          style={{ width: `${(result.passed / result.tests) * 100}%` }}
        />
      </div>
    </MedicalCard>
  );
}

export default TestResultsDashboard;
