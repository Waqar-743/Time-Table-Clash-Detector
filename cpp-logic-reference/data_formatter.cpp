#include <iostream>
#include <string>

/**
 * Simplified logic for data formatting.
 */

// Combines strings into a simple format
std::string formatSubject(std::string title, std::string start, std::string end) {
    std::string result = "";
    result = result + "Subject: " + title;
    result = result + " (Starts: " + start;
    result = result + ", Ends: " + end + ")";
    return result;
}

