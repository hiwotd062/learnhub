# 🎓 LearnHub — E-Learning & Educational Platform

A modern, fully functional educational website inspired by Coursera and Udemy. Students can discover courses, watch structured lessons, complete interactive quizzes with instant scores, take persistent notes, and track their learning progress.

---

## 🚀 Built Pages & Features

### 1. 🏠 Home Page (`#/home`)
- **Hero Section**: High-impact headline, subtext, search bar with category quick pills, and stats badge.
- **Key Metrics**: 45,000+ active students, 120+ courses, 98% satisfaction, 24/7 lifetime access.
- **Popular Courses Grid**: Best-rated courses with ratings, student counts, and instructor avatars.
- **Platform Benefits**: Explanation of video curricula, interactive quizzes, and student note-taking.
- **Student Testimonials**: Verified reviews with ratings and student roles.

### 2. 📚 Courses Catalog Page (`#/courses`)
- **Live Search**: Instant keyword search across titles, descriptions, and instructors.
- **Category Filter**: `All`, `Development`, `Design`, `Data Science`, `Mobile`, `AI & Tech`, `Security`.
- **Level Filter**: `All`, `Beginner`, `Intermediate`, `Advanced`.
- **Sort By**: Most Popular, Highest Rated, Price Low to High.
- **Course Cards**: Hover animations, duration tags, badges (`Bestseller`, `Popular`, `Trending`), and enroll status.

### 3. 📄 Course Details Page (`#/course/:id`)
- **Hero Banner**: Category breadcrumb, ratings, review count, total hours, and instructor summary.
- **Sticky Enrollment Box**: Price, savings discount badge, "Enroll Now" action, and "What this course includes".
- **What You'll Learn**: 2-column checklist of outcomes.
- **Curriculum Accordion**: Interactive breakdown of sections, lessons, and runtimes.
- **Instructor Bio**: Detailed career overview.

### 4. 📊 Student Dashboard (`#/dashboard`)
- **Welcome Banner**: Active student greeting with avatar and personalized stats.
- **Metrics Overview**: Enrolled courses count, completed lessons, average quiz scores, and study streak.
- **Enrolled Courses**: Real-time progress bars (% complete), completed lessons count (e.g. 8/12), and "Continue Lesson" direct links.

### 5. 🎥 Learning Classroom (`#/learn/:courseId/:lessonId`)
- **Responsive 16:9 Video Player**: Embedded video player for the current lesson.
- **Navigation Controls**: "← Previous Lesson" and "Next Lesson →".
- **Mark as Complete**: Toggle button that marks lessons done and updates student progress.
- **Interactive Curriculum Sidebar**: Collapsible sections with checkmark indicators.
- **Tabbed Drawer**:
  - *Lesson Overview*: Key concepts and takeaways.
  - *My Notes*: Interactive notepad that **auto-saves** to `localStorage`.
  - *Resources*: Downloadable cheat sheets and starter code.

### 6. 📝 Quiz Assessment Page (`#/quiz/:courseId`)
- **Multiple-Choice Questions**: Clean radio selection cards with hover states.
- **Scoring Engine**: Evaluates answers, provides percentage score, and marks Pass/Fail against 70% threshold.
- **Answer Feedback**: Detailed explanation for every question.
- **Score Recording**: Saves the score to the student's dashboard profile in `localStorage`.
- **Retake Quiz**: Reset and re-attempt.

### 7. 🌗 Dark Mode & Authentication
- **Dark Mode**: Toggle button in the navbar seamlessly switches between light and dark themes with persistent storage.
- **Authentication / Profile Modal**: Change student name and email, or reset to default demo data.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic tags, accessible document structure.
- **Tailwind CSS**: Modern utility styling loaded via CDN (zero installation needed).
- **Modern JavaScript (ES6+)**: Custom hash router, centralized state management, local storage persistence.
- **Zero Dependencies / No Build Steps Required**: Double-click `index.html` to run in any browser.

---

## 🏃 How to Run

1. Open your workspace directory: `c:\Users\Asefa\Desktop\New folder\`
2. Double-click [index.html](file:///c:/Users/Asefa/Desktop/New%20folder/index.html).
3. Browse courses, click **Enroll**, watch lessons, take notes, and complete the quiz!
