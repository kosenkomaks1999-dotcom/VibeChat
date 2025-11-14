# Whiteboard Auto-Clean: Final Solution

## ✅ Простое решение

Whiteboard имеет метод `clearWhiteboardIfEmpty()` который нужно вызвать вручную из вашего кода.

---

## 💻 Как использовать

### Найдите в вашем app.js где отслеживаются пользователи комнаты

Добавьте вызов метода когда `userCount === 0`:

```javascript
// Пример: где-то в вашем app.js

// Если у вас есть слушатель пользователей:
roomRef.child('users').on('value', (snapshot) => {
  const users = snapshot.val();
  const userCount = users ? Object.keys(users).length : 0;
  
  // Очищаем доску если комната пуста
  if (userCount === 0 && whiteboard) {
    whiteboard.clearWhiteboardIfEmpty();
  }
});
```

---

## 🔍 Где найти код отслеживания пользователей

Поищите в вашем `app.js`:

1. **Поиск по ключевым словам:**
   - `users`
   - `participants`
   - `members`
   - `roomRef.child`
   - `.on('value'`

2. **Типичные места:**
   - Функция входа в комнату (`joinRoom`)
   - Функция выхода из комнаты (`leaveRoom`)
   - Обработчик изменений пользователей

---

## 📝 Примеры интеграции

### Вариант 1: В слушателе пользователей

```javascript
// Где-то в app.js
const usersRef = roomRef.child('users');

usersRef.on('value', (snapshot) => {
  const users = snapshot.val() || {};
  const userCount = Object.keys(users).length;
  
  console.log(`Users in room: ${userCount}`);
  
  // Очищаем доску если пусто
  if (userCount === 0 && whiteboard) {
    whiteboard.clearWhiteboardIfEmpty();
  }
});
```

---

### Вариант 2: При выходе из комнаты

```javascript
function leaveRoom() {
  // Удаляем себя
  roomRef.child(`users/${myUserId}`).remove();
  
  // Проверяем остались ли еще пользователи
  roomRef.child('users').once('value', (snapshot) => {
    const userCount = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
    
    if (userCount === 0 && whiteboard) {
      whiteboard.clearWhiteboardIfEmpty();
    }
  });
}
```

---

### Вариант 3: С onDisconnect

```javascript
// При входе в комнату
const userRef = roomRef.child(`users/${myUserId}`);

userRef.set({
  nickname: myNickname,
  online: true
});

// Автоудаление при отключении
userRef.onDisconnect().remove();

// Слушаем изменения
roomRef.child('users').on('value', (snapshot) => {
  const userCount = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
  
  if (userCount === 0 && whiteboard) {
    whiteboard.clearWhiteboardIfEmpty();
  }
});
```

---

## 🎯 Что делает метод

```javascript
clearWhiteboardIfEmpty() {
  // 1. Очищает локальный массив штрихов
  this.strokes = [];
  
  // 2. Очищает canvas
  this.drawingEngine.clearCanvas();
  
  // 3. Удаляет все штрихи из Firebase
  strokesRef.remove();
}
```

---

## 🧪 Проверка работы

**После интеграции:**

1. Откройте whiteboard
2. Нарисуйте штрихи
3. Все пользователи выходят из комнаты
4. В консоли должно появиться:
   ```
   Users in room: 0
   Clearing whiteboard (room is empty)
   Whiteboard cleared successfully
   ```
5. При входе обратно - доска пустая ✅

---

## ❓ Если не работает

### Проверьте:

1. **Правильный ли путь к пользователям?**
   ```javascript
   // Попробуйте разные варианты:
   roomRef.child('users')
   roomRef.child('participants')
   roomRef.child('members')
   ```

2. **Существует ли переменная `whiteboard`?**
   ```javascript
   console.log('Whiteboard exists:', !!whiteboard);
   ```

3. **Вызывается ли ваш код?**
   ```javascript
   if (userCount === 0) {
     console.log('Room is empty, calling clearWhiteboardIfEmpty');
     if (whiteboard) {
       whiteboard.clearWhiteboardIfEmpty();
     } else {
       console.error('Whiteboard is not defined!');
     }
   }
   ```

---

## 📊 Структура Firebase

Убедитесь что у вас есть:

```
rooms/
  {roomId}/
    users/              ← Этот путь должен существовать
      {userId}/
        nickname: "..."
        online: true
    whiteboard/
      strokes/
        ...
```

---

## ✅ Итог

1. Метод `clearWhiteboardIfEmpty()` готов ✅
2. Нужно добавить вызов в ваш код ✅
3. Вызывайте когда `userCount === 0` ✅

**Это самое простое и надежное решение!** 🎉
