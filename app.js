/**
 * LearnHub - Main Application Logic & Single-Page Router
 * Complete state management, page renderers, interactive quizzes, and local storage persistence.
 */

// Global Application State
const AppState = {
  student: null,
  theme: 'light',
  searchQuery: '',
  selectedCategory: 'All',
  selectedLevel: 'All',
  sortBy: 'popular',
  toastTimeout: null
};

// Initialize State from LocalStorage
function initAppState() {
  const savedStudent = localStorage.getItem('learnhub_student');
  if (savedStudent) {
    try {
      AppState.student = JSON.parse(savedStudent);
    } catch (e) {
      AppState.student = { ...INITIAL_STUDENT };
    }
  } else {
    AppState.student = { ...INITIAL_STUDENT };
    saveStudentState();
  }

  const savedTheme = localStorage.getItem('learnhub_theme') || 'light';
  AppState.theme = savedTheme;
  applyTheme(savedTheme);
}

function saveStudentState() {
  localStorage.setItem('learnhub_student', JSON.stringify(AppState.student));
}

function applyTheme(theme) {
  AppState.theme = theme;
  localStorage.setItem('learnhub_theme', theme);
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  updateThemeIcons();
}

function updateThemeIcons() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = AppState.theme === 'dark' 
      ? `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
      : `<svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
  }
}

// Toast Notification System
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const bgColors = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-indigo-600 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white'
  };

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transform transition-all duration-300 translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/* ========================================================
   ROUTER & NAVIGATION
   ======================================================== */
function parseHash() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  return {
    raw: hash,
    base: parts[0] || '',
    param1: parts[1] || '',
    param2: parts[2] || ''
  };
}

function navigateTo(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  const route = parseHash();
  const appEl = document.getElementById('mainContent');
  if (!appEl) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('data-route');
    if (target === route.base || (target === '' && route.base === '')) {
      link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
      link.classList.remove('text-slate-600', 'dark:text-slate-300');
    } else {
      link.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
      link.classList.add('text-slate-600', 'dark:text-slate-300');
    }
  });

  switch (route.base) {
    case '':
    case 'home':
      renderHomePage(appEl);
      break;
    case 'courses':
      renderCoursesPage(appEl);
      break;
    case 'course':
      renderCourseDetailsPage(appEl, route.param1);
      break;
    case 'dashboard':
      renderDashboardPage(appEl);
      break;
    case 'books':
      renderBooksPage(appEl);
      break;
    case 'learn':
      renderLearningPage(appEl, route.param1, route.param2);
      break;
    case 'quiz':
      renderQuizPage(appEl, route.param1);
      break;
    default:
      renderHomePage(appEl);
  }
}


/* ========================================================
   HELPER UTILITIES
   ======================================================== */
function getCourseById(id) {
  return COURSES_DATA.find(c => c.id === id);
}

function isEnrolled(courseId) {
  return AppState.student?.enrolledCourseIds?.includes(courseId) || false;
}

function enrollInCourse(courseId) {
  if (!AppState.student) return;
  if (!AppState.student.enrolledCourseIds.includes(courseId)) {
    AppState.student.enrolledCourseIds.push(courseId);
    if (!AppState.student.completedLessons[courseId]) {
      AppState.student.completedLessons[courseId] = [];
    }
    saveStudentState();
    showToast("Successfully enrolled! Welcome to the course.", "success");
    handleRoute();
  }
}

function getCourseProgress(courseId) {
  const course = getCourseById(courseId);
  if (!course) return 0;
  const completed = AppState.student?.completedLessons[courseId] || [];
  const total = course.totalLessons || 1;
  return Math.min(100, Math.round((completed.length / total) * 100));
}

function getNextLesson(courseId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  const completed = AppState.student?.completedLessons[courseId] || [];

  for (const section of course.curriculum) {
    for (const lesson of section.lessons) {
      if (!completed.includes(lesson.id)) {
        return lesson;
      }
    }
  }
  // If all completed, return the first lesson
  return course.curriculum[0]?.lessons[0] || null;
}

function toggleLessonComplete(courseId, lessonId) {
  if (!AppState.student) return;
  if (!AppState.student.completedLessons[courseId]) {
    AppState.student.completedLessons[courseId] = [];
  }
  const completedList = AppState.student.completedLessons[courseId];
  const index = completedList.indexOf(lessonId);

  if (index > -1) {
    completedList.splice(index, 1);
    showToast("Lesson marked as incomplete", "info");
  } else {
    completedList.push(lessonId);
    showToast("Lesson completed! Keep up the momentum 🎉", "success");
  }
  saveStudentState();
}


/* ========================================================
   PAGE 1: HOME PAGE (With Smart Registration & Bookstore)
   ======================================================== */
