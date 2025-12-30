#include <iostream>
#include <string>

/**
 * Simplified logic for clash detection.
 * Returns 1 for true, 0 for false.
 */

// Converts "HH:mm" to total minutes
int getMinutes(const std::string& time) {
    // Get digits manually
    int h1 = time[0] - '0';
    int h2 = time[1] - '0';
    int m1 = time[3] - '0';
    int m2 = time[4] - '0';
    
    int hours = h1 * 10 + h2;
    int minutes = m1 * 10 + m2;
    
    return (hours * 60) + minutes;
}

// Checks if two time ranges overlap
int checkOverlap(int start1, int end1, int start2, int end2) {
    if (start1 < end2 && start2 < end1) {
        return 1;
    }
    return 0;
}

