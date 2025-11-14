# Тестирование с логами

## Шаги для воспроизведения проблемы

1. **Откройте приложение**
2. **Откройте консоль браузера** (F12 → Console)
3. **Войдите в комнату А** (например, "test-room-a")
4. **Откройте whiteboard** - смотрите логи:
   ```
   [Whiteboard Button] Opening whiteboard. Current roomRef.key: test-room-a
   [Whiteboard Button] Existing whiteboard roomId: none
   [Whiteboard] Creating new whiteboard for room: test-room-a
   [open] Opening whiteboard for room: test-room-a
   [open] Clearing canvas
   [open] Local data cleared
   [open] Loading existing strokes...
   [loadExistingStrokes] Loading strokes for room: test-room-a
   [loadExistingStrokes] No strokes found for room test-room-a
   [open] Starting listeners...
   [open] Whiteboard opened successfully
   ```

5. **Нарисуйте треугольник**

6. **Закройте whiteboard**

7. **Выйдите из комнаты А**

8. **Войдите в комнату Б** (например, "test-room-b")

9. **Откройте whiteboard** - смотрите логи:
   ```
   [Whiteboard Button] Opening whiteboard. Current roomRef.key: test-room-b
   [Whiteboard Button] Existing whiteboard roomId: test-room-a
   [Whiteboard] Room changed from test-room-a to test-room-b, destroying old whiteboard
   [Whiteboard] Old whiteboard destroyed completely
   [Whiteboard] Creating new whiteboard for room: test-room-b
   [open] Opening whiteboard for room: test-room-b
   [open] Clearing canvas
   [open] Local data cleared
   [open] Loading existing strokes...
   [loadExistingStrokes] Loading strokes for room: test-room-b
   [loadExistingStrokes] No strokes found for room test-room-b
   [open] Starting listeners...
   [open] Whiteboard opened successfully
   ```

10. **Проверьте canvas** - должен быть ПУСТЫМ!

## Что проверить

### Если треугольник все еще виден:

1. **Проверьте roomRef.key в логах:**
   - Должен быть `test-room-b`, а не `test-room-a`

2. **Проверьте что загружается:**
   - Должно быть "No strokes found" или "Loaded 0 strokes"
   - Если "Loaded X strokes" где X > 0, значит в Firebase есть данные

3. **Проверьте Firebase Console:**
   - Откройте Firebase Console
   - Перейдите в Realtime Database
   - Проверьте структуру: `rooms/test-room-b/whiteboard/strokes`
   - Должно быть пусто или не существовать

### Если roomRef.key неправильный:

Проблема в том, что `roomRef` не обновляется при смене комнаты.
Проверьте логи при входе в комнату Б - должно быть что-то вроде:
```
Joining room: test-room-b
```

### Если данные загружаются из Firebase:

Проблема в том, что данные из комнаты А каким-то образом попали в комнату Б.
Это может произойти если:
- Вы использовали один и тот же roomId
- Firebase Rules позволяют читать данные из других комнат
- Есть баг в коде который копирует данные между комнатами

## Отправьте логи

Если проблема сохраняется, скопируйте ВСЕ логи из консоли и отправьте их.
