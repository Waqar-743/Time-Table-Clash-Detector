#include <iostream>
#include <string>

/**
 * Simplified logic for authentication.
 * Returns 1 for true, 0 for false.
 */

// Checks if email is valid (has @ and . after it)
int checkEmail(const std::string& email) {
    int hasAt = 0;
    int hasDot = 0;
    int atPos = -1;

    for (int i = 0; i < email.length(); i++) {
        if (email[i] == '@') {
            hasAt = 1;
            atPos = i;
        } else if (hasAt == 1 && email[i] == '.' && i > atPos + 1) {
            hasDot = 1;
        }
    }

    if (hasAt == 1 && hasDot == 1 && atPos > 0 && email.length() > atPos + 3) {
        return 1;
    }
    return 0;
}

// Checks if password is strong (8+ chars, letter and number)
int checkPassword(const std::string& password) {
    if (password.length() < 8) {
        return 0;
    }
    
    int hasLetter = 0;
    int hasNumber = 0;
    
    for (int i = 0; i < password.length(); i++) {
        char c = password[i];
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            hasLetter = 1;
        }
        if (c >= '0' && c <= '9') {
            hasNumber = 1;
        }
    }
    
    if (hasLetter == 1 && hasNumber == 1) {
        return 1;
    }
    return 0;
}

