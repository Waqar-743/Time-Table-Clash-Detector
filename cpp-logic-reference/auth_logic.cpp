#include <iostream>
#include <string>
#include <regex>

/**
 * Validates password strength and email format.
 * Reference for: screens/Auth.tsx
 */
class AuthLogic {
public:
    static bool isValidEmail(const std::string& email) {
        const std::regex pattern(R"((\w+)(\.{1}\w+)*@(\w+)(\.\w+)+)");
        return std::regex_match(email, pattern);
    }

    static bool isStrongPassword(const std::string& password) {
        // Minimum 8 characters, at least one letter and one number
        if (password.length() < 8) return false;
        
        bool hasLetter = false;
        bool hasNumber = false;
        
        for (char c : password) {
            if (std::isalpha(c)) hasLetter = true;
            if (std::isdigit(c)) hasNumber = true;
        }
        
        return hasLetter && hasNumber;
    }
};
