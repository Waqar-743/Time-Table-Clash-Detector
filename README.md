# TimeSmart Clash Detector

![TimeSmart Banner](https://picsum.photos/seed/timesmart/1200/400)

**TimeSmart** is a premium, high-performance timetable management and clash detection system designed for academic environments. Built with a focus on visual excellence and intuitive user experience, it allows students and instructors to seamlessly manage their schedules, detect overlaps, and organize their academic life.

## ✨ Features

- 🔐 **Premium Auth Flow**: Secure, beautiful login and signup screens with session persistence.
- 📊 **Dynamic Dashboard**: Real-time overview of total subjects, weekly study load, and active conflicts.
- 🖐️ **Drag & Drop Timetable**: Reschedule classes with an intuitive manual drag-and-drop interface.
- 🌈 **Custom Subject Coloring**: Categorize your modules with a premium color palette for better visual organization.
- ⚠️ **Smart Clash Detection**: Real-time identification of schedule overlaps with detailed conflict analysis.
- 🌓 **Dark Mode Support**: A stunning dark theme designed for late-night study sessions.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, utility-first design
- **Routing**: React Router DOM (HashRouter)
- **Icons**: Google Material Symbols
- **Build Tool**: Vite

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd timesmart-clash-detector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/screens`: Contains the main page components (Dashboard, Timetable, Auth, etc.)
- `App.tsx`: Main application entry and state management.
- `types.ts`: Standardized TypeScript interfaces for Subjects, Conflicts, and Users.
- `constants.ts`: Initial data and various static configurations.
- `utils.ts`: Core logic for conflict detection and time calculations.

## 📘 How to Use

1. **Sign Up**: Create an account to start managing your schedule.
2. **Add Subjects**: Use the "Add Subject" form to input your module details, including custom colors and room numbers.
3. **Manage Timetable**: Head to the Timetable section. If you see a clash, simply drag the subject to a new slot to resolve it manually.
4. **Check Dashboard**: Monitor your weekly hours and "Study Load" to stay on top of your academic commitments.

---

Built with ❤️ for better academic productivity.
