# Финальная архитектура Whiteboard

## Принцип: "Нет комнаты - нет доски"

Whiteboard теперь работает по принципу **полной изоляции комнат**:

### 1. Создание Whiteboard
- Whiteboard создается **ТОЛЬКО** когда пользователь нажимает кнопку "Открыть доску"
- **ВСЕГДА** создается НОВЫЙ экземпляр WhiteboardManager
- Старый экземпляр (если был) **ПОЛНОСТЬЮ уничтожается** перед созданием нового

### 2. Привязка к комнате
- Каждый WhiteboardManager привязан к конкретной комнате через `roomRef`
- `roomId` сохраняется в конструкторе: `this.roomId = roomRef.key`
- Все данные хранятся в Firebase по пути: `rooms/{roomId}/whiteboard/strokes`

### 3. Уничтожение Whiteboard

#### При выходе из комнаты:
```javascript
if (whiteboard) {
  // Закрываем модальное окно
  if (whiteboard.isOpen) {
    whiteboard.close();
  }
  
  // Останавливаем слушатели Firebase
  whiteboard.stopListening();
  
  // Очищаем canvas
  whiteboard.context.clearRect(...)
  
  // Очищаем все данные
  whiteboard.strokes = [];
  whiteboard.offlineBuffer = [];
  whiteboard.pointsBuffer = [];
  
  // Уничтожаем ссылку
  whiteboard = null;
}
```

#### При открытии доски:
- Если существует старый whiteboard - уничтожается
- Создается НОВЫЙ whiteboard для текущей комнаты

### 4. Автоочистка данных

#### При входе в пустую комнату:
```javascript
if (userCount === 1) {
  // Очищаем старые данные доски
  roomRef.child('whiteboard/strokes').remove();
}
```

Это происходит:
- При создании новой комнаты
- При входе в существующую комнату

### 5. Изоляция данных

**Каждая комната имеет:**
- Свой путь в Firebase: `rooms/{roomId}/whiteboard/strokes`
- Свой экземпляр WhiteboardManager
- Свои штрихи (strokes)
- Свои слушатели Firebase

**Между комнатами:**
- НЕТ общих данных
- НЕТ общих слушателей
- НЕТ переноса штрихов
- НЕТ кэширования canvas

## Жизненный цикл

```
Пользователь НЕ в комнате
  ↓
  whiteboard = null
  ↓
Пользователь входит в комнату А
  ↓
  whiteboard = null (еще не создан)
  ↓
Пользователь нажимает "Открыть доску"
  ↓
  whiteboard = new WhiteboardManager(roomRefA, ...)
  ↓
  whiteboard.open()
  ↓
  Загружаются данные из rooms/roomA/whiteboard/strokes
  ↓
Пользователь рисует
  ↓
  Данные сохраняются в rooms/roomA/whiteboard/strokes
  ↓
Пользователь закрывает доску
  ↓
  whiteboard.close() (но объект еще существует)
  ↓
Пользователь выходит из комнаты А
  ↓
  whiteboard.stopListening()
  whiteboard = null
  ↓
Пользователь входит в комнату Б
  ↓
  whiteboard = null
  ↓
Пользователь нажимает "Открыть доску"
  ↓
  whiteboard = new WhiteboardManager(roomRefB, ...)
  ↓
  whiteboard.open()
  ↓
  Загружаются данные из rooms/roomB/whiteboard/strokes
  ↓
  НИКАКИХ данных из комнаты А!
```

## Гарантии

1. **Изоляция:** Данные одной комнаты НИКОГДА не попадут в другую
2. **Очистка:** При выходе из комнаты все данные в памяти удаляются
3. **Автоочистка:** Пустые комнаты автоматически очищаются от старых данных
4. **Новый старт:** Каждое открытие доски = новый экземпляр WhiteboardManager

## Логи для отладки

```
[Whiteboard Button] Opening whiteboard. Current roomRef.key: {roomId}
[Whiteboard Button] Existing whiteboard: YES/NO
[Whiteboard] Destroying existing whiteboard before creating new one
[Whiteboard] Old whiteboard destroyed completely
[Whiteboard] Creating NEW whiteboard for room: {roomId}
[open] Opening whiteboard for room: {roomId}
[open] Clearing canvas
[open] Local data cleared
[loadExistingStrokes] Loading strokes for room: {roomId}
[loadExistingStrokes] Loaded X strokes for room {roomId}
[AUTO-CLEAR] Room was empty, clearing old whiteboard data
```