function renderHomePage(container) {
  const popularCourses = COURSES_DATA.slice(0, 4);
  const featuredBooks = BOOKS_DATA.slice(0, 4);

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-900 py-16 lg:py-24 border-b border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Text Content -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
              Join 45,000+ Modern Learners Worldwide
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Master In-Demand Skills. <br class="hidden sm:block" />
              <span class="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">Accelerate Your Future.</span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Learn web development, artificial intelligence, product design, and cybersecurity through structured video curricula, real-world portfolio projects, an interactive e-bookstore, and self-assessment quizzes.
            </p>

            <!-- Search Bar in Hero -->
            <div class="pt-2 max-w-xl mx-auto lg:mx-0">
              <form id="heroSearchForm" class="flex items-center bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg shadow-indigo-100/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
                <div class="pl-3 text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" id="heroSearchInput" placeholder="What skill or book do you want to learn today?" class="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/30 flex-shrink-0">
                  Search
                </button>
              </form>

              <!-- Quick category pills -->
              <div class="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span class="font-medium">Trending:</span>
                <button onclick="quickFilterCategory('Development')" class="hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors">React & Node</button>
                <button onclick="quickFilterCategory('AI & Tech')" class="hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors">Generative AI</button>
                <button onclick="quickFilterCategory('Design')" class="hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors">Figma UI/UX</button>
              </div>
            </div>

            <!-- CTA Buttons & Social Proof -->
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#/courses" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-all shadow-md">
                Browse Courses
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
              <a href="#/books" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold px-6 py-3.5 rounded-xl text-base transition-all">
                📖 Smart Bookstore
              </a>
            </div>

          </div>

          <!-- Right Showcase Visual -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Glow Orb behind image -->
              <div class="absolute -top-10 -right-10 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-2xl bg-white dark:bg-slate-800">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students learning together" class="w-full h-80 object-cover">
                
                <!-- Floating Glass Card: Active Course -->
                <div class="p-5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">In Progress</span>
                    <span class="text-xs text-slate-500 font-medium">8 of 12 Lessons</span>
                  </div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">Full-Stack Web Development Bootcamp</h4>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full" style="width: 68%"></div>
                  </div>
                  <div class="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>68% completed</span>
                    <span class="text-indigo-600 dark:text-indigo-400 font-medium">Next: Section 3</span>
                  </div>
                </div>
              </div>

              <!-- Floating Metric Badge 1 -->
              <div class="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                  ★
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white">4.9 / 5.0 Rating</div>
                  <div class="text-xs text-slate-500">From 18,000+ Verified Students</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Key Statistics Strip -->
    <section class="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">45,000+</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Active Students</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white">120+</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Masterclass Courses</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-amber-500">50+ E-Books</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Digital Bookstore Library</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100% Free</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Starter Registration</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================
         SMART REGISTRATION SECTION (Direct on Home Page)
         ======================================================== -->
    <section class="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <!-- Glow ambient background circles -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Pitch & Value Proposition -->
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold tracking-wide uppercase">
              ⚡ Instant 10-Second Student Signup
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Start Learning with a <br />
              <span class="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">Free Student Membership.</span>
            </h2>

            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create your account in seconds to unlock personalized learning paths, track lesson progress, download complimentary e-books from our bookstore, and earn verified skill certificates.
            </p>

            <div class="space-y-3.5 pt-2">
              <div class="flex items-center gap-3 text-sm text-slate-200">
                <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">✓</div>
                <span>Full access to 120+ courses & structured lesson tracks</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-200">
                <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">✓</div>
                <span>Free access to our Smart Bookstore & downloadable PDF study guides</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-200">
                <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">✓</div>
                <span>Interactive exam quizzes with automated score certifications</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-200">
                <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">✓</div>
                <span>No credit card required — 100% free starter access</span>
              </div>
            </div>
          </div>

          <!-- Right Smart Registration Card Form -->
          <div class="lg:col-span-6">
            <div class="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 class="text-xl font-bold text-white">Create Student Account</h3>
                  <p class="text-xs text-indigo-200 mt-0.5">Free forever. Level up your career today.</p>
                </div>
                <div class="w-10 h-10 rounded-2xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-lg">
                  🚀
                </div>
              </div>

              <form id="homeRegisterForm" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-200 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    id="regFullName" 
                    placeholder="e.g. Maya Lin" 
                    required 
                    class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-200 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="regEmail" 
                    placeholder="name@company.com" 
                    required 
                    class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-200 mb-1">Choose a Password</label>
                  <input 
                    type="password" 
                    id="regPassword" 
                    placeholder="At least 6 characters" 
                    required 
                    minlength="6"
                    class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-200 mb-1">Primary Learning Goal</label>
                  <select 
                    id="regTrack" 
                    class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="web-dev-masterclass">Full-Stack Web Development (React & Node)</option>
                    <option value="ui-ux-design-pro">UI/UX Design Masterclass (Figma)</option>
                    <option value="python-data-science">Data Science & Machine Learning (Python)</option>
                    <option value="generative-ai-engineering">Applied Generative AI & LLMs</option>
                    <option value="cybersecurity-ethical-hacking">Cybersecurity & Ethical Hacking</option>
                    <option value="flutter-mobile-apps">Mobile App Development (Flutter & Dart)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  class="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  <span>Complete Registration & Launch Dashboard</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>

                <div class="text-center text-[11px] text-slate-400 pt-1">
                  By signing up, you agree to LearnHub's Terms & Privacy Policy.
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Popular Courses Grid Section -->
    <section class="py-16 bg-slate-50/60 dark:bg-slate-900/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Top-Rated Content</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Popular Courses</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore our most in-demand learning paths designed by industry leaders.</p>
          </div>
          <a href="#/courses" class="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
            View All Courses
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>

        <!-- Course Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${popularCourses.map(course => renderCourseCard(course)).join('')}
        </div>
      </div>
    </section>

    <!-- ========================================================
         SMART BOOKSTORE SHOWCASE (Home Page Library Showcase)
         ======================================================== -->
    <section class="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              📖 Digital Bookstore & Reading Lounge
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Smart E-Books & Technical Guides</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Download complimentary developer handbooks or read sample chapters directly in your browser.</p>
          </div>
          <a href="#/books" class="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors">
            Browse Full Bookstore (${BOOKS_DATA.length} Books)
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>

        <!-- Book Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${featuredBooks.map(book => renderBookCard(book)).join('')}
        </div>
      </div>
    </section>

    <!-- Why Choose LearnHub / Benefits Section -->
    <section class="py-16 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Why LearnHub</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Everything You Need to Succeed</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Built for practical retention with modular video lessons, an e-book reading lounge, automated quizzes, and student progress tracking.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 text-xl">
              🎥
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Structured Video Curricula</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">High-definition lessons organized by modules from beginner fundamentals to real-world architectures.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 text-xl">
              📚
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Smart Bookstore & Reading Lounge</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Curated digital textbooks and cheat sheets available for instant in-browser reading or PDF download.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 text-xl">
              🏆
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Interactive Quizzes & Certificates</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Test your skills with automated assessments and earn shareable certificates to showcase on LinkedIn.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Student Testimonials Section -->
    <section class="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Student Stories</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Loved by Learners Everywhere</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${TESTIMONIALS_DATA.map(t => `
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex text-amber-400 mb-3 text-sm">
                  ${'★'.repeat(t.rating)}
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">"${t.text}"</p>
              </div>
              <div class="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover">
                <div>
                  <div class="font-bold text-slate-900 dark:text-white text-sm">${t.name}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">${t.role}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Attach hero search listener
  const heroForm = document.getElementById('heroSearchForm');
  const heroInput = document.getElementById('heroSearchInput');
  if (heroForm && heroInput) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = heroInput.value.trim();
      AppState.searchQuery = query;
      navigateTo('/courses');
    });
  }

  // Attach home registration form listener
  const regForm = document.getElementById('homeRegisterForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const initialTrack = document.getElementById('regTrack').value;

      if (!name || !email) return;

      // Register new student profile
      AppState.student = {
        name: name,
        email: email,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=256&q=80`,
        enrolledCourseIds: [initialTrack],
        completedLessons: {
          [initialTrack]: []
        },
        quizScores: {},
        notes: {}
      };

      saveStudentState();
      updateNavbarProfile();
      showToast(`🎉 Welcome to LearnHub, ${name}! Your account is active.`, "success");
      
      // Auto navigate to the newly enrolled course classroom!
      const enrolledCourse = getCourseById(initialTrack);
      if (enrolledCourse && enrolledCourse.curriculum[0]?.lessons[0]) {
        setTimeout(() => {
          navigateTo(`/learn/${enrolledCourse.id}/${enrolledCourse.curriculum[0].lessons[0].id}`);
        }, 1200);
      } else {
        navigateTo('/dashboard');
      }
    });
  }

  // Attach book preview buttons
  setupBookCardActions();
}


function quickFilterCategory(category) {
  AppState.selectedCategory = category;
  AppState.searchQuery = '';
  navigateTo('/courses');
}


/* ========================================================
   BOOKSTORE COMPONENTS & PAGE (Smart E-Bookstore)
   ======================================================== */
function renderBookCard(book) {
  return `
    <div class="book-card-3d group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300">
      
      <!-- 3D Book Cover Presentation -->
      <div class="relative aspect-[3/4] overflow-hidden bg-slate-900 book-cover-wrap">
        <img 
          src="${book.cover}" 
          alt="${book.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        >
        <!-- Realistic Spine Shadow -->
        <div class="book-spine"></div>
        
        <!-- Badge -->
        ${book.badge ? `
          <div class="absolute top-3 left-4 bg-amber-500 text-slate-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            ${book.badge}
          </div>
        ` : ''}

        <!-- Format Tag -->
        <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
          ${book.format}
        </div>

        <!-- Hover Overlay Quick Action -->
        <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button class="read-preview-btn bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0" data-book-id="${book.id}">
            <span>📖 Read Sample</span>
          </button>
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] mb-1.5">
            <span class="font-bold text-amber-600 dark:text-amber-400">${book.category}</span>
            <span class="text-slate-400">${book.pages} pages</span>
          </div>

          <h3 class="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            ${book.title}
          </h3>

          <div class="text-xs text-slate-500 dark:text-slate-400 mb-2">
            By <strong class="text-slate-700 dark:text-slate-300 font-medium">${book.author}</strong>
          </div>

          <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <span class="text-amber-500 font-bold">★ ${book.rating.toFixed(1)}</span>
            <span>(${book.reviews.toLocaleString()} readers)</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            Free with Account
          </span>
          <button class="read-preview-btn text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" data-book-id="${book.id}">
            Preview
          </button>
        </div>
      </div>

    </div>
  `;
}

function renderBooksPage(container) {
  let selectedBookCategory = 'All';
  let bookSearchQuery = '';

  function renderBooks() {
    let filteredBooks = BOOKS_DATA.filter(b => {
      if (selectedBookCategory !== 'All' && b.category !== selectedBookCategory) return false;
      if (bookSearchQuery) {
        const q = bookSearchQuery.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.shortDescription.toLowerCase().includes(q);
      }
      return true;
    });

    const categories = ['All', 'Development', 'Design', 'Data Science & AI', 'AI & Tech', 'Cybersecurity', 'Mobile'];

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              📚 LearnHub Smart Digital Library
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold">Digital Bookstore & Study Guides</h1>
            <p class="text-amber-100 text-xs sm:text-sm max-w-xl">Curated technical textbooks, architecture handbooks, and interview prep manuals. Read sample chapters directly in your browser or download PDFs.</p>
          </div>

          <div class="text-center md:text-right bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div class="text-2xl font-extrabold">100% Free</div>
            <div class="text-xs text-amber-200">Included with Student Membership</div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 space-y-4">
          
          <!-- Search Bar -->
          <div class="relative">
            <input 
              type="text" 
              id="bookSearchInput" 
              value="${bookSearchQuery}" 
              placeholder="Search books by title, topic, author, or keyword..." 
              class="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
            <div class="absolute left-3.5 top-3 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <span class="text-xs font-semibold text-slate-400 mr-1">Topic:</span>
            ${categories.map(cat => `
              <button 
                class="book-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedBookCategory === cat 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }"
                data-category="${cat}"
              >
                ${cat}
              </button>
            `).join('')}
          </div>

        </div>

        <!-- Books Grid -->
        <div class="mb-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>Showing <strong class="text-slate-900 dark:text-white">${filteredBooks.length}</strong> textbooks and manuals</div>
        </div>

        ${filteredBooks.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${filteredBooks.map(book => renderBookCard(book)).join('')}
          </div>
        ` : `
          <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div class="text-4xl mb-3">📖</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">No books match your search</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Try another keyword or category.</p>
          </div>
        `}

      </div>
    `;

    // Search listener
    const bSearch = document.getElementById('bookSearchInput');
    if (bSearch) {
      bSearch.addEventListener('input', (e) => {
        bookSearchQuery = e.target.value;
        renderBooks();
      });
    }

    // Category button listeners
    document.querySelectorAll('.book-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedBookCategory = btn.getAttribute('data-category');
        renderBooks();
      });
    });

    setupBookCardActions();
  }

  renderBooks();
}

function setupBookCardActions() {
  document.querySelectorAll('.read-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.getAttribute('data-book-id');
      openBookReader(bookId);
    });
  });
}

function openBookReader(bookId) {
  const book = BOOKS_DATA.find(b => b.id === bookId);
  if (!book) return;

  const modal = document.getElementById('bookReaderModal');
  const titleEl = document.getElementById('readerBookTitle');
  const chapterSelect = document.getElementById('readerChapterSelect');
  const chapterTitleEl = document.getElementById('readerChapterTitle');
  const chapterBodyEl = document.getElementById('readerChapterBody');
  const closeBtn = document.getElementById('closeBookReaderBtn');
  const downloadBtn = document.getElementById('downloadPdfBtn');

  if (!modal || !book.chapters) return;

  titleEl.textContent = `${book.title} (by ${book.author})`;

  // Populate chapter options
  chapterSelect.innerHTML = book.chapters.map((ch, idx) => `
    <option value="${idx}">${ch.title}</option>
  `).join('');

  function displayChapter(idx) {
    const ch = book.chapters[idx] || book.chapters[0];
    chapterTitleEl.textContent = ch.title;
    chapterBodyEl.textContent = ch.content;
  }

  displayChapter(0);

  chapterSelect.onchange = (e) => {
    displayChapter(parseInt(e.target.value));
  };

  closeBtn.onclick = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  downloadBtn.onclick = () => {
    showToast(`📥 Downloading "${book.title}" in ${book.format}...`, "success");
  };

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}


/* ========================================================
   PAGE 2: COURSES CATALOG PAGE (Search & Filter)
   ======================================================== */
function renderCoursesPage(container) {
  // Filter courses
  let filtered = COURSES_DATA.filter(course => {
    // Search query match
    if (AppState.searchQuery) {
      const q = AppState.searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.shortDescription.toLowerCase().includes(q);
      const matchInstructor = course.instructor.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInstructor) return false;
    }
    // Category match
    if (AppState.selectedCategory !== 'All' && course.category !== AppState.selectedCategory) {
      return false;
    }
    // Level match
    if (AppState.selectedLevel !== 'All' && course.level !== AppState.selectedLevel) {
      return false;
    }
    return true;
  });

  // Sorting
  if (AppState.sortBy === 'popular') {
    filtered.sort((a, b) => b.studentsCount - a.studentsCount);
  } else if (AppState.sortBy === 'highest-rated') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (AppState.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  }

  const categories = ['All', 'Development', 'Design', 'Data Science', 'Mobile', 'AI & Tech', 'Security'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Catalog Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Explore Courses</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover expert-led courses across development, AI, design, and cybersecurity.</p>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 space-y-4">
        
        <!-- Search Input -->
        <div class="relative">
          <input 
            type="text" 
            id="catalogSearchInput" 
            value="${AppState.searchQuery}" 
            placeholder="Search by course title, keywords, or instructor..." 
            class="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <div class="absolute left-3.5 top-3 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <!-- Filter Controls Row -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          
          <!-- Category Pills -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-400 mr-1">Category:</span>
            ${categories.map(cat => `
              <button 
                class="category-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  AppState.selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }"
                data-category="${cat}"
              >
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Level & Sort Options -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Level Select -->
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400 font-medium">Level:</span>
              <select id="levelSelect" class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded-lg border-0 text-xs font-medium focus:ring-1 focus:ring-indigo-500">
                ${levels.map(lvl => `
                  <option value="${lvl}" ${AppState.selectedLevel === lvl ? 'selected' : ''}>${lvl}</option>
                `).join('')}
              </select>
            </div>

            <!-- Sort Select -->
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400 font-medium">Sort by:</span>
              <select id="sortSelect" class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-1.5 px-3 rounded-lg border-0 text-xs font-medium focus:ring-1 focus:ring-indigo-500">
                <option value="popular" ${AppState.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
                <option value="highest-rated" ${AppState.sortBy === 'highest-rated' ? 'selected' : ''}>Highest Rated</option>
                <option value="price-low" ${AppState.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      <!-- Filter Stats / Reset -->
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
        <div>Showing <strong class="text-slate-900 dark:text-white">${filtered.length}</strong> available courses</div>
        ${(AppState.searchQuery || AppState.selectedCategory !== 'All' || AppState.selectedLevel !== 'All') ? `
          <button id="resetFiltersBtn" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Clear all filters
          </button>
        ` : ''}
      </div>

      <!-- Course Cards Grid -->
      ${filtered.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(course => renderCourseCard(course)).join('')}
        </div>
      ` : `
        <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">No courses found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Try adjusting your search keywords or resetting category filters to see more results.</p>
          <button id="emptyResetBtn" class="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Reset All Filters
          </button>
        </div>
      `}

    </div>
  `;

  // Attach search input listener
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderCoursesPage(container);
    });
  }

  // Attach category filter buttons
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.selectedCategory = btn.getAttribute('data-category');
      renderCoursesPage(container);
    });
  });

  // Attach level selector
  const levelSelect = document.getElementById('levelSelect');
  if (levelSelect) {
    levelSelect.addEventListener('change', (e) => {
      AppState.selectedLevel = e.target.value;
      renderCoursesPage(container);
    });
  }

  // Attach sort selector
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderCoursesPage(container);
    });
  }

  // Reset filters
  const resetBtn = document.getElementById('resetFiltersBtn');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const resetHandler = () => {
    AppState.searchQuery = '';
    AppState.selectedCategory = 'All';
    AppState.selectedLevel = 'All';
    AppState.sortBy = 'popular';
    renderCoursesPage(container);
  };
  if (resetBtn) resetBtn.addEventListener('click', resetHandler);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetHandler);
}

