// Firebase Configuration Example
// ИНСТРУКЦИЯ:
// 1. Скопируйте этот файл как firebase.config.js
// 2. Замените значения на ваши реальные данные из Firebase Console
// 3. НЕ коммитьте firebase.config.js в Git!

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
} else {
  // Для использования в браузере/Electron
  window.firebaseConfig = firebaseConfig;
}
