// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Clock, List, CheckSquare, Square, ExternalLink, CheckCircle2, XCircle, BookOpen, Check, X } from "lucide-react";

// interface CourseDetailProps {
//   course: any;
//   levelColor: string;
//   levelTitle: string;
//   onBack: () => void;
// }

// export function CourseDetail({ course, levelColor, levelTitle, onBack }: CourseDetailProps) {
//   // 3 & 4: State to track which individual lessons are checked
//   const [checkedLessons, setCheckedLessons] = useState<Record<string, boolean>>({});
  
//   // 4: Derived state to determine if the whole course is marked finished
//   const allLessonsExist = course.lessons && course.lessons.length > 0;
//   const isCourseFinished = allLessonsExist && 
//     course.lessons.every((lesson: any) => checkedLessons[lesson.id]);

//   // Initialize checkboxes based on mock data's initial 'completed' state
//   useEffect(() => {
//     if (course.lessons) {
//       const initialCheckedState: Record<string, boolean> = {};
//       course.lessons.forEach((lesson: any) => {
//         initialCheckedState[lesson.id] = lesson.completed;
//       });
//       setCheckedLessons(initialCheckedState);
//     }
//   }, [course]);

//   // Toggle a single lesson checkbox
//   const toggleLesson = (lessonId: string) => {
//     setCheckedLessons(prev => ({
//       ...prev,
//       [lessonId]: !prev[lessonId]
//     }));
//   };

//   // 4: Toggle entire course (checks all or unchecks all)
//   const toggleCourseStatus = () => {
//     if (!course.lessons) return;
    
//     const newCheckedState: Record<string, boolean> = {};
//     const targetState = !isCourseFinished; // If currently finished, we want to unfinish (false), else finish (true)
    
//     course.lessons.forEach((lesson: any) => {
//       newCheckedState[lesson.id] = targetState;
//     });
//     setCheckedLessons(newCheckedState);
//   };

//   // Calculate dynamic progress based on checked boxes
//   const currentCompletedCount = Object.values(checkedLessons).filter(Boolean).length;
//   const totalLessonsCount = course.lessons ? course.lessons.length : 0;
//   const dynamicProgress = totalLessonsCount === 0 ? 0 : Math.round((currentCompletedCount / totalLessonsCount) * 100);

//   return (
//     // 2. Removed pb-20 to clean up bottom spacing, removed container max-w to let banner bleed
//     <div className="w-full font-['Inter'] animate-in fade-in duration-300">
      
//       {/* 2. Top Banner with Image Overlay - Using a trick to make it full screen width while keeping content centered */}
//       <div className="relative w-full h-[320px] bg-[#4A5DF9]">
//         <img 
//           src={course.image} 
//           alt={course.title} 
//           className="w-full h-full object-cover mix-blend-multiply opacity-40"
//         />
//         {/* Container inside banner for the Back button */}
//         <div className="absolute inset-0 pt-8"> {/* Reduced top padding so it sits near navbar */}
//           <div className="container mx-auto px-6 max-w-[1200px]">
//             <button 
//               onClick={onBack}
//               className="flex items-center gap-2 text-[15px] font-medium text-white hover:text-gray-200 transition-colors"
//             >
//               <ArrowLeft size={18} /> Back To Learning Path
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area (Overlapping the banner) */}
//       <div className="container mx-auto px-6 max-w-[1200px] -mt-44 relative z-10 flex flex-col lg:flex-row gap-8 pb-20">
        
//         {/* Left Column (Course Info & Lessons) */}
//         <div className="flex-1 flex flex-col gap-8">
          
//           {/* Main Course Info Card */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <div className="flex items-center gap-3 mb-4">
//               <span className={`text-[12px] font-bold px-3 py-1.5 rounded-md text-white ${levelColor}`}>
//                 {levelTitle}
//               </span>
//               {isCourseFinished ? (
//                 <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#E5F7ED] text-[#1FAA52]">
//                   <CheckCircle2 size={14} /> Complete
//                 </span>
//               ) : (
//                 <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#FFF4E5] text-[#F97316]">
//                   <XCircle size={14} /> Incomplete
//                 </span>
//               )}
//             </div>

