# C++ Logic Reference

This folder contains the core logic of the TimeSmart Clash Detector implemented in C++. 
It serves as a reference for the business logic used in the application.

## Logic Mapping

| Feature | C++ File | TypeScript Equivalent |
|---------|----------|-----------------------|
| Auth Validation | `auth_logic.cpp` | `screens/Auth.tsx` |
| Clash Detection | `clash_logic.cpp` | `utils.ts` |
| Data Formatting | `data_formatter.cpp` | `App.tsx` (fetch/add logic) |

**Note:** The application uses TypeScript for execution. This folder can be safely deleted without affecting the application's functionality. The C++ logic here has been simplified to the most basic level (using `int` instead of `bool`, manual loops, and no classes) for maximum clarity.
