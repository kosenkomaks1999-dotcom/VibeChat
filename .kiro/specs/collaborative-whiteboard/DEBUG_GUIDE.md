# Руководство по отладке проблемы синхронизации

## Проблема
Рисунки из комнаты А появляются в комнате Б при переходе между комнатами.

## Добавленное логирование

Теперь в консоли браузера вы увидите детальные логи:

### При открытии whiteboard:
```
[open] Opening whiteboard for room: <roomId>
[open] Clearing canvas
[open] Local data cleared
[open] Loading existing strokes...
[loadExistingStrokes] Loading strokes for room: <roomId>
[loadExistingStrokes] Loaded X strokes for room <roomId>
[loadExistingStrokes] Drawing X strokes on canvas
[open] Starting listeners...
[open] Whiteboard opened successfully
```

### При смене комнаты:
```
[Whiteboard] Room changed from <oldRoomId> to <newRoomId>, destroying old whiteboard
[Whiteboard] Old whiteboard destroyed completely
[Whiteboard] Creating new whiteboard for room: <newRoomId>
```

## Как тестировать

1. **Откройте консоль браузера** (F12)
2. **Войдите в комнату А**
3. **Откройте whiteboard** - смотрите логи
4. **Нарисуйте треугольник**
5. **Закройте whiteboard**
6. **Выйдите из комнаты А**
7. **Войдите в комнату Б**
8. **Откройте whiteboard** - смотрите логи:
   - Должно быть: `[loadExistingStrokes] No strokes found for room <roomB>`
   - Или: `[loadExistingStrokes] Loaded 0 strokes for room <roomB>`
9. **Проверьте canvas** - должен быть пустым

## Что проверить в логах

1. **roomId правильный?**
   - При открытии whiteboard в комнате Б, roomId должен быть ID комнаты Б

2. **Загружаются ли штрихи?**
   - Если видите "Loaded X strokes" где X > 0, значит в Firebase есть данные для этой комнаты

3. **Срабатывает ли уничтожение?**
   - При переходе между комнатами должно быть "Room changed from ... to ..."

## Возможные причины

1. **Firebase хранит данные глобально**
   - Проверьте структуру данных в Firebase Console
   - Путь должен быть: `rooms/<roomId>/whiteboard/strokes`

2. **roomRef указывает на неправильную комнату**
   - Проверьте что roomRef.key соответствует текущей комнате

3. **Старые слушатели не останавливаются**
   - Проверьте что stopListening() вызывается

## Следующие шаги

Если проблема сохраняется, отправьте логи из консоли:
- Весь вывод от момента входа в комнату А до открытия whiteboard в комнате Б