//             <h1 className="text-[32px] font-bold text-gray-900 mb-4 leading-tight">
//               {course.title}
//             </h1>
            
//             <p className="text-[16px] text-gray-600 mb-8 leading-relaxed pr-4">
//               {course.description}
//             </p>

//             <div className="flex items-center gap-8 text-[15px] font-medium text-gray-600 mb-8">
//               <span className="flex items-center gap-2"><Clock size={18} /> {course.hours} hours</span>
//               <span className="flex items-center gap-2"><List size={18} /> {totalLessonsCount} Lessons</span>
//             </div>

//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-[14px] font-bold text-gray-900">Your Progress</span>
//                 <span className="text-[14px] font-bold text-[#4A5DF9]">{dynamicProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
//                 <div className="bg-[#4A5DF9] h-full rounded-full transition-all duration-500" style={{ width: `${dynamicProgress}%` }} />
//               </div>
//               <span className="text-[13px] text-gray-500 font-medium">
//                 {currentCompletedCount} of {totalLessonsCount} Lessons Complete
//               </span>
//             </div>

//             {/* 4. Toggle Finished Status Button - Dynamic Color and Text */}
//             {isCourseFinished ? (
//               <button 
//                 onClick={toggleCourseStatus}
//                 className="w-full py-4 rounded-xl flex justify-center items-center gap-2 text-[16px] font-semibold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors"
//               >
//                 <X size={20} /> Mark as Unfinished
//               </button>
//             ) : (
//               <button 
//                 onClick={toggleCourseStatus}
//                 disabled={!allLessonsExist} // Prevent finishing if no lessons
//                 className={`w-full py-4 rounded-xl flex justify-center items-center gap-2 text-[16px] font-semibold text-white transition-colors ${
//                   allLessonsExist ? 'bg-[#1FAA52] hover:bg-[#188e43]' : 'bg-gray-300 cursor-not-allowed'
//                 }`}
//               >
//                 <Check size={20} /> Mark as Finished
//               </button>
//             )}
//           </div>

//           {/* Course Lessons List Card */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <h3 className="flex items-center gap-3 text-[20px] font-bold text-gray-900 mb-6">
//               <List size={22} className="text-[#4A5DF9]" /> Course Lessons
//             </h3>

//             {allLessonsExist ? (
//               <div className="flex flex-col gap-4">
//                 {course.lessons.map((lesson: any) => (
//                   <div 
//                     key={lesson.id} 
//                     // 3. Make the row clickable to toggle the checkbox
//                     onClick={() => toggleLesson(lesson.id)}
//                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-[#4A5DF9] hover:bg-[#F0F4FF] transition-all gap-4 cursor-pointer group"
//                   >
//                     <div className="flex items-start gap-4">
//                       <div className="mt-1 shrink-0">
//                         {checkedLessons[lesson.id] ? (
//                           // 1. Used the requested green color
//                           <CheckSquare size={22} color="#1FAA52" />
//                         ) : (
//                           <Square size={22} className="text-gray-300 group-hover:text-[#4A5DF9]" />
//                         )}
//                       </div>
//                       <div>
//                         <h4 className={`text-[16px] font-semibold mb-1 transition-colors ${checkedLessons[lesson.id] ? "text-[#1FAA52]" : "text-gray-900 group-hover:text-[#4A5DF9]"}`}>
//                           {lesson.title}
//                         </h4>
//                         <div className="flex items-center gap-2 text-[13px] text-gray-500">
//                           <Clock size={14} /> {lesson.duration}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <button className="flex items-center gap-2 text-[14px] font-medium text-gray-400 hover:text-[#4A5DF9] transition-colors sm:ml-4">
//                       <ExternalLink size={18} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Empty State
//               <div className="py-16 flex flex-col items-center justify-center text-center">
//                 <BookOpen size={48} className="text-gray-300 mb-4" />
//                 <h4 className="text-[18px] font-medium text-gray-900 mb-2">No lessons available yet</h4>
//                 <p className="text-[14px] text-gray-500">Visit the external course for content</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column (Skills & Outcomes Sidebar) */}
//         <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-8">
          
