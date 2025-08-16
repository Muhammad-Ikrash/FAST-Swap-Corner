import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, BookOpen, X } from 'lucide-react';
import { courses, sections } from '../data/courses';
import { Course } from '../types/swap';

interface CourseSelectorProps {
  rollNumber: string;
  onSwapRequest: (current: string, target: string, semester: number, department: string) => void;
  onBack: () => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({ 
  rollNumber, 
  onSwapRequest, 
  onBack 
}) => {
  const [currentCourse, setCurrentCourse] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [targetCourse, setTargetCourse] = useState('');
  const [targetSection, setTargetSection] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [error, setError] = useState('');
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [targetInputValue, setTargetInputValue] = useState('');
  const [filteredCoursesForCurrent, setFilteredCoursesForCurrent] = useState<Course[]>([]);
  const [filteredCoursesForTarget, setFilteredCoursesForTarget] = useState<Course[]>([]);

  // Helper functions for dropdown management
  const handleCurrentInputChange = (value: string) => {
    setCurrentInputValue(value);
    setCurrentCourse('');
    setShowCurrentDropdown(value.trim().length > 0);
    // Clear filtered courses immediately to prevent stale results
    setFilteredCoursesForCurrent([]);
  };

  const handleTargetInputChange = (value: string) => {
    setTargetInputValue(value);
    setTargetCourse('');
    setShowTargetDropdown(value.trim().length > 0);
    // Clear filtered courses immediately to prevent stale results
    setFilteredCoursesForTarget([]);
  };

  const handleCurrentInputFocus = () => {
    setShowCurrentDropdown(true);
    // If input is empty, trigger update of filtered courses
    if (!currentInputValue.trim()) {
      setFilteredCoursesForCurrent(courses.slice().reverse().slice(0, 10));
    }
  };

  const handleTargetInputFocus = () => {
    setShowTargetDropdown(true);
    // If input is empty, trigger update of filtered courses
    if (!targetInputValue.trim()) {
      const currentCourseObj = courses.find(c => c.code === currentCourse);
      const sameDepartment = currentCourseObj ? courses.filter(c => c.department === currentCourseObj.department) : courses;
      setFilteredCoursesForTarget(sameDepartment.slice().reverse().slice(0, 10));
    }
  };

  // Clear input to allow new search
  const clearCurrentSelection = () => {
    setCurrentInputValue('');
    setCurrentCourse('');
    setShowCurrentDropdown(false);
    setFilteredCoursesForCurrent([]);
  };

  const clearTargetSelection = () => {
    setTargetInputValue('');
    setTargetCourse('');
    setShowTargetDropdown(false);
    setFilteredCoursesForTarget([]);
  };

  // useEffect to update filtered courses for current course
  useEffect(() => {
    if (!currentInputValue.trim()) {
      // Show first 10 courses when input is empty (reversed)
      setFilteredCoursesForCurrent(courses.slice().reverse().slice(0, 10));
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(currentInputValue.toLowerCase()) ||
        course.code.toLowerCase().includes(currentInputValue.toLowerCase())
      )
        .slice(0, 10)
        .reverse();
      setFilteredCoursesForCurrent(filtered);
    }
  }, [currentInputValue]);

  // useEffect to update filtered courses for target course
  useEffect(() => {
    const currentCourseObj = courses.find(c => c.code === currentCourse);
    const sameDepartment = currentCourseObj ? courses.filter(c => c.department === currentCourseObj.department) : courses;
    
    if (!targetInputValue.trim()) {
      // Show first 10 courses from same department when input is empty (reversed)
      setFilteredCoursesForTarget(sameDepartment.slice().reverse().slice(0, 10));
    } else {
      const filtered = sameDepartment.filter(course =>
        course.name.toLowerCase().includes(targetInputValue.toLowerCase()) ||
        course.code.toLowerCase().includes(targetInputValue.toLowerCase())
      )
        .slice(0, 10)
        .reverse();
      setFilteredCoursesForTarget(filtered);
    }
  }, [targetInputValue, currentCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCourse || !currentSection || !targetCourse || !targetSection) {
      setError('Please fill in all fields');
      return;
    }

    if (currentCourse === targetCourse && currentSection === targetSection) {
      setError('Current and target courses cannot be the same');
      return;
    }

    const currentCourseObj = courses.find(c => c.code === currentCourse);
    const targetCourseObj = courses.find(c => c.code === targetCourse);

    if (!currentCourseObj || !targetCourseObj) {
      setError('Invalid course selection');
      return;
    }

    if (currentCourseObj.department !== targetCourseObj.department) {
      setError('Cross-department swaps are not allowed');
      return;
    }

    setError('');
    
    const currentCourseWithSection = `${currentCourse} ${currentSection}`;
    const targetCourseWithSection = `${targetCourse} ${targetSection}`;
    
    onSwapRequest(currentCourseWithSection, targetCourseWithSection, semester, currentCourseObj.department);
  };

  const selectCourse = (course: Course, type: 'current' | 'target') => {
    if (type === 'current') {
      setCurrentCourse(course.code);
      setCurrentInputValue(`${course.code} - ${course.name}`);
      setShowCurrentDropdown(false);
    } else {
      setTargetCourse(course.code);
      setTargetInputValue(`${course.code} - ${course.name}`);
      setShowTargetDropdown(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Selection</h1>
          <p className="text-gray-600">Roll Number: <span className="font-medium text-blue-600">{rollNumber}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Semester Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* Current Course */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Course
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={currentInputValue}
                    onChange={(e) => handleCurrentInputChange(e.target.value)}
                    onFocus={handleCurrentInputFocus}
                    onBlur={() => setTimeout(() => setShowCurrentDropdown(false), 200)}
                    placeholder="Search for course..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {currentInputValue && (
                    <button
                      type="button"
                      onClick={clearCurrentSelection}
                      className="absolute right-3 top-3 w-5 h-5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
               {showCurrentDropdown && filteredCoursesForCurrent.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCoursesForCurrent.map((course) => (
                      <button
                        key={course.code}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                        onClick={() => selectCourse(course, 'current')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="font-medium text-gray-900">{course.code}</div>
                        <div className="text-sm text-gray-600">{course.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Section
              </label>
              <select
                value={currentSection}
                onChange={(e) => setCurrentSection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <ArrowRight className="w-6 h-6 text-blue-600 rotate-90 md:rotate-0" />
            </div>
          </div>

          {/* Target Course */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Course
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={targetInputValue}
                    onChange={(e) => handleTargetInputChange(e.target.value)}
                    onFocus={handleTargetInputFocus}
                    onBlur={() => setTimeout(() => setShowTargetDropdown(false), 200)}
                    placeholder="Search for course..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {targetInputValue && (
                    <button
                      type="button"
                      onClick={clearTargetSelection}
                      className="absolute right-3 top-3 w-5 h-5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
               {showTargetDropdown && filteredCoursesForTarget.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCoursesForTarget.map((course) => (
                      <button
                        key={course.code}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                        onClick={() => selectCourse(course, 'target')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="font-medium text-gray-900">{course.code}</div>
                        <div className="text-sm text-gray-600">{course.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Section
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
            >
              Find Swap Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};