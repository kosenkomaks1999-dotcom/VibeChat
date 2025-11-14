# Исправление дублирования обработчиков событий

## Проблема
При переходе между комнатами рисовалось ДВА штриха одновременно с разными настройками:
- Один с настройками из предыдущей комнаты (розовый, размер 30)
- Второй с текущими настройками (голубой, размер 13)

## Причина
Метод `removeEventHandlers()` в классе `DrawingEngine` был **пустым**:
```javascript
removeEventHandlers() {
  // Создаем новые функции для удаления, так как мы использовали стрелочные функции
  // В реальности нужно сохранять ссылки на функции, но для простоты просто пересоздадим canvas
}
```

Это приводило к тому, что:
1. Создавался новый `WhiteboardManager` для комнаты Б
2. Создавался новый `DrawingEngine` для комнаты Б
3. Новые обработчики добавлялись к canvas
4. **НО старые обработчики НЕ удалялись!**
5. Canvas слушал события от ОБОИХ DrawingEngine одновременно

## Решение

### 1. Сохранение ссылок на обработчики
Добавлено поле `handlers` в конструктор `DrawingEngine`:
```javascript
this.handlers = {
  mousedown: null,
  mousemove: null,
  mouseup: null,
  mouseleave: null,
  touchstart: null,
  touchmove: null,
  touchend: null,
  touchcancel: null
};
```

### 2. Правильное добавление обработчиков
```javascript
setupEventHandlers() {
  // Сначала удаляем старые
  this.removeEventHandlers();
  
  // Создаем и сохраняем обработчики
  this.handlers.mousedown = (e) => this.onMouseDown(e);
  this.handlers.mousemove = (e) => this.onMouseMove(e);
  // ... и т.д.
  
  // Добавляем к canvas
  this.canvas.addEventListener('mousedown', this.handlers.mousedown);
  this.canvas.addEventListener('mousemove', this.handlers.mousemove);
  // ... и т.д.
}
```

### 3. Правильное удаление обработчиков
```javascript
removeEventHandlers() {
  if (!this.canvas) return;
  
  if (this.handlers.mousedown) {
    // Удаляем все обработчики
    this.canvas.removeEventListener('mousedown', this.handlers.mousedown);
    this.canvas.removeEventListener('mousemove', this.handlers.mousemove);
    // ... и т.д.
  }
  
  // Очищаем ссылки
  this.handlers = { ... };
}
```

## Логи

Теперь в консоли вы увидите:
```
[DrawingEngine] Event handlers attached
[DrawingEngine] Event handlers removed
```

## Тестирование

1. **Войдите в комнату А**
2. **Откройте whiteboard**
3. **Выберите розовый цвет, размер 30**
4. **Нарисуйте линию** - смотрите лог:
   ```
   [startStroke] Starting new stroke with settings: {tool: 'marker', color: '#FF00FF', size: 30}
   ```
5. **Закройте whiteboard**
6. **Выйдите из комнаты А**
7. **Войдите в комнату Б**
8. **Откройте whiteboard** - смотрите логи:
   ```
   [DrawingEngine] Event handlers removed
   [DrawingEngine] Event handlers attached
   ```
9. **Выберите голубой цвет, размер 13**
10. **Нарисуйте линию** - смотрите лог:
    ```
    [startStroke] Starting new stroke with settings: {tool: 'marker', color: '#00FFFF', size: 13}
    ```
11. **Результат:** Только ОДИН лог `[startStroke]`, рисуется только голубая линия!

## До исправления
```
[startStroke] Starting new stroke with settings: {tool: 'marker', color: '#FF00FF', size: 30}
[startStroke] Starting new stroke with settings: {tool: 'marker', color: '#00FFFF', size: 13}
```
Два штриха одновременно!

## После исправления
```
[startStroke] Starting new stroke with settings: {tool: 'marker', color: '#00FFFF', size: 13}
```
Только один штрих с правильными настройками!

## Важно
Эта проблема возникала потому что:
- Canvas - это DOM элемент, который существует постоянно
- Обработчики событий накапливаются если их не удалять
- Каждый новый DrawingEngine добавлял свои обработчики
- Все обработчики срабатывали одновременно при рисовании