//           {/* Skills You'll Learn */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-[18px] font-bold text-gray-900 mb-6">Skills You'll Learn</h3>
//             <div className="flex flex-wrap gap-2.5">
//               {course.skills.map((skill: string, index: number) => (
//                 <span key={index} className="bg-[#F0F4FF] text-[#4A5DF9] text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#D5E3FF]">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Learning Outcomes */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-[18px] font-bold text-gray-900 mb-4">Learning Outcomes</h3>
//             <p className="text-[14px] text-gray-600 mb-6">
//               After completing this course, you will be able to:
//             </p>
//             <ul className="flex flex-col gap-4 text-[14px] text-gray-700 leading-relaxed font-medium">
//               {course.outcomes.map((outcome: string, index: number) => (
//                 <li key={index} className="flex items-start gap-3">
//                   <CheckCircle2 size={18} color="#1FAA52" className="shrink-0 mt-0.5" />
//                   <span>{outcome}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, List, CheckSquare, Square, ExternalLink, CheckCircle2, XCircle, BookOpen, Check, X } from "lucide-react";

interface CourseDetailProps {
  course: any;
  levelColor: string;
  levelTitle: string;
  onBack: () => void;
}

export function CourseDetail({ course, levelColor, levelTitle, onBack }: CourseDetailProps) {
  // Force override any old green colors from the mock data to the requested #1FAA52
  const safeLevelColor = levelColor.includes('#22C55E') ? 'bg-[#1FAA52]' : levelColor;

  // State to track which individual lessons are checked
  const [checkedLessons, setCheckedLessons] = useState<Record<string, boolean>>({});
  
  // Derived state to determine if the whole course is marked finished
  const allLessonsExist = course.lessons && course.lessons.length > 0;
  const isCourseFinished = allLessonsExist && 
    course.lessons.every((lesson: any) => checkedLessons[lesson.id]);

  // Initialize checkboxes based on mock data's initial 'completed' state
  useEffect(() => {
    if (course.lessons) {
      const initialCheckedState: Record<string, boolean> = {};
      course.lessons.forEach((lesson: any) => {
        initialCheckedState[lesson.id] = lesson.completed;
      });
      setCheckedLessons(initialCheckedState);
    }
  }, [course]);

  // Toggle a single lesson checkbox
  const toggleLesson = (lessonId: string) => {
    setCheckedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Toggle entire course (checks all or unchecks all)
  const toggleCourseStatus = () => {
    if (!course.lessons) return;
    
    const newCheckedState: Record<string, boolean> = {};
    const targetState = !isCourseFinished; 
    
    course.lessons.forEach((lesson: any) => {
      newCheckedState[lesson.id] = targetState;
    });
    setCheckedLessons(newCheckedState);
  };

  // Calculate dynamic progress based on checked boxes
  const currentCompletedCount = Object.values(checkedLessons).filter(Boolean).length;
  const totalLessonsCount = course.lessons ? course.lessons.length : 0;
  const dynamicProgress = totalLessonsCount === 0 ? 0 : Math.round((currentCompletedCount / totalLessonsCount) * 100);

  return (
    <div className="w-full font-['Inter'] animate-in fade-in duration-300">
      
      {/* Top Banner - Full bleed trick breaking out of the container bounds */}
      <div className="relative w-[100vw] left-1/2 right-1/2 -mx-[50vw] h-[320px] bg-[#4A5DF9] -mt-4">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover mix-blend-multiply opacity-40"
        />
        {/* Removed the absolute positioned Back Button from here! */}
      </div>

      {/* Main Content Area */}
      {/* Increased negative margin (-mt-48) to pull the whole block up over the banner */}
      <div className="w-full max-w-[1200px] mx-auto relative z-10 px-6 -mt-48 pb-20">
        
        {/* Back Button - Now positioned directly above the cards so it stays close! */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[15px] font-medium text-white hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Back To Learning Path
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Course Info & Lessons) */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Main Course Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[12px] font-bold px-3 py-1.5 rounded-md text-white ${safeLevelColor}`}>
                  {levelTitle}
                </span>
                {isCourseFinished ? (
                  <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#E5F7ED] text-[#1FAA52]">
                    <CheckCircle2 size={14} /> Complete
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md bg-[#FFF4E5] text-[#F97316]">
                    <XCircle size={14} /> Incomplete
                  </span>
                )}
              </div>

              <h1 className="text-[32px] font-bold text-gray-900 mb-4 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-[16px] text-gray-600 mb-8 leading-relaxed pr-4">
                {course.description}
              </p>

              <div className="flex items-center gap-8 text-[15px] font-medium text-gray-600 mb-8">
                <span className="flex items-center gap-2"><Clock size={18} /> {course.hours} hours</span>
                <span className="flex items-center gap-2"><List size={18} /> {totalLessonsCount} Lessons</span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] font-bold text-gray-900">Your Progress</span>
                  <span className="text-[14px] font-bold text-[#4A5DF9]">{dynamicProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <div className="bg-[#4A5DF9] h-full rounded-full transition-all duration-500" style={{ width: `${dynamicProgress}%` }} />
                </div>
                <span className="text-[13px] text-gray-500 font-medium">
                  {currentCompletedCount} of {totalLessonsCount} Lessons Complete
                </span>
              </div>

              {/* Toggle Finished Status Button */}
              {isCourseFinished ? (
                <button 
                  onClick={toggleCourseStatus}
                  className="w-full py-4 rounded-xl flex justify-center items-center gap-2 text-[16px] font-semibold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors"
                >
                  <X size={20} /> Mark as Unfinished
                </button>
              ) : (
                <button 
                  onClick={toggleCourseStatus}
                  disabled={!allLessonsExist}
                  className={`w-full py-4 rounded-xl flex justify-center items-center gap-2 text-[16px] font-semibold text-white transition-colors ${
                    allLessonsExist ? 'bg-[#1FAA52] hover:bg-[#188e43]' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Check size={20} /> Mark as Finished
                </button>
              )}
            </div>

            {/* Course Lessons List Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="flex items-center gap-3 text-[20px] font-bold text-gray-900 mb-6">
                <List size={22} className="text-[#4A5DF9]" /> Course Lessons
              </h3>

              {allLessonsExist ? (
                <div className="flex flex-col gap-4">
                  {course.lessons.map((lesson: any) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => toggleLesson(lesson.id)}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border rounded-xl transition-all gap-4 cursor-pointer group ${
                        checkedLessons[lesson.id] 
                          ? "border-[#1FAA52]/30 bg-[#E5F7ED]/30" 
                          : "border-gray-100 hover:border-[#4A5DF9] hover:bg-[#F0F4FF]"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                          {checkedLessons[lesson.id] ? (
                            <CheckSquare size={22} color="#1FAA52" />
                          ) : (
                            <Square size={22} className="text-gray-300 group-hover:text-[#4A5DF9]" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-[16px] font-semibold mb-1 transition-colors ${checkedLessons[lesson.id] ? "text-[#1FAA52]" : "text-gray-900 group-hover:text-[#4A5DF9]"}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[13px] text-gray-500">
                            <Clock size={14} /> {lesson.duration}
                          </div>
                        </div>
                      </div>
                      
                      <button className="flex items-center gap-2 text-[14px] font-medium text-gray-400 hover:text-[#4A5DF9] transition-colors sm:ml-4">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h4 className="text-[18px] font-medium text-gray-900 mb-2">No lessons available yet</h4>
                  <p className="text-[14px] text-gray-500">Visit the external course for content</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Skills & Outcomes Sidebar) */}
          <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-8">
            
            {/* Skills You'll Learn */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-[18px] font-bold text-gray-900 mb-6">Skills You'll Learn</h3>
              <div className="flex flex-wrap gap-2.5">
                {course.skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-[#F0F4FF] text-[#4A5DF9] text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#D5E3FF]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Learning Outcomes</h3>
              <p className="text-[14px] text-gray-600 mb-6">
                After completing this course, you will be able to:
              </p>
              <ul className="flex flex-col gap-4 text-[14px] text-gray-700 leading-relaxed font-medium">
                {course.outcomes.map((outcome: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={18} color="#1FAA52" className="shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}