// Reusable Course Card Component
function renderCourseCard(course) {
  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getCourseProgress(course.id) : 0;

  return `
    <div class="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300">
      
      <!-- Thumbnail with Badge -->
      <div class="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-700">
        <img 
          src="${course.thumbnail}" 
          alt="${course.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        >
        ${course.badge ? `
          <div class="absolute top-3 left-3 bg-indigo-600 text-white font-semibold text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
            ${course.badge}
          </div>
        ` : ''}

        <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-md">
          ${course.duration}
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- Category & Level -->
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-semibold text-indigo-600 dark:text-indigo-400">${course.category}</span>
            <span class="text-slate-400 font-medium">${course.level}</span>
          </div>

          <!-- Title -->
          <h3 class="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
            <a href="#/course/${course.id}">${course.title}</a>
          </h3>

          <!-- Instructor info -->
          <div class="flex items-center gap-2 mb-3">
            <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-6 h-6 rounded-full object-cover">
            <span class="text-xs text-slate-500 dark:text-slate-400">${course.instructor.name}</span>
          </div>

          <!-- Rating & Students -->
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span class="font-bold text-amber-500 flex items-center gap-1">
              ★ ${course.rating.toFixed(1)}
            </span>
            <span>(${course.reviewsCount.toLocaleString()})</span>
            <span class="text-slate-300 dark:text-slate-600">•</span>
            <span>${course.totalLessons} Lessons</span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          ${enrolled ? `
            <div class="w-full">
              <div class="flex justify-between items-center text-xs mb-1.5">
                <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Enrolled</span>
                <span class="text-slate-500 font-medium">${progress}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
                <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${progress}%"></div>
              </div>
              <a href="#/learn/${course.id}/${course.curriculum[0].lessons[0].id}" class="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl text-xs transition-colors">
                Continue Learning
              </a>
            </div>
          ` : `
            <div>
              <span class="text-lg font-extrabold text-slate-900 dark:text-white">$${course.price}</span>
              ${course.originalPrice ? `
                <span class="text-xs text-slate-400 line-through ml-1">$${course.originalPrice}</span>
              ` : ''}
            </div>
            <a href="#/course/${course.id}" class="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-colors">
              Details
            </a>
          `}
        </div>

      </div>

    </div>
  `;
}


