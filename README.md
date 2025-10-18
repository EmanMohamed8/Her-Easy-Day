# Luna Planner 🌙

A beautiful and intuitive daily planner app designed specifically for women, featuring period tracking, mood monitoring, and task management with an elegant pink and lavender theme.

## Features

### 📅 Calendar View
- Interactive monthly calendar with clickable days
- Visual indicators for tasks, moods, and period entries
- Smooth navigation between months

### ✅ Task Management
- Add, complete, and delete daily tasks
- Priority levels (Low, Medium, High) with color coding
- Task completion tracking and statistics

### 😊 Mood Tracking
- Six mood options: Happy, Excited, Calm, Neutral, Anxious, Sad
- Optional notes for each mood entry
- Visual mood indicators on calendar

### 🩸 Period & Pregnancy Tracking
- Period flow tracking (Light, Medium, Heavy)
- Symptom logging with common options
- Ovulation and PMS tracking
- Period prediction based on cycle length
- Pregnancy week tracking with symptoms and weight monitoring

### 😴 Sleep Quality Tracking
- Sleep quality rating (Excellent to Terrible)
- Bedtime and wake time logging
- Hours slept tracking
- Sleep notes for dreams and disturbances

### 💪 Physical Health Monitoring
- Energy level tracking (Very High to Very Low)
- Exercise type and duration logging
- Water intake monitoring
- Physical symptom tracking
- Health notes and observations

### ⚠️ Daily Obstacles Management
- Track visitors, emergencies, and unexpected events
- Impact level assessment (Low, Medium, High)
- Time affected by obstacles
- Obstacle categorization and notes

### ⏰ Time Management
- Available vs planned hours tracking
- Actual productive hours logging
- Time block scheduling with activities
- Time efficiency calculations
- Productivity insights and notes

### 👤 Profile & Settings
- Personal information management
- Cycle length customization
- Data export/import functionality
- Usage statistics and completion rates
- Local data storage with backup options

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date utilities
- **Local Storage** for data persistence

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Calendar.tsx     # Monthly calendar view
│   ├── TaskList.tsx     # Task management component
│   ├── MoodTracker.tsx  # Mood selection and tracking
│   ├── PeriodTracker.tsx # Period and pregnancy tracking
│   └── Navigation.tsx   # App navigation bar
├── pages/              # Route components
│   ├── Home.tsx        # Calendar home page
│   ├── DayDetails.tsx  # Individual day view
│   └── Profile.tsx     # Settings and profile
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # Local storage hook
├── types/              # TypeScript type definitions
│   └── index.ts        # App-wide types
├── utils/              # Utility functions
│   └── dateUtils.ts    # Date manipulation helpers
└── App.tsx             # Main app component
```

## Color Theme

The app uses a soft, feminine color palette:
- **Luna Pink**: Primary pink tones (#ec4899 and variants)
- **Luna Lavender**: Secondary purple-gray tones (#64748b and variants)
- **Elegant Typography**: Inter font family for clean readability

## Data Storage

All data is stored locally in your browser using localStorage. The app includes:
- Automatic data persistence
- Export functionality for backups
- Import capability for data restoration
- Clear all data option for fresh starts

## Contributing

This is a personal planner app designed with women's wellness in mind. Feel free to customize and extend the features based on your needs.

## License

MIT License - feel free to use and modify as needed.