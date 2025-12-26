#include <iostream>
#include <vector>
#include <string>

/**
 * Core clash detection algorithm.
 * Reference for: utils.ts (detectConflicts)
 */
struct TimeSlot {
    int startMinutes;
    int endMinutes;
};

class ClashLogic {
public:
    static int timeToMinutes(const std::string& time) {
        // Expected format "HH:mm"
        int hours = std::stoi(time.substr(0, 2));
        int minutes = std::stoi(time.substr(3, 2));
        return hours * 60 + minutes;
    }

    static bool isOverlapping(TimeSlot t1, TimeSlot t2) {
        // A overlap exists if the start of one is before the end of the other
        // and vice versa.
        return (t1.startMinutes < t2.endMinutes && t2.startMinutes < t1.endMinutes);
    }
};