/* ========================================================
   PAGE 3: COURSE DETAILS PAGE
   ======================================================== */
function renderCourseDetailsPage(container, courseId) {
  const course = getCourseById(courseId);
  if (!course) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto py-20 text-center">
        <h2 class="text-2xl font-bold">Course Not Found</h2>
        <a href="#/courses" class="text-indigo-600 underline mt-4 inline-block">Return to Catalog</a>
      </div>
    `;
    return;
  }

  const enrolled = isEnrolled(course.id);
  const firstLesson = course.curriculum[0]?.lessons[0];

  container.innerHTML = `
    <!-- Course Details Hero Banner -->
    <section class="bg-slate-900 text-white py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <a href="#/home" class="hover:text-white">Home</a>
          <span>/</span>
          <a href="#/courses" class="hover:text-white">Courses</a>
          <span>/</span>
          <span class="text-indigo-400 font-medium">${course.category}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <!-- Left Column Info -->
          <div class="lg:col-span-8 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                ${course.category}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                ${course.level} Level
              </span>
              ${course.badge ? `
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  ${course.badge}
                </span>
              ` : ''}
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              ${course.title}
            </h1>

            <p class="text-base text-slate-300 leading-relaxed">
              ${course.shortDescription}
            </p>

            <!-- Metadata Row -->
            <div class="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
              <div class="flex items-center gap-1.5 font-bold text-amber-400">
                <span>★ ${course.rating.toFixed(1)}</span>
                <span class="text-slate-400 font-normal">(${course.reviewsCount.toLocaleString()} reviews)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <span>${course.studentsCount.toLocaleString()} students</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>${course.duration} total length</span>
              </div>
            </div>

            <!-- Instructor Mini Card -->
            <div class="flex items-center gap-3 pt-4 border-t border-slate-800">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-11 h-11 rounded-full object-cover border-2 border-indigo-500">
              <div>
                <div class="text-xs text-slate-400">Created by</div>
                <div class="font-bold text-sm text-white">${course.instructor.name}</div>
                <div class="text-xs text-slate-400">${course.instructor.role}</div>
              </div>
            </div>

          </div>

          <!-- Right Column: Sticky Enrollment Box (Mobile placement in flow, desktop sticky) -->
          <div class="lg:col-span-4">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700">
              
              <div class="rounded-2xl overflow-hidden aspect-video mb-5 relative bg-slate-900">
                <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
              </div>

              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-extrabold">$${course.price}</span>
                ${course.originalPrice ? `
                  <span class="text-sm text-slate-400 line-through">$${course.originalPrice}</span>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Save ${Math.round((1 - course.price / course.originalPrice) * 100)}%
                  </span>
                ` : ''}
              </div>

              ${enrolled ? `
                <div class="space-y-3">
                  <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    You are already enrolled in this course!
                  </div>
                  <a href="#/learn/${course.id}/${firstLesson.id}" class="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md">
                    Go to Course Classroom
                  </a>
                </div>
              ` : `
                <div class="space-y-3">
                  <button id="enrollCourseBtn" class="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30">
                    Enroll Now — Start Learning
                  </button>
                  <p class="text-center text-xs text-slate-500 dark:text-slate-400">30-Day Money-Back Guarantee</p>
                </div>
              `}

              <!-- This Course Includes List -->
              <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div class="font-bold text-slate-900 dark:text-white mb-2">This course includes:</div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>${course.duration} on-demand video</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>${course.totalLessons} downloadable lesson resources</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  <span>Interactive quizzes & tests</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <span>Access on mobile, tablet, and desktop</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                  <span>Certificate of completion</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Course Content & Curriculum Tabs Section -->
    <section class="py-12 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div class="lg:col-span-8 space-y-10">
            
            <!-- What You'll Learn -->
            <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-5">What you'll learn</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                ${course.highlights.map(item => `
                  <div class="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>${item}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Course Curriculum Accordion -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-xl font-bold text-slate-900 dark:text-white">Course Curriculum</h2>
                  <p class="text-xs text-slate-500 mt-1">${course.curriculum.length} Sections • ${course.totalLessons} Lessons • ${course.duration}</p>
                </div>
              </div>

              <div class="space-y-3">
                ${course.curriculum.map((section, sIdx) => `
                  <div class="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
                    <button class="curriculum-accordion-btn w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-slate-900 dark:text-white text-sm bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                      <div class="flex items-center gap-3">
                        <span class="text-indigo-600 dark:text-indigo-400 font-bold">${sIdx + 1}.</span>
                        <span>${section.sectionTitle}</span>
                      </div>
                      <span class="text-xs text-slate-400">${section.lessons.length} lessons</span>
                    </button>
                    <div class="curriculum-accordion-content divide-y divide-slate-100 dark:divide-slate-700/60">
                      ${section.lessons.map(lesson => `
                        <div class="px-5 py-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <div class="flex items-center gap-2.5">
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                            <span>${lesson.title}</span>
                          </div>
                          <span class="text-slate-400 font-medium">${lesson.duration}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Course Description -->
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Course Description</h2>
              <div class="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                ${course.description}
              </div>
            </div>

            <!-- Instructor Bio Detailed -->
            <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Instructor</h2>
              <div class="flex flex-col sm:flex-row items-start gap-4">
                <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-16 h-16 rounded-2xl object-cover">
                <div>
                  <h3 class="font-bold text-base text-slate-900 dark:text-white">${course.instructor.name}</h3>
                  <div class="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2">${course.instructor.role}</div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${course.instructor.bio}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  `;

  // Attach enrollment button listener
  const enrollBtn = document.getElementById('enrollCourseBtn');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      enrollInCourse(course.id);
    });
  }

  // Curriculum accordion toggles
  document.querySelectorAll('.curriculum-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      content.classList.toggle('hidden');
    });
  });
}


/* ========================================================
   PAGE 4: STUDENT DASHBOARD
   ======================================================== */
function renderDashboardPage(container) {
  if (!AppState.student) {
    container.innerHTML = `<div class="p-10 text-center">Please sign in to view your dashboard.</div>`;
    return;
  }

  const enrolledCourses = AppState.student.enrolledCourseIds
    .map(id => getCourseById(id))
    .filter(Boolean);

  // Compute overall stats
  let totalCompletedLessons = 0;
  Object.values(AppState.student.completedLessons || {}).forEach(arr => {
    totalCompletedLessons += arr.length;
  });

  const quizScoresArr = Object.values(AppState.student.quizScores || {});
  const avgQuizScore = quizScoresArr.length > 0 
    ? Math.round(quizScoresArr.reduce((a, b) => a + b, 0) / quizScoresArr.length) 
    : 0;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Welcome Header Banner -->
      <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <img src="${AppState.student.avatar}" alt="${AppState.student.name}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/20 shadow-md">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-1">
              Active Student
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold">Welcome back, ${AppState.student.name}!</h1>
            <p class="text-indigo-200 text-xs sm:text-sm mt-0.5">Keep pushing forward. Consistency is the key to skill mastery.</p>
          </div>
        </div>

        <a href="#/courses" class="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md">
          Explore New Courses
        </a>
      </div>

      <!-- Quick Metrics Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Enrolled Courses</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">${enrolledCourses.length}</div>
          <div class="text-xs text-slate-500 mt-1">Active curricula</div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Lessons</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">${totalCompletedLessons}</div>
          <div class="text-xs text-slate-500 mt-1">Across all tracks</div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Quiz Score</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-2">${avgQuizScore}%</div>
          <div class="text-xs text-slate-500 mt-1">${quizScoresArr.length} quizzes passed</div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Study Streak</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-2">5 Days 🔥</div>
          <div class="text-xs text-slate-500 mt-1">Daily learning goal met</div>
        </div>
      </div>

      <!-- Enrolled Courses Section -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Your Enrolled Courses</h2>
          <span class="text-xs text-slate-400 font-medium">${enrolledCourses.length} Total</span>
        </div>

        ${enrolledCourses.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${enrolledCourses.map(course => {
              const progress = getCourseProgress(course.id);
              const nextLesson = getNextLesson(course.id);
              const completedCount = (AppState.student.completedLessons[course.id] || []).length;
              const quizScore = AppState.student.quizScores?.[course.id];

              return `
                <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-4 mb-4">
                      <div class="flex items-center gap-3">
                        <img src="${course.thumbnail}" alt="${course.title}" class="w-16 h-16 rounded-2xl object-cover flex-shrink-0">
                        <div>
                          <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">${course.category}</span>
                          <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1">
                            <a href="#/course/${course.id}">${course.title}</a>
                          </h3>
                          <div class="text-xs text-slate-400 mt-0.5">${course.instructor.name}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mb-5">
                      <div class="flex justify-between items-center text-xs mb-1.5">
                        <span class="text-slate-500 dark:text-slate-400 font-medium">${completedCount} of ${course.totalLessons} lessons complete</span>
                        <span class="font-bold text-slate-900 dark:text-white">${progress}%</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <a href="#/learn/${course.id}/${nextLesson ? nextLesson.id : course.curriculum[0].lessons[0].id}" class="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-xs transition-colors">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      Continue Lesson
                    </a>
                    <a href="#/quiz/${course.id}" class="inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl text-xs transition-colors">
                      Take Quiz ${quizScore !== undefined ? `(${quizScore}%)` : ''}
                    </a>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <div class="text-4xl mb-3">🎓</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">You haven't enrolled in any courses yet</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Explore our catalog and find the perfect path to level up your career.</p>
            <a href="#/courses" class="mt-4 inline-block bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Browse Course Catalog
            </a>
          </div>
        `}
      </div>

    </div>
  `;
}


/* ========================================================
   PAGE 5: LEARNING CLASSROOM (Video Lesson Player)
   ======================================================== */
function renderLearningPage(container, courseId, lessonId) {
  const course = getCourseById(courseId);
  if (!course) {
    container.innerHTML = `<div class="p-10 text-center">Course not found.</div>`;
    return;
  }

  // Find target lesson or default to first
  let currentLesson = null;
  let currentSection = null;
  let allLessons = [];

  course.curriculum.forEach(section => {
    section.lessons.forEach(l => {
      allLessons.push({ lesson: l, sectionTitle: section.sectionTitle });
      if (l.id === lessonId) {
        currentLesson = l;
        currentSection = section;
      }
    });
  });

  if (!currentLesson && allLessons.length > 0) {
    currentLesson = allLessons[0].lesson;
    currentSection = course.curriculum[0];
  }

  const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1].lesson : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].lesson : null;

  const completedList = AppState.student?.completedLessons[course.id] || [];
  const isCompleted = completedList.includes(currentLesson.id);
  const studentNotes = AppState.student?.notes?.[currentLesson.id] || '';

  container.innerHTML = `
    <div class="bg-slate-950 text-white min-h-[calc(100vh-64px)]">
      
      <!-- Top Learning Toolbar -->
      <header class="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <a href="#/dashboard" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Back to Dashboard">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </a>
          <div>
            <div class="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">${course.title}</div>
            <h1 class="text-sm sm:text-base font-bold text-white line-clamp-1">${currentLesson.title}</h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a href="#/quiz/${course.id}" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 transition-colors">
            Take Course Quiz
          </a>
          <button id="toggleCompleteBtn" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isCompleted 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>${isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </header>

      <!-- Main Learning Workspace: Player + Curriculum Sidebar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left: Video Player & Tabs -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- Video Player -->
            <div class="video-responsive-container shadow-2xl border border-slate-800">
              <iframe 
                src="${currentLesson.videoUrl}?autoplay=0&rel=0&modestbranding=1" 
                title="${currentLesson.title}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>

            <!-- Previous / Next Controls -->
            <div class="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
              ${prevLesson ? `
                <a href="#/learn/${course.id}/${prevLesson.id}" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  Previous: ${prevLesson.title.substring(0, 24)}...
                </a>
              ` : `<div></div>`}

              ${nextLesson ? `
                <a href="#/learn/${course.id}/${nextLesson.id}" class="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Next: ${nextLesson.title.substring(0, 24)}...
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              ` : `
                <a href="#/quiz/${course.id}" class="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                  Ready for Final Quiz!
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              `}
            </div>

            <!-- Tabbed Lesson Information -->
            <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div class="flex border-b border-slate-800">
                <button class="lesson-tab-btn active px-6 py-3.5 text-xs font-semibold text-white border-b-2 border-indigo-500" data-tab="overview">
                  Lesson Overview
                </button>
                <button class="lesson-tab-btn px-6 py-3.5 text-xs font-semibold text-slate-400 hover:text-white" data-tab="notes">
                  My Notes (Auto-saved)
                </button>
                <button class="lesson-tab-btn px-6 py-3.5 text-xs font-semibold text-slate-400 hover:text-white" data-tab="resources">
                  Resources (${currentLesson.resources?.length || 0})
                </button>
              </div>

              <!-- Tab Contents -->
              <div class="p-6">
                <!-- Overview Tab -->
                <div id="tabOverview" class="lesson-tab-pane space-y-3">
                  <h3 class="font-bold text-base text-white">${currentLesson.title}</h3>
                  <p class="text-sm text-slate-300 leading-relaxed">${currentLesson.summary}</p>
                </div>

                <!-- Notes Tab -->
                <div id="tabNotes" class="lesson-tab-pane hidden space-y-3">
                  <div class="flex justify-between items-center text-xs text-slate-400">
                    <span>Personal notes for this lesson:</span>
                    <span id="noteSaveIndicator" class="text-emerald-400 opacity-0 transition-opacity">Saved ✓</span>
                  </div>
                  <textarea 
                    id="lessonNoteInput" 
                    placeholder="Take notes here... they will automatically persist to your account!" 
                    class="w-full h-40 p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono resize-none"
                  >${studentNotes}</textarea>
                </div>

                <!-- Resources Tab -->
                <div id="tabResources" class="lesson-tab-pane hidden space-y-3">
                  ${(currentLesson.resources && currentLesson.resources.length > 0) ? `
                    <div class="space-y-2">
                      ${currentLesson.resources.map(res => `
                        <a href="${res.url}" class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-colors text-xs text-indigo-400">
                          <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            ${res.name}
                          </span>
                          <span class="text-slate-500">Download</span>
                        </a>
                      `).join('')}
                    </div>
                  ` : `
                    <p class="text-xs text-slate-400">No additional resources attached for this lesson.</p>
                  `}
                </div>

              </div>
            </div>

          </div>

          <!-- Right: Course Curriculum Drawer -->
          <div class="lg:col-span-4">
            <div class="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 class="font-bold text-sm text-white">Course Curriculum</h3>
                <span class="text-xs text-indigo-400 font-semibold">${completedList.length} / ${course.totalLessons} Completed</span>
              </div>

              <!-- Sections List -->
              <div class="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                ${course.curriculum.map((section, sIdx) => `
                  <div>
                    <div class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      ${section.sectionTitle}
                    </div>
                    <div class="space-y-1.5">
                      ${section.lessons.map(l => {
                        const isThisActive = l.id === currentLesson.id;
                        const isThisCompleted = completedList.includes(l.id);

                        return `
                          <a 
                            href="#/learn/${course.id}/${l.id}" 
                            class="flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                              isThisActive 
                                ? 'bg-indigo-600 text-white font-semibold' 
                                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                            }"
                          >
                            <div class="flex items-center gap-2.5 line-clamp-1">
                              <span class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isThisCompleted 
                                  ? 'text-emerald-400 font-bold' 
                                  : 'text-slate-500'
                              }">
                                ${isThisCompleted ? '✓' : '○'}
                              </span>
                              <span class="line-clamp-1">${l.title}</span>
                            </div>
                            <span class="text-[11px] opacity-70 ml-2">${l.duration}</span>
                          </a>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Quiz Banner Shortcut -->
              <div class="pt-4 border-t border-slate-800">
                <a href="#/quiz/${course.id}" class="block text-center w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md">
                  📝 Take Course Quiz Assessment
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  // Attach mark complete listener
  const toggleBtn = document.getElementById('toggleCompleteBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleLessonComplete(course.id, currentLesson.id);
      renderLearningPage(container, courseId, lessonId);
    });
  }

  // Attach notes auto-save listener
  const noteInput = document.getElementById('lessonNoteInput');
  const noteIndicator = document.getElementById('noteSaveIndicator');
  if (noteInput) {
    let noteTimer = null;
    noteInput.addEventListener('input', () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        if (!AppState.student.notes) AppState.student.notes = {};
        AppState.student.notes[currentLesson.id] = noteInput.value;
        saveStudentState();
        if (noteIndicator) {
          noteIndicator.classList.remove('opacity-0');
          setTimeout(() => noteIndicator.classList.add('opacity-0'), 1500);
        }
      }, 600);
    });
  }

  // Tab switching logic
  const tabBtns = document.querySelectorAll('.lesson-tab-btn');
  const panes = {
    overview: document.getElementById('tabOverview'),
    notes: document.getElementById('tabNotes'),
    resources: document.getElementById('tabResources')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active', 'border-b-2', 'border-indigo-500', 'text-white');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'border-b-2', 'border-indigo-500', 'text-white');
      btn.classList.remove('text-slate-400');

      Object.values(panes).forEach(p => p?.classList.add('hidden'));
      panes[tab]?.classList.remove('hidden');
    });
  });
}


/* ========================================================
   PAGE 6: INTERACTIVE QUIZ PAGE
   ======================================================== */
function renderQuizPage(container, courseId) {
  const course = getCourseById(courseId);
  if (!course || !course.quiz) {
    container.innerHTML = `<div class="p-10 text-center">Quiz not available for this course.</div>`;
    return;
  }

  const quiz = course.quiz;
  // Local state for answers: { [questionId]: selectedOptionIndex }
  let userAnswers = {};
  let quizSubmitted = false;

  function renderQuizInterface() {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        
        <!-- Header -->
        <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 text-center">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            Official Course Assessment
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${quiz.title}</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Course: <strong>${course.title}</strong> • Passing Score: <strong>${quiz.passingScore}%</strong>
          </p>
        </div>

        <!-- Quiz Questions Form -->
        <form id="quizForm" class="space-y-6">
          ${quiz.questions.map((q, qIdx) => {
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctAnswer;

            return `
              <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border ${
                quizSubmitted 
                  ? (isCorrect ? 'border-emerald-500/80 bg-emerald-50/10' : 'border-rose-500/80 bg-rose-50/10')
                  : 'border-slate-200 dark:border-slate-700'
              } shadow-sm space-y-4">
                
                <div class="flex items-start justify-between gap-4">
                  <div class="font-bold text-slate-900 dark:text-white text-base">
                    <span class="text-indigo-600 dark:text-indigo-400 font-extrabold mr-2">Q${qIdx + 1}.</span>
                    ${q.question}
                  </div>
                  ${quizSubmitted ? `
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'}">
                      ${isCorrect ? 'Correct ✓' : 'Incorrect ✕'}
                    </span>
                  ` : ''}
                </div>

                <!-- Options -->
                <div class="space-y-2.5">
                  ${q.options.map((opt, optIdx) => {
                    let optionClass = "border-slate-200 dark:border-slate-700 hover:border-indigo-400";
                    if (quizSubmitted) {
                      if (optIdx === q.correctAnswer) {
                        optionClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                      } else if (selectedOpt === optIdx && !isCorrect) {
                        optionClass = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
                      }
                    } else if (selectedOpt === optIdx) {
                      optionClass = "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold";
                    }

                    return `
                      <label class="quiz-option flex items-center gap-3 p-3.5 rounded-2xl border text-sm cursor-pointer ${optionClass}">
                        <input 
                          type="radio" 
                          name="q_${q.id}" 
                          value="${optIdx}" 
                          ${selectedOpt === optIdx ? 'checked' : ''} 
                          ${quizSubmitted ? 'disabled' : ''}
                          class="text-indigo-600 focus:ring-indigo-500"
                        >
                        <span>${opt}</span>
                      </label>
                    `;
                  }).join('')}
                </div>

                <!-- Explanation (After submit) -->
                ${quizSubmitted ? `
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    <strong>Explanation:</strong> ${q.explanation}
                  </div>
                ` : ''}

              </div>
            `;
          }).join('')}

          <!-- Submit / Results Actions -->
          <div class="pt-4">
            ${!quizSubmitted ? `
              <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-indigo-600/30">
                Submit Quiz & Calculate Score
              </button>
            ` : `
              <div class="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4">
                <div class="text-4xl">
                  ${(AppState.student.quizScores?.[course.id] || 0) >= quiz.passingScore ? '🏆' : '📚'}
                </div>
                <h3 class="text-xl font-bold">
                  Score: ${AppState.student.quizScores?.[course.id] || 0}%
                </h3>
                <p class="text-xs text-slate-300 max-w-sm mx-auto">
                  ${(AppState.student.quizScores?.[course.id] || 0) >= quiz.passingScore 
                    ? "Congratulations! You passed this certification quiz. Your score has been recorded."
                    : "You didn't reach the passing score of 70%. Review the curriculum and retake the quiz anytime!"}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button type="button" id="retakeQuizBtn" class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-colors">
                    Retake Quiz
                  </button>
                  <a href="#/dashboard" class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors">
                    Return to Dashboard
                  </a>
                </div>
              </div>
            `}
          </div>

        </form>

      </div>
    `;

    // Attach question radio listeners
    quiz.questions.forEach(q => {
      const radios = document.querySelectorAll(`input[name="q_${q.id}"]`);
      radios.forEach(r => {
        r.addEventListener('change', () => {
          userAnswers[q.id] = parseInt(r.value);
        });
      });
    });

    // Attach form submission
    const form = document.getElementById('quizForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Calculate score
        let correctCount = 0;
        quiz.questions.forEach(q => {
          if (userAnswers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        });

        const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
        quizSubmitted = true;

        if (!AppState.student.quizScores) AppState.student.quizScores = {};
        AppState.student.quizScores[course.id] = scorePercent;
        saveStudentState();

        showToast(`Quiz completed! You scored ${scorePercent}%`, scorePercent >= quiz.passingScore ? 'success' : 'warning');
        renderQuizInterface();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Retake Quiz Button
    const retakeBtn = document.getElementById('retakeQuizBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        userAnswers = {};
        quizSubmitted = false;
        renderQuizInterface();
      });
    }
  }

  renderQuizInterface();
}


/* ========================================================
   AUTHENTICATION & PROFILE MODAL
   ======================================================== */
function setupAuthModal() {
  const modal = document.getElementById('authModal');
  const openBtn = document.getElementById('authModalBtn');
  const closeBtn = document.getElementById('closeAuthModalBtn');
  const form = document.getElementById('authForm');
  const switchDemoBtn = document.getElementById('switchDemoUserBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('authNameInput').value.trim();
      const email = document.getElementById('authEmailInput').value.trim();
      if (!name || !email) return;

      AppState.student.name = name;
      AppState.student.email = email;
      saveStudentState();
      updateNavbarProfile();
      closeModal();
      showToast(`Welcome, ${name}!`, 'success');
      handleRoute();
    });
  }

  if (switchDemoBtn) {
    switchDemoBtn.addEventListener('click', () => {
      AppState.student = { ...INITIAL_STUDENT };
      saveStudentState();
      updateNavbarProfile();
      closeModal();
      showToast("Reset to Demo Student Profile", "info");
      handleRoute();
    });
  }
}

function updateNavbarProfile() {
  const profileAvatar = document.getElementById('navProfileAvatar');
  const profileName = document.getElementById('navProfileName');
  if (profileAvatar && AppState.student) {
    profileAvatar.src = AppState.student.avatar;
  }
  if (profileName && AppState.student) {
    profileName.textContent = AppState.student.name;
  }
}


/* ========================================================
   GLOBAL APP BOOTSTRAP
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupAuthModal();
  updateNavbarProfile();

  // Theme toggle listener
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = AppState.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Mobile menu drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
    });
    // Close drawer when any nav link is tapped
    mobileMenuDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenuDrawer.classList.add('hidden'));
    });
  }

  // Router listeners
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
});
