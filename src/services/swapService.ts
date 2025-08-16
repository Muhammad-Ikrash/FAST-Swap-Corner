import { supabase } from '../lib/supabase';
import { SwapRequest, SwapMatch } from '../types/swap';

export class SwapService {
  static async checkForMatch(request: SwapRequest): Promise<SwapMatch | null> {
    try {
      // Look for reverse match: someone wanting target->current in same semester/department
      const { data: matches, error } = await supabase
        .from('swap_requests')
        .select('*')
        .eq('course_current', request.course_target)
        .eq('course_target', request.course_current)
        .eq('semester', request.semester)
        .eq('department', request.department)
        .neq('roll_number', request.roll_number);

      if (error) {
        console.error('Error checking for matches:', error);
        return null;
      }

      if (matches && matches.length > 0) {
        const match = matches[0];
        
        // Send email notification to both students
        await this.sendMatchNotification(request.roll_number, match.roll_number);
        
        // Delete both requests from database
        await supabase
          .from('swap_requests')
          .delete()
          .eq('id', match.id);

        return {
          counterpart_roll: match.roll_number,
          success: true
        };
      }

      return null;
    } catch (error) {
      console.error('Error in checkForMatch:', error);
      return null;
    }
  }

  static async createSwapRequest(request: SwapRequest): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('swap_requests')
        .insert([request]);

      if (error) {
        console.error('Error creating swap request:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createSwapRequest:', error);
      return false;
    }
  }

  static async sendMatchNotification(roll1: string, roll2: string): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-match-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll1,
          roll2
        })
      });

      if (!response.ok) {
        console.error('Failed to send match notification');
      }
    } catch (error) {
      console.error('Error sending match notification:', error);
    }
  }
}