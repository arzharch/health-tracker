from datetime import datetime, date, timedelta
from typing import Optional

class GamificationEngine:
    @staticmethod
    def calculate_streak(
        current_streak: int, 
        freeze_bank: int, 
        last_streak_date: Optional[date], 
        current_log_date: date, 
        habits_completed_today: int, 
        total_habits: int = 8
    ) -> tuple[int, int, Optional[date]]:
        """
        Calculates the new streak and freeze bank based on daily completion.
        Returns: (new_streak, new_freeze_bank, new_last_streak_date)
        """
        if habits_completed_today < total_habits:
            return current_streak, freeze_bank, last_streak_date

        if not last_streak_date:
            return 1, freeze_bank, current_log_date
            
        days_difference = (current_log_date - last_streak_date).days

        if days_difference == 1:
            # Consecutive day
            new_streak = current_streak + 1
            new_freeze_bank = freeze_bank
            
            # Earn a freeze every 7 perfect days
            if new_streak % 7 == 0 and freeze_bank < 3:
                new_freeze_bank += 1
                
            return new_streak, new_freeze_bank, current_log_date
            
        elif days_difference > 1:
            # Missed days. Can we use freezes?
            missed_days = days_difference - 1
            if freeze_bank >= missed_days:
                new_freeze_bank = freeze_bank - missed_days
                new_streak = current_streak + 1
                
                # Earn a freeze every 7 perfect days
                if new_streak % 7 == 0 and new_freeze_bank < 3:
                    new_freeze_bank += 1
                    
                return new_streak, new_freeze_bank, current_log_date
            else:
                # Streak broken
                return 1, 0, current_log_date
                
        # Same day update (maybe re-toggled)
        return current_streak, freeze_bank, last_streak_date
