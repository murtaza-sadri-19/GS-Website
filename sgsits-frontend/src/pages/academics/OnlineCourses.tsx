import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { ExternalLink } from 'lucide-react'
import { academicsService, onlineCoursesDefault } from '../../services/academicsService'
import type { OnlineCourseLink } from '../../services/academicsService'

const OnlineCourses: React.FC = () => {
  const [onlineData, setOnlineData] = useState<OnlineCourseLink[]>(onlineCoursesDefault)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academicsService.getOnlineCourses()
        setOnlineData(data)
      } catch (error) {
        console.error('Failed to load online courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/online-courses" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-primary">Online Courses</h2>
        <p className="text-sm text-gray-500 mt-1 font-sans">MOOC, NPTEL & SWAYAM courses at SGSITS</p>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          SGSITS is an active participant in the NPTEL (National Programme on Technology Enhanced Learning) initiative and serves as a <strong>Local Chapter</strong> for NPTEL online certification courses.
        </p>
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          Students and faculty are encouraged to enroll in MOOC courses through platforms like SWAYAM, NPTEL, Coursera, and edX. Several courses are integrated into the curriculum as electives.
        </p>
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          Popular courses include Machine Learning, Data Structures, IoT, Cloud Computing, Digital Marketing, and Financial Management. Credits earned through NPTEL can be transferred to the academic record.
        </p>
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Online Course Portals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {onlineData.map((course, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-bold text-base text-primary font-display">{course.title}</h4>
                  <span className="bg-accent/15 text-accent font-bold text-[11px] px-2.5 py-1 rounded-full shrink-0 tracking-wide font-sans">
                    {course.platform}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed font-sans">{course.description}</p>
              </div>
              <div className="mt-5">
                {course.url && course.url !== '#' ? (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 font-bold text-xs transition-colors font-sans"
                  >
                    Visit Portal <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs font-semibold font-sans">Internal Portal</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OnlineCourses
