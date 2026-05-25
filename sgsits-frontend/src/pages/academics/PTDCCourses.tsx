import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { academicsService, ptdcCoursesDefault } from '../../services/academicsService'
import type { PTDCCourse } from '../../services/academicsService'

const PTDCCourses: React.FC = () => {
  const [ptdcData, setPtdcData] = useState<PTDCCourse[]>(ptdcCoursesDefault)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academicsService.getPTDCCourses()
        setPtdcData(data)
      } catch (error) {
        console.error('Failed to load PTDC courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/courses/ptdc" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-primary">PTDC Courses</h2>
        <p className="text-sm text-gray-500 mt-1 font-sans">Part-Time Degree Courses for working professionals</p>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          SGSITS offers Part Time Degree Courses (PTDC) for working professionals who wish to obtain a B.E. degree while continuing their employment. These courses are available in select engineering departments.
        </p>
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          The PTDC program has a duration of 5 years and classes are conducted during evenings and weekends. Candidates must be working professionals with a minimum of 2 years of work experience.
        </p>
        <p className="text-gray-700 text-[15px] leading-relaxed font-sans">
          <strong>Eligibility:</strong> Diploma in Engineering + 2 years work experience. <strong>Admission:</strong> Through MP DTE counseling.
        </p>
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Available PTDC Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ptdcData.map((course, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-bold text-base text-primary font-display">{course.program}</h4>
                  <span className="bg-accent/15 text-accent font-bold text-[11px] px-2.5 py-1 rounded-full shrink-0 tracking-wide font-sans">
                    {course.duration}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] font-bold mt-1 uppercase tracking-wider font-sans">{course.dept}</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed font-sans">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PTDCCourses
