/**
 * AdminPreviewPanel — reusable live-preview side panel for admin CRUD pages.
 *
 * Shows how a record looks on the public website, matching the frontend's
 * visual design (navy + gold palette). Used by AdminNotices, AdminNews,
 * AdminEvents, AdminGallery, AdminFaculty, AdminDepartments, AdminDownloads,
 * AdminTenders, AdminAlerts.
 */
import React from 'react'
import { X, Eye, FileText, Link2, Calendar, Tag, Building, Users, Download, AlertTriangle, Newspaper, Camera } from 'lucide-react'

const C = { navy: '#0b2545', gold: '#bfa15f', white: '#ffffff', navy10: 'rgba(11,37,69,0.10)', navy70: 'rgba(11,37,69,0.70)' }

// ─── Shared atoms ─────────────────────────────────────────────────────────────
const Badge: React.FC<{ label: string; color?: string }> = ({ label, color = C.navy }) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border"
    style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}>
    {label}
  </span>
)

// ─── Notice preview ───────────────────────────────────────────────────────────
export interface NoticePreviewData {
  title?: string
  category?: string
  date?: string
  highlight?: boolean
  file_url?: string
  original_name?: string
  attachment_type?: string | null
}

const NoticeCard: React.FC<{ data: NoticePreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
      <FileText size={14} style={{ color: C.navy }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>Notice Preview</span>
      {data.highlight && <Badge label="Published" color="#16a34a" />}
    </div>
    <div className="p-4 space-y-3">
      <p className="font-semibold text-sm leading-snug" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">No title entered</span>}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {data.category && <Badge label={data.category} color={C.navy} />}
        {data.date && (
          <span className="text-xs flex items-center gap-1" style={{ color: C.navy70 }}>
            <Calendar size={10} />{data.date}
          </span>
        )}
      </div>
      {data.file_url && (
        <div className="flex items-center gap-2 p-2 rounded border text-xs" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
          {data.attachment_type === 'EXTERNAL_LINK' ? <Link2 size={12} style={{ color: C.gold }} /> : <FileText size={12} style={{ color: C.gold }} />}
          <span style={{ color: C.navy }}>{data.original_name || (data.attachment_type === 'EXTERNAL_LINK' ? 'External Link' : 'Attached File')}</span>
        </div>
      )}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/notices</strong> page and Homepage Announcements (if Published)
    </div>
  </div>
)

// ─── News preview ─────────────────────────────────────────────────────────────
export interface NewsPreviewData {
  title?: string
  summary?: string
  category?: string
  date?: string
  coverImageUrl?: string
  status?: string
}

const NewsCard: React.FC<{ data: NewsPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    {data.coverImageUrl ? (
      <div className="h-36 bg-slate-100 overflow-hidden">
        <img src={data.coverImageUrl} alt="cover" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="h-36 flex items-center justify-center" style={{ backgroundColor: `${C.navy}08` }}>
        <Newspaper size={24} style={{ color: C.navy }} className="opacity-30" />
      </div>
    )}
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        {data.category && <Badge label={data.category} color={C.gold} />}
        {data.status && <Badge label={data.status} color={data.status === 'PUBLISHED' ? '#16a34a' : '#94a3b8'} />}
      </div>
      <p className="font-display font-bold text-sm leading-snug" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">No title entered</span>}
      </p>
      {data.summary && <p className="text-xs leading-relaxed line-clamp-3" style={{ color: C.navy70 }}>{data.summary}</p>}
      {data.date && <p className="text-[10px] flex items-center gap-1" style={{ color: C.navy70 }}><Calendar size={10} />{data.date}</p>}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/news</strong> page and Homepage News section
    </div>
  </div>
)

// ─── Event preview ────────────────────────────────────────────────────────────
export interface EventPreviewData {
  title?: string
  description?: string
  category?: string
  startDate?: string
  endDate?: string
  venue?: string
  status?: string
  coverImageUrl?: string
}

const EventCard: React.FC<{ data: EventPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    {data.coverImageUrl ? (
      <div className="h-32 overflow-hidden">
        <img src={data.coverImageUrl} alt="cover" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="h-32 flex items-center justify-center" style={{ backgroundColor: `${C.navy}08` }}>
        <Calendar size={24} style={{ color: C.navy }} className="opacity-30" />
      </div>
    )}
    <div className="p-4 space-y-2">
      {data.category && <Badge label={data.category} color={C.gold} />}
      <p className="font-display font-bold text-sm leading-snug" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">No title entered</span>}
      </p>
      {data.description && <p className="text-xs line-clamp-2" style={{ color: C.navy70 }}>{data.description}</p>}
      <div className="text-[10px] space-y-1" style={{ color: C.navy70 }}>
        {data.startDate && <p><Calendar size={10} className="inline mr-1" />{data.startDate}{data.endDate && ` — ${data.endDate}`}</p>}
        {data.venue && <p><Building size={10} className="inline mr-1" />{data.venue}</p>}
      </div>
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/events</strong> page
    </div>
  </div>
)

// ─── Gallery preview ──────────────────────────────────────────────────────────
export interface GalleryPreviewData {
  title?: string
  description?: string
  coverUrl?: string
  imageCount?: number
}

const GalleryCard: React.FC<{ data: GalleryPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    {data.coverUrl ? (
      <div className="h-40 overflow-hidden">
        <img src={data.coverUrl} alt="cover" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="h-40 flex items-center justify-center" style={{ backgroundColor: `${C.navy}08` }}>
        <Camera size={24} style={{ color: C.navy }} className="opacity-30" />
      </div>
    )}
    <div className="p-4 space-y-1">
      <p className="font-display font-bold text-sm" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">Untitled Album</span>}
      </p>
      {data.description && <p className="text-xs line-clamp-2" style={{ color: C.navy70 }}>{data.description}</p>}
      {data.imageCount !== undefined && <p className="text-[10px]" style={{ color: C.navy70 }}>{data.imageCount} photos</p>}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/explore/gallery</strong> page and Homepage Gallery section
    </div>
  </div>
)

// ─── Faculty preview ──────────────────────────────────────────────────────────
export interface FacultyPreviewData {
  name?: string
  designation?: string
  department?: string
  email?: string
  photoUrl?: string
  qualification?: string
}

const FacultyCard: React.FC<{ data: FacultyPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
      <Users size={14} style={{ color: C.navy }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>Faculty Card Preview</span>
    </div>
    <div className="p-4 flex gap-4">
      {data.photoUrl ? (
        <div className="w-16 h-20 rounded overflow-hidden border shrink-0" style={{ borderColor: C.navy10 }}>
          <img src={data.photoUrl} alt="faculty" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-20 rounded flex items-center justify-center shrink-0 border" style={{ borderColor: C.navy10, backgroundColor: `${C.navy}08` }}>
          <Users size={20} style={{ color: C.navy }} className="opacity-30" />
        </div>
      )}
      <div className="min-w-0 space-y-1">
        <p className="font-bold text-sm" style={{ color: C.navy }}>
          {data.name || <span className="text-slate-400 italic">No name</span>}
        </p>
        {data.designation && <p className="text-xs font-semibold" style={{ color: C.gold }}>{data.designation}</p>}
        {data.department && <p className="text-xs" style={{ color: C.navy70 }}>{data.department}</p>}
        {data.qualification && <p className="text-[10px]" style={{ color: C.navy70 }}>{data.qualification}</p>}
        {data.email && <p className="text-[10px] truncate" style={{ color: C.navy70 }}>{data.email}</p>}
      </div>
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: Department pages and <strong>/faculty</strong> profiles
    </div>
  </div>
)

// ─── Department preview ───────────────────────────────────────────────────────
export interface DepartmentPreviewData {
  name?: string
  shortName?: string
  description?: string
  hod?: string
  coverImageUrl?: string
}

const DepartmentCard: React.FC<{ data: DepartmentPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    {data.coverImageUrl ? (
      <div className="h-28 overflow-hidden">
        <img src={data.coverImageUrl} alt="dept" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="h-28 flex items-center justify-center" style={{ backgroundColor: `${C.navy}08` }}>
        <Building size={24} style={{ color: C.navy }} className="opacity-30" />
      </div>
    )}
    <div className="p-4 space-y-2">
      <div>
        <p className="font-display font-bold text-sm" style={{ color: C.navy }}>{data.name || <span className="text-slate-400 italic">No name</span>}</p>
        {data.shortName && <p className="text-xs font-semibold" style={{ color: C.gold }}>{data.shortName}</p>}
      </div>
      {data.description && <p className="text-xs line-clamp-3" style={{ color: C.navy70 }}>{data.description}</p>}
      {data.hod && <p className="text-[10px]" style={{ color: C.navy70 }}>HOD: {data.hod}</p>}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/departments/{'{slug}'}</strong> and Homepage Departments section
    </div>
  </div>
)

// ─── Download preview ─────────────────────────────────────────────────────────
export interface DownloadPreviewData {
  title?: string
  category?: string
  date?: string
  fileUrl?: string
  fileName?: string
}

const DownloadCard: React.FC<{ data: DownloadPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
      <Download size={14} style={{ color: C.navy }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>Download Preview</span>
    </div>
    <div className="p-4 space-y-2">
      <p className="font-semibold text-sm" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">No title</span>}
      </p>
      <div className="flex gap-2 flex-wrap">
        {data.category && <Badge label={data.category} color={C.navy} />}
        {data.date && <span className="text-[10px]" style={{ color: C.navy70 }}>{data.date}</span>}
      </div>
      {data.fileUrl && (
        <div className="flex items-center gap-2 p-2 rounded border text-xs" style={{ borderColor: C.navy10 }}>
          <FileText size={12} style={{ color: C.gold }} />
          <span className="truncate" style={{ color: C.navy }}>{data.fileName || 'Download File'}</span>
        </div>
      )}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/downloads</strong> page
    </div>
  </div>
)

// ─── Tender preview ───────────────────────────────────────────────────────────
export interface TenderPreviewData {
  title?: string
  referenceNo?: string
  closingDate?: string
  status?: string
  fileUrl?: string
}

const TenderCard: React.FC<{ data: TenderPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
      <Tag size={14} style={{ color: C.navy }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>Tender Preview</span>
    </div>
    <div className="p-4 space-y-2">
      <p className="font-semibold text-sm" style={{ color: C.navy }}>
        {data.title || <span className="text-slate-400 italic">No title</span>}
      </p>
      <div className="text-[10px] space-y-1" style={{ color: C.navy70 }}>
        {data.referenceNo && <p>Ref: {data.referenceNo}</p>}
        {data.closingDate && <p><Calendar size={10} className="inline mr-1" />Closing: {data.closingDate}</p>}
      </div>
      {data.status && <Badge label={data.status} color={data.status === 'OPEN' ? '#16a34a' : '#94a3b8'} />}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears on: <strong>/tenders</strong> page
    </div>
  </div>
)

// ─── Alert preview ────────────────────────────────────────────────────────────
export interface AlertPreviewData {
  message?: string
  type?: string
  enabled?: boolean
}

const AlertCard: React.FC<{ data: AlertPreviewData }> = ({ data }) => (
  <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.navy10 }}>
    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.navy10, backgroundColor: '#f8fafc' }}>
      <AlertTriangle size={14} style={{ color: C.gold }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>Alert Preview</span>
    </div>
    <div className="p-4 space-y-2">
      <div className={`flex items-start gap-2 p-3 rounded border text-sm ${data.type === 'warning' ? 'bg-amber-50 border-amber-200' : data.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <AlertTriangle size={14} className={`shrink-0 mt-0.5 ${data.type === 'warning' ? 'text-amber-600' : data.type === 'error' ? 'text-red-600' : 'text-blue-600'}`} />
        <span>{data.message || <span className="text-slate-400 italic">No message</span>}</span>
      </div>
      {data.enabled !== undefined && <Badge label={data.enabled ? 'Active' : 'Inactive'} color={data.enabled ? '#16a34a' : '#94a3b8'} />}
    </div>
    <div className="px-4 py-2 text-[10px] border-t" style={{ borderColor: C.navy10, color: C.navy70, backgroundColor: '#f8fafc' }}>
      Appears as: Marquee/Banner at top of every public page
    </div>
  </div>
)

// ─── Main export ──────────────────────────────────────────────────────────────
export type PreviewType = 'notice' | 'news' | 'event' | 'gallery' | 'faculty' | 'department' | 'download' | 'tender' | 'alert'

export interface AdminPreviewPanelProps {
  type: PreviewType
  data: NoticePreviewData | NewsPreviewData | EventPreviewData | GalleryPreviewData | FacultyPreviewData | DepartmentPreviewData | DownloadPreviewData | TenderPreviewData | AlertPreviewData
  onClose: () => void
}

const AdminPreviewPanel: React.FC<AdminPreviewPanelProps> = ({ type, data, onClose }) => {
  return (
    <div className="w-72 shrink-0 border-l border-slate-200 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Preview</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[10px] text-slate-400 mb-3 uppercase tracking-widest font-semibold">Public website preview</p>
        {type === 'notice'     && <NoticeCard     data={data as NoticePreviewData} />}
        {type === 'news'       && <NewsCard       data={data as NewsPreviewData} />}
        {type === 'event'      && <EventCard      data={data as EventPreviewData} />}
        {type === 'gallery'    && <GalleryCard    data={data as GalleryPreviewData} />}
        {type === 'faculty'    && <FacultyCard    data={data as FacultyPreviewData} />}
        {type === 'department' && <DepartmentCard data={data as DepartmentPreviewData} />}
        {type === 'download'   && <DownloadCard   data={data as DownloadPreviewData} />}
        {type === 'tender'     && <TenderCard     data={data as TenderPreviewData} />}
        {type === 'alert'      && <AlertCard      data={data as AlertPreviewData} />}
      </div>

      {/* Status bar */}
      <div className="shrink-0 px-4 py-2 bg-slate-800 text-[9px] font-mono text-slate-400 flex items-center justify-between">
        <span>Updates as you type</span>
        <span className="text-green-400">● LIVE</span>
      </div>
    </div>
  )
}

export default AdminPreviewPanel
