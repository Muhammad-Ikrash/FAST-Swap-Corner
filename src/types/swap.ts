export interface SwapRequest {
  id?: string;
  roll_number: string;
  course_current: string;
  course_target: string;
  semester: number;
  department: string;
  created_at?: string;
}

export interface Course {
  code: string;
  name: string;
  department: string;
}

export interface SwapMatch {
  counterpart_roll: string;
  success: boolean;
}