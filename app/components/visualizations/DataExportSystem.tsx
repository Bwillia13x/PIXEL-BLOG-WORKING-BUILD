'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { PixelIconLibrary } from '../design-system/PixelIcons';
import { PixelButton, PixelCard } from '../design-system/PixelMicroInteractions';

// Export configuration types
export interface ExportConfig {
  format: 'pdf' | 'png' | 'svg' | 'csv' | 'json' | 'xlsx';
  template: 'minimal' | 'detailed' | 'executive' | 'technical' | 'custom';
  includeCharts: boolean;
  includeData: boolean;
  includeMetadata: boolean;
  dateRange?: { start: Date; end: Date };
  customSections?: string[];
  branding?: {
    logo?: string;
    companyName?: string;
    colors?: { primary: string; secondary: string };
  };
}

export interface ExportableData {
  title: string;
  type: 'analytics' | 'projects' | 'comparison' | 'timeline';
  data: any;
  charts?: {
    id: string;
    title: string;
    element: HTMLElement;
    type: 'chart' | 'table' | 'image';
  }[];
  metadata?: {
    generatedAt: Date;
    generatedBy: string;
    version: string;
    description?: string;
  };
}

// PDF generation utilities (simplified version)
const generatePDFContent = async (config: ExportConfig, data: ExportableData): Promise<string> => {
  const { template, includeCharts, includeData, branding } = config;
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.title}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          background: #0a0a0a;
          color: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #00ff88;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          color: #00ff88;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #888;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #333;
          background: #111;
        }
        .section-title {
          color: #00ff88;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .metric-card {
          background: #222;
          border: 1px solid #444;
          padding: 15px;
        }
        .metric-label {
          color: #888;
          font-size: 12px;
          margin-bottom: 5px;
        }
        .metric-value {
          color: #00ff88;
          font-size: 20px;
          font-weight: bold;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .data-table th,
        .data-table td {
          border: 1px solid #444;
          padding: 8px;
          text-align: left;
        }
        .data-table th {
          background: #333;
          color: #00ff88;
        }
        .chart-placeholder {
          background: #222;
          border: 2px dashed #444;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          margin: 15px 0;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #333;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
  `;

  // Header section
  htmlContent += `
    <div class="header">
      <div class="title">${data.title}</div>
      <div class="subtitle">
        Generated on ${format(new Date(), 'MMMM dd, yyyy')} at ${format(new Date(), 'HH:mm:ss')}
        ${branding?.companyName ? ` • ${branding.companyName}` : ''}
      </div>
    </div>
  `;

  // Executive summary for executive template
  if (template === 'executive') {
    htmlContent += `
      <div class="section">
        <div class="section-title">EXECUTIVE SUMMARY</div>
        <p>This report provides a comprehensive overview of ${data.type} performance and key metrics. 
        The data presented reflects the current state and trends for the specified time period.</p>
      </div>
    `;
  }

  // Metrics section
  if (includeData && data.data) {
    htmlContent += `
      <div class="section">
        <div class="section-title">KEY METRICS</div>
        <div class="metric-grid">
    `;

    // Add sample metrics based on data type
    if (data.type === 'analytics') {
      const metrics = [
        { label: 'Total Visitors', value: '12,543' },
        { label: 'Page Views', value: '45,231' },
        { label: 'Bounce Rate', value: '34.5%' },
        { label: 'Avg Session', value: '3m 42s' }
      ];
      
      metrics.forEach(metric => {
        htmlContent += `
          <div class="metric-card">
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
          </div>
        `;
      });
    }

    htmlContent += `
        </div>
      </div>
    `;
  }

  // Charts section
  if (includeCharts && data.charts) {
    htmlContent += `
      <div class="section">
        <div class="section-title">VISUALIZATIONS</div>
    `;

    data.charts.forEach(chart => {
      htmlContent += `
        <h4>${chart.title}</h4>
        <div class="chart-placeholder">
          Chart: ${chart.title}<br>
          <small>Chart rendering in PDF export requires additional implementation</small>
        </div>
      `;
    });

    htmlContent += `
      </div>
    `;
  }

  // Data tables section for detailed template
  if (template === 'detailed' && includeData) {
    htmlContent += `
      <div class="section">
        <div class="section-title">DETAILED DATA</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Change</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Performance Score</td><td>95%</td><td>+5%</td><td>Excellent</td></tr>
            <tr><td>Security Rating</td><td>A+</td><td>+1</td><td>Secure</td></tr>
            <tr><td>User Satisfaction</td><td>4.8/5</td><td>+0.2</td><td>Very Good</td></tr>
            <tr><td>Load Time</td><td>1.2s</td><td>-0.3s</td><td>Fast</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // Technical details for technical template
  if (template === 'technical') {
    htmlContent += `
      <div class="section">
        <div class="section-title">TECHNICAL SPECIFICATIONS</div>
        <ul>
          <li>Framework: Next.js 15.2.4</li>
          <li>Runtime: Node.js 20.x</li>
          <li>Database: PostgreSQL 15</li>
          <li>Deployment: Vercel</li>
          <li>Monitoring: Custom Analytics</li>
        </ul>
      </div>
    `;
  }

  // Metadata section
  if (data.metadata) {
    htmlContent += `
      <div class="section">
        <div class="section-title">REPORT METADATA</div>
        <table class="data-table">
          <tr><td>Generated At</td><td>${format(data.metadata.generatedAt, 'PPpp')}</td></tr>
          <tr><td>Generated By</td><td>${data.metadata.generatedBy}</td></tr>
          <tr><td>Version</td><td>${data.metadata.version}</td></tr>
          ${data.metadata.description ? `<tr><td>Description</td><td>${data.metadata.description}</td></tr>` : ''}
        </table>
      </div>
    `;
  }

  // Footer
  htmlContent += `
    <div class="footer">
      This report was generated automatically by Pixel Wisdom Analytics System.<br>
      For questions or support, please contact the development team.
    </div>
    </body>
    </html>
  `;

  return htmlContent;
};

// CSV export utility
const generateCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

// JSON export utility
const generateJSON = (data: any, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

// File download utility
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Template preview component
const TemplatePreview = ({ 
  template, 
  isSelected, 
  onSelect 
}: {
  template: { 
    id: string; 
    name: string; 
    description: string; 
    features: string[];
    preview: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer border-2 p-4 transition-colors ${
        isSelected 
          ? 'border-retro-green bg-green-500/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      <div className="aspect-video bg-gray-800 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        <div className="absolute inset-4 border border-gray-600 flex items-center justify-center">
          <span className="text-xs text-gray-400 font-mono">{template.preview}</span>
        </div>
      </div>
      
      <h4 className="font-pixel text-white text-sm mb-1">{template.name}</h4>
      <p className="text-xs text-gray-400 mb-3">{template.description}</p>
      
      <div className="space-y-1">
        {template.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-1 h-1 bg-retro-green" />
            <span className="text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Export progress modal
const ExportProgressModal = ({ 
  isVisible, 
  progress, 
  status, 
  onClose 
}: {
  isVisible: boolean;
  progress: number;
  status: string;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-950 border-2 border-gray-600 p-8 min-w-96"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-pixel text-white mb-6 text-center">
              EXPORTING DATA
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <PixelIconLibrary.Download size={32} color="#00ff88" />
                </motion.div>
              </div>
              
              <div className="w-full bg-gray-700 h-3">
                <motion.div
                  className="h-full bg-retro-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <p className="text-center text-sm font-mono text-gray-300">
                {status}
              </p>
              
              <div className="text-center text-lg font-pixel text-white">
                {progress}%
              </div>
            </div>

            {progress === 100 && (
              <div className="mt-6 text-center">
                <PixelButton onClick={onClose}>
                  Close
                </PixelButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main export system component
export const DataExportSystem = ({ 
  data, 
  className = '' 
}: {
  data: ExportableData;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    template: 'detailed',
    includeCharts: true,
    includeData: true,
    includeMetadata: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple layout with key metrics only',
      features: ['Key metrics', 'Basic charts', 'Compact layout'],
      preview: 'MINIMAL LAYOUT'
    },
    {
      id: 'detailed',
      name: 'Detailed',
      description: 'Comprehensive report with all available data',
      features: ['All metrics', 'Detailed tables', 'Full charts', 'Metadata'],
      preview: 'DETAILED LAYOUT'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Executive summary focused on business metrics',
      features: ['Executive summary', 'Key insights', 'Business metrics'],
      preview: 'EXECUTIVE LAYOUT'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Technical specifications and performance data',
      features: ['Technical specs', 'Performance data', 'System metrics'],
      preview: 'TECHNICAL LAYOUT'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Preparing data...');

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
        
        if (i === 20) setExportStatus('Processing charts...');
        else if (i === 40) setExportStatus('Formatting data...');
        else if (i === 60) setExportStatus('Generating document...');
        else if (i === 80) setExportStatus('Finalizing export...');
        else if (i === 100) setExportStatus('Export completed!');
      }

      // Perform actual export based on format
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `${data.title.replace(/\s+/g, '_')}_${timestamp}`;

      switch (config.format) {
        case 'pdf':
          const htmlContent = await generatePDFContent(config, data);
          // In a real implementation, you would use a library like puppeteer or jsPDF
          downloadFile(htmlContent, `${filename}.html`, 'text/html');
          break;
          
        case 'csv':
          if (Array.isArray(data.data)) {
            generateCSV(data.data, `${filename}.csv`);
          }
          break;
          
        case 'json':
          generateJSON({
            ...data,
            exportConfig: config,
            exportedAt: new Date().toISOString()
          }, `${filename}.json`);
          break;
          
        default:
          console.warn(`Export format ${config.format} not yet implemented`);
      }

      // Keep modal open for a moment to show completion
      setTimeout(() => {
        setIsExporting(false);
        setIsOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed');
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-retro-green text-white font-mono text-sm transition-colors ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PixelIconLibrary.Download size={16} />
        Export Data
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-gray-950 border-2 border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-pixel text-white">EXPORT DATA</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <PixelIconLibrary.Close size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-400 font-mono mt-2">
                  Configure export settings and generate reports
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Format Selection */}
                <div>
                  <h3 className="text-lg font-pixel text-white mb-4">OUTPUT FORMAT</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { format: 'pdf', name: 'PDF Report', desc: 'Formatted document' },
                      { format: 'csv', name: 'CSV Data', desc: 'Spreadsheet compatible' },
                      { format: 'json', name: 'JSON Export', desc: 'Raw data format' },
                      { format: 'png', name: 'PNG Image', desc: 'Visual snapshot' },
                      { format: 'svg', name: 'SVG Vector', desc: 'Scalable graphics' },
                      { format: 'xlsx', name: 'Excel File', desc: 'Advanced spreadsheet' }
                    ].map((format) => (
                      <button
                        key={format.format}
                        onClick={() => setConfig({ ...config, format: format.format as any })}
                        className={`text-left p-3 border transition-colors ${
                          config.format === format.format
                            ? 'border-retro-green bg-green-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="font-mono text-white text-sm">{format.name}</div>
                        <div className="text-xs text-gray-400">{format.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection */}
                {config.format === 'pdf' && (
                  <div>
                    <h3 className="text-lg font-pixel text-white mb-4">REPORT TEMPLATE</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <TemplatePreview
                          key={template.id}
                          template={template}
                          isSelected={config.template === template.id}
                          onSelect={() => setConfig({ ...config, template: template.id as any })}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div>
                  <h3 className="text-lg font-pixel text-white mb-4">EXPORT OPTIONS</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.includeCharts}
                        onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-white font-mono">Include Charts and Visualizations</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.includeData}
                        onChange={(e) => setConfig({ ...config, includeData: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-white font-mono">Include Raw Data Tables</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.includeMetadata}
                        onChange={(e) => setConfig({ ...config, includeMetadata: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-white font-mono">Include Report Metadata</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                  <PixelButton
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </PixelButton>
                  <PixelButton
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    <PixelIconLibrary.Download size={16} />
                    Export {config.format.toUpperCase()}
                  </PixelButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExportProgressModal
        isVisible={isExporting}
        progress={exportProgress}
        status={exportStatus}
        onClose={() => setIsExporting(false)}
      />
    </>
  );
};