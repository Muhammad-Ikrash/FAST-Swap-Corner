export const validateRollNumber = (rollNumber: string): boolean => {
  const rollRegex = /^\d{2}L-\d{4}$/;
  return rollRegex.test(rollNumber);
};

export const rollNumberToEmail = (rollNumber: string): string => {
  if (!validateRollNumber(rollNumber)) {
    throw new Error('Invalid roll number format');
  }
  
  // Convert 23L-0632 to l230632@lhr.nu.edu.pk
  const [batch, roll] = rollNumber.split('L-');
  return `l${batch}${roll}@lhr.nu.edu.pk`;
};

export const extractDepartmentFromCourse = (courseCode: string): string => {
  // Extract department from course code (e.g., "CS101" -> "CS")
  return courseCode.replace(/\d+/g, '').toUpperCase();
};

export const formatCourseWithSection = (courseCode: string, section: string): string => {
  return `${courseCode} ${section}`;
};