# Следующий тест с детальными логами

## Что добавлено

1. **Детали загруженных штрихов** - теперь видно:
   - ID штриха
   - Инструмент (marker/eraser)
   - Цвет
   - Количество точек
   - Кто нарисовал (userId, nickname)
   - Когда нарисовано (timestamp)

2. **Логирование входа в комнату** - видно когда меняется roomRef

## Сценарий теста

### Шаг 1: Очистите Firebase (опционально)
Если хотите начать с чистого листа:
1. Откройте Firebase Console
2. Перейдите в Realtime Database
3. Найдите `rooms/XSWNBhbO/whiteboard/strokes`
4. Удалите все данные

### Шаг 2: Тест с двумя комнатами

1. **Запустите приложение** (`npm start`)
2. **Войдите в комнату А** (например, "test-a")
   - Смотрите лог: `[JOIN ROOM] Setting roomRef to: test-a`
3. **Откройте whiteboard**
   - Смотрите логи загрузки
4. **Нарисуйте треугольник**
5. **Закройте whiteboard**
6. **Выйдите из комнаты А**
7. **Войдите в комнату Б** (например, "test-b")
   - Смотрите лог: `[JOIN ROOM] Setting roomRef to: test-b`
8. **Откройте whiteboard**
   - Смотрите логи:
     ```
     [Whiteboard Button] Opening whiteboard. Current roomRef.key: test-b
     [Whiteboard Button] Existing whiteboard roomId: test-a
     [Whiteboard] Room changed from test-a to test-b, destroying old whiteboard
     [loadExistingStrokes] Loading strokes for room: test-b
     ```
9. **Проверьте что показывают логи:**
   - Если `Loaded 0 strokes` - отлично, комната пустая
   - Если `Loaded X strokes` - смотрите детали штрихов

## Что проверить в логах

### Если видите штрихи в комнате Б:

Смотрите детали штриха:
```
Stroke 1: {
  id: "stroke_...",
  tool: "marker",
  color: "#000000",
  points: 50,
  userId: "...",
  nickname: "...",
  timestamp: "..."
}
```

**Вопросы:**
1. Это тот же штрих что вы нарисовали в комнате А?
2. userId совпадает с вашим?
3. Timestamp показывает когда вы рисовали в комнате А?

### Возможные причины:

1. **Вы используете один и тот же roomId**
   - Проверьте логи `[JOIN ROOM]`
   - Если оба раза `test-a` - вы не сменили комнату!

2. **Firebase хранит данные глобально**
   - Маловероятно, но проверьте структуру в Firebase Console

3. **Старые данные не удалились**
   - Возможно данные остались с предыдущих тестов

## Отправьте полные логи

Скопируйте ВСЕ логи от момента входа в комнату А до открытия whiteboard в комнате Б.
