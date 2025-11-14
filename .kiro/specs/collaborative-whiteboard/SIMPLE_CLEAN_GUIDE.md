# Whiteboard Auto-Clean: Simple Guide

## 🎯 Один простой метод

Доска очищается когда в комнате **0 пользователей**.

---

## 📝 Как использовать

### Метод: `cleanWhiteboardIfRoomEmpty()`

Вызывайте этот метод когда количество пользователей в комнате становится 0.

---

## 💻 Пример интеграции

### Вариант 1: В вашем коде отслеживания пользователей

```javascript
// Где-то в вашем app.js или room manager

// Слушаем изменения пользователей
roomRef.child('users').on('value', (snapshot) => {
  const users = snapshot.val();
  const userCount = users ? Object.keys(users).length : 0;
  
  console.log(`Users in room: ${userCount}`);
  
  // Если комната пуста - очищаем доску
  if (userCount === 0 && whiteboardManager) {
    whiteboardManager.cleanWhiteboardIfRoomEmpty();
  }
});
```

---

### Вариант 2: При выходе из комнаты

```javascript
function leaveRoom() {
  // Удаляем себя из комнаты
  roomRef.child(`users/${myUserId}`).remove();
  
  // Проверяем, остались ли еще пользователи
  roomRef.child('users').once('value', (snapshot) => {
    const users = snapshot.val();
    const userCount = users ? Object.keys(users).length : 0;
    
    if (userCount === 0 && whiteboardManager) {
      whiteboardManager.cleanWhiteboardIfRoomEmpty();
    }
  });
}
```

---

### Вариант 3: С onDisconnect (рекомендуется)

```javascript
// При входе в комнату
const userRef = roomRef.child(`users/${myUserId}`);

userRef.set({
  nickname: myNickname,
  online: true,
  timestamp: Date.now()
});

// Автоматически удалить при отключении
userRef.onDisconnect().remove();

// Слушаем изменения
roomRef.child('users').on('value', (snapshot) => {
  const userCount = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
  
  if (userCount === 0 && whiteboardManager) {
    whiteboardManager.cleanWhiteboardIfRoomEmpty();
  }
});
```

---

## ✅ Что делает метод

1. Очищает локальный массив штрихов
2. Очищает canvas
3. Удаляет все штрихи из Firebase

---

## 🧪 Тестирование

**Шаги:**
1. Откройте whiteboard
2. Нарисуйте штрихи
3. Все пользователи покидают комнату
4. Метод вызывается автоматически
5. Доска очищается

**Ожидаемый результат:**
- В консоли: "Cleaning whiteboard (room is empty)"
- Доска полностью очищена
- Firebase не содержит штрихов

---

## 📊 Структура Firebase

```
rooms/
  {roomId}/
    users/
      {userId}/
        nickname: "John"
        online: true
    whiteboard/
      strokes/
        {strokeId}/
          ...
```

---

## ✅ Готово!

Просто вызывайте `cleanWhiteboardIfRoomEmpty()` когда `userCount === 0` 🎉
