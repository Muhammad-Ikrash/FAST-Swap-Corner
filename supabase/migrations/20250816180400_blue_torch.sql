/*
  # Course Section Swap Finder Database Schema

  1. New Tables
    - `swap_requests`
      - `id` (uuid, primary key)
      - `roll_number` (text, strict format XXL-YYYY)
      - `course_current` (text, e.g., "DIP A")
      - `course_target` (text, e.g., "MLops A")  
      - `semester` (integer, 1-9)
      - `department` (text, derived from course)
      - `created_at` (timestamp, default now())

  2. Security
    - Enable RLS on `swap_requests` table
    - Add policy for public read/insert access (no auth required)

  3. Indexes
    - Index on course fields for faster matching queries
    - Index on roll_number for validation
*/

CREATE TABLE IF NOT EXISTS swap_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number text NOT NULL CHECK (roll_number ~ '^\d{2}L-\d{4}$'),
  course_current text NOT NULL,
  course_target text NOT NULL,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 9),
  department text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;

-- Allow public access (no authentication required)
CREATE POLICY "Allow public read access on swap_requests"
  ON swap_requests
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access on swap_requests"
  ON swap_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public delete access on swap_requests"
  ON swap_requests
  FOR DELETE
  TO anon
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swap_requests_course_current ON swap_requests(course_current);
CREATE INDEX IF NOT EXISTS idx_swap_requests_course_target ON swap_requests(course_target);
CREATE INDEX IF NOT EXISTS idx_swap_requests_semester ON swap_requests(semester);
CREATE INDEX IF NOT EXISTS idx_swap_requests_department ON swap_requests(department);