import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, Badge, SessionBanner } from '../../components/layout/PortalLayout'
import { getBranches, getCourses, getStudents, getActiveSession, type Branch, type Course, type Student, type Session } from '../../services/examService'
import { Upload, FileSpreadsheet, AlertCircle, Trash2, CheckCircle } from 'lucide-react'

const ExamAtktUpload: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Local list of ATKT students
  const [atktStudents, setAtktStudents] = useState<Student[]>([])

  useEffect(() => {
    Promise.all([getBranches(), getCourses(), getStudents(), getActiveSession()]).then(([b, c, st, s]) => {
      setBranches(b); setCourses(c); setAtktStudents(st.filter(s => s.hasATKT)); setActiveSession(s); setLoading(false)
    })
  }, [])

  // Filter courses based on selected branch
  const filteredCourses = courses.filter(c => c.branch_id === selectedBranch)

  // Clean course when branch changes
  useEffect(() => {
    setSelectedCourse('')
  }, [selectedBranch])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setErrorMsg('')
      setUploadSuccess(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBranch || !selectedCourse || !file) {
      setErrorMsg('Please fill all fields and select a CSV file.')
      return
    }

    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Invalid file format. Please upload a valid .csv file.')
      return
    }

    setUploading(true)
    setErrorMsg('')
    setUploadSuccess(false)

    // Simulate network upload
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add a new mock ATKT student to the list to show interactivity
    const newStudent: Student = {
      enrollment: `0901${selectedBranch}21${100 + atktStudents.length + 1}`,
      name: `Mock Student ${atktStudents.length + 1}`,
      branch_id: selectedBranch,
      semester: 5,
      section: 'A',
      email: `mock.student${atktStudents.length + 1}@student.sgsits.ac.in`,
      hasATKT: true
    }

    setAtktStudents(prev => [newStudent, ...prev])
    setUploading(false)
    setUploadSuccess(true)
    setFile(null)
    
    // Clear input
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleDelete = (enrollment: string) => {
    setAtktStudents(prev => prev.filter(s => s.enrollment !== enrollment))
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="ATKT Student Upload"
        subtitle="Upload list of students eligible for ATKT/back-paper examinations via CSV"
      />

      {activeSession && <SessionBanner session={activeSession.label} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <PortalCard>
            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">Upload New ATKT Data</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={e => setSelectedBranch(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  disabled={!selectedBranch}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-50"
                >
                  <option value="">Select Course</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.specialization ? `(${c.specialization})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  ATKT Student List (CSV)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative">
                  <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="text-slate-400 mb-2" size={28} />
                  <p className="text-xs text-slate-600 font-semibold text-center">
                    {file ? file.name : 'Click to browse or drag CSV file'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Accepts .csv files only</p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded border border-red-200 flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded border border-emerald-200 flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  <span>ATKT list uploaded and students registered successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedBranch || !selectedCourse || !file}
                className="w-full bg-primary hover:bg-primary/95 text-white py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploading ? (
                  <>⏳ Uploading & Processing...</>
                ) : (
                  <>
                    <Upload size={15} />
                    <span>Upload CSV</span>
                  </>
                )}
              </button>
            </form>
          </PortalCard>
        </div>

        {/* Existing List */}
        <div className="lg:col-span-2">
          <PortalCard>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Active ATKT Student Registrations</h3>
              <Badge label={`${atktStudents.length} Students`} variant="info" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enrollment No</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {atktStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                        No ATKT students registered.
                      </td>
                    </tr>
                  ) : (
                    atktStudents.map(student => (
                      <tr key={student.enrollment} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{student.enrollment}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-slate-600">{student.branch_id}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">Sem {student.semester}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge label="ATKT REGISTERED" variant="warning" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(student.enrollment)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove student registration"
                          >
                            <Trash2 size={14} />
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
    </div>
  )
}

export default ExamAtktUpload
