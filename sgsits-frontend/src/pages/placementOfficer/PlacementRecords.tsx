import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, Badge } from '../../components/layout/PortalLayout'
import { getBranches, type Branch } from '../../services/examService'
import { Plus, Search, FileSpreadsheet, Download, Trash2, X, Upload } from 'lucide-react'

// Simple local Toast component
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300">
        <X size={14} />
      </button>
    </div>
  )
}

interface PlacementRecord {
  id: string
  name: string
  enrollment: string
  branch: string
  company: string
  pkg: number
  year: string
  status: 'Placed' | 'Offered'
}

const MOCK_RECORDS: PlacementRecord[] = [
  { id: 'PR001', name: 'Aarav Sharma', enrollment: '0901CS21101', branch: 'CSE', company: 'Microsoft IDC', pkg: 42.0, year: '2025-26', status: 'Placed' },
  { id: 'PR002', name: 'Priya Verma', enrollment: '0901CS21102', branch: 'CSE', company: 'Goldman Sachs', pkg: 28.0, year: '2025-26', status: 'Placed' },
  { id: 'PR003', name: 'Karan Rathore', enrollment: '0901IT21101', branch: 'IT', company: 'Amazon', pkg: 24.0, year: '2025-26', status: 'Placed' },
  { id: 'PR004', name: 'Rahul Gupta', enrollment: '0901CS21103', branch: 'CSE', company: 'Adobe', pkg: 18.0, year: '2025-26', status: 'Offered' },
  { id: 'PR005', name: 'Sneha Patel', enrollment: '0901CS21104', branch: 'CSE', company: 'Walmart Labs', pkg: 16.0, year: '2025-26', status: 'Placed' },
  { id: 'PR006', name: 'Amit Verma', enrollment: '0901EC21101', branch: 'ECE', company: 'Cognizant', pkg: 6.0, year: '2024-25', status: 'Placed' },
]

const PlacementRecords: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  useEffect(() => {
    getBranches().then(setBranches)
  }, [])

  const [records, setRecords] = useState<PlacementRecord[]>(MOCK_RECORDS)
  const [search, setSearch] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [toast, setToast] = useState('')
  
  // CSV Import State
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Manual Add Form State
  const [name, setName] = useState('')
  const [enrollment, setEnrollment] = useState('')
  const [branch, setBranch] = useState('')
  const [company, setCompany] = useState('')
  const [pkg, setPkg] = useState(4.5)
  const [year, setYear] = useState('2025-26')
  const [status, setStatus] = useState<'Placed' | 'Offered'>('Placed')

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !enrollment || !branch || !company) {
      setToast('Please fill all manual entry fields.')
      return
    }

    const newRecord: PlacementRecord = {
      id: `PR${records.length + 1}`,
      name,
      enrollment,
      branch,
      company,
      pkg: Number(pkg),
      year,
      status,
    }

    setRecords(prev => [newRecord, ...prev])
    setToast('Record added successfully.')
    
    // Clear fields
    setName('')
    setEnrollment('')
    setBranch('')
    setCompany('')
    setPkg(4.5)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setToast('Please select a CSV file first.')
      return
    }

    setImporting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockImported: PlacementRecord[] = [
      { id: `PR${Date.now()}1`, name: 'Vikram Singh', enrollment: '0901CS21109', branch: 'CSE', company: 'TCS Digital', pkg: 9.0, year: '2025-26', status: 'Placed' },
      { id: `PR${Date.now()}2`, name: 'Divya Dubey', enrollment: '0901CS21110', branch: 'CSE', company: 'Capgemini', pkg: 6.5, year: '2025-26', status: 'Offered' },
    ]

    setRecords(prev => [...mockImported, ...prev])
    setImporting(false)
    setFile(null)
    setToast('Successfully imported 2 student placement records from CSV.')
    
    const fileInput = document.getElementById('record-csv-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this placement record?')) {
      setRecords(prev => prev.filter(r => r.id !== id))
      setToast('Record deleted.')
    }
  }

  const handleExport = () => {
    setToast('Exported placement records database as CSV successfully.')
  }

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.enrollment.toLowerCase().includes(search.toLowerCase()) ||
                          r.company.toLowerCase().includes(search.toLowerCase())
    const matchesBranch = selectedBranch ? r.branch === selectedBranch : true
    const matchesYear = selectedYear ? r.year === selectedYear : true
    return matchesSearch && matchesBranch && matchesYear
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placement Records"
        subtitle="Manage academic year-wise placed student list, upload selections via CSV, and export databases"
        action={
          <button
            onClick={handleExport}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={15} />
            <span>Export DB</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column: inputs */}
        <div className="lg:col-span-1 space-y-6">
          {/* CSV import card */}
          <PortalCard>
            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-primary" />
              <span>CSV Bulk Upload</span>
            </h3>
            <form onSubmit={handleImportCSV} className="space-y-4">
              <div>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                  <input
                    type="file"
                    id="record-csv-input"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="text-slate-400 mb-2" size={24} />
                  <p className="text-xs text-slate-600 font-semibold text-center">
                    {file ? file.name : 'Select recruitment selections CSV'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Fields: Student, Enrollment, Branch, CTC</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={importing || !file}
                className="w-full bg-[#0b2545] hover:bg-[#0b2545]/90 text-white py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {importing ? '⏳ Importing...' : 'Import Records'}
              </button>
            </form>
          </PortalCard>

          {/* Manual Add Card */}
          <PortalCard>
            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus size={16} className="text-primary" />
              <span>Manual Entry</span>
            </h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Enrollment Number</label>
                <input
                  type="text"
                  required
                  value={enrollment}
                  onChange={e => setEnrollment(e.target.value)}
                  placeholder="0901CS21109"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                  >
                    <option value="">Branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. TCS"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={pkg}
                    onChange={e => setPkg(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                  >
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'Placed' | 'Offered')}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Offered">Offered</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white py-2 rounded font-semibold text-xs transition-colors mt-2"
              >
                Add Placement Offer
              </button>
            </form>
          </PortalCard>
        </div>

        {/* Right column: database views */}
        <div className="lg:col-span-2 space-y-4">
          {/* filters */}
          <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg">
              <Search className="text-slate-400 shrink-0" size={14} />
              <input
                type="text"
                placeholder="Search name, roll..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent focus:outline-none"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="text-xs border border-slate-100 bg-slate-50 rounded-lg px-3 py-1.5"
            >
              <option value="">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="text-xs border border-slate-100 bg-slate-50 rounded-lg px-3 py-1.5"
            >
              <option value="">All Academic Years</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>

          {/* Table */}
          <PortalCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recruiter</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CTC</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No placement offers found in the database.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{rec.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.enrollment}</p>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-700 font-medium">
                          {rec.branch}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs font-semibold">
                          {rec.company}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-[#bfa15f] font-bold whitespace-nowrap">
                          {rec.pkg} LPA
                        </td>
                        <td className="px-4 py-3 text-center text-slate-500 text-xs whitespace-nowrap">
                          {rec.year}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            label={rec.status}
                            variant={rec.status === 'Placed' ? 'success' : 'info'}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </PortalCard>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementRecords
