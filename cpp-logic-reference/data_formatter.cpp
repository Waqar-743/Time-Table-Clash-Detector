#include <iostream>
#include <string>
#include <map>

/**
 * Logic for formatting data between the app and Supabase.
 * Reference for: App.tsx (fetchSubjects / addSubject)
 */
class DataFormatter {
public:
    static std::map<std::string, std::string> formatForSupabase(
        std::string title, 
        std::string startTime, 
        std::string endTime,
        std::string userEmail
    ) {
        std::map<std::string, std::string> row;
        row["title"] = title;
        row["start_time"] = startTime; // Ensure HH:mm:ss if needed
        row["end_time"] = endTime;
        row["user_email"] = userEmail;
        return row;
    }
};
