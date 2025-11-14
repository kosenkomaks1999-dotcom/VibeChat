# Requirements Document

## Introduction

Collaborative Whiteboard - это функция для совместного рисования в реальном времени в голосовых комнатах VibeChat. Участники комнаты могут открыть общую доску, рисовать на ней одновременно, и все изменения синхронизируются в реальном времени через Firebase Realtime Database.

## Glossary

- **Whiteboard System**: Система совместного рисования на общей доске
- **Canvas**: HTML5 элемент для отрисовки графики
- **Stroke**: Один непрерывный штрих (линия), нарисованный пользователем
- **Tool**: Инструмент рисования (карандаш, маркер, ластик)
- **Firebase Realtime Database**: База данных для синхронизации данных в реальном времени
- **Room Participant**: Участник голосовой комнаты

## Requirements

### Requirement 1

**User Story:** Как участник комнаты, я хочу открыть общую доску для рисования, чтобы визуально объяснять идеи другим участникам

#### Acceptance Criteria

1. WHEN Room Participant нажимает кнопку "Открыть доску", THE Whiteboard System SHALL отобразить модальное окно с Canvas размером 800x600 пикселей
2. THE Whiteboard System SHALL показывать доску поверх основного интерфейса с возможностью закрытия
3. WHEN Whiteboard System открывается, THE Whiteboard System SHALL загрузить все существующие штрихи из Firebase Realtime Database
4. THE Whiteboard System SHALL отображать никнеймы участников, которые сейчас рисуют

### Requirement 2

**User Story:** Как участник комнаты, я хочу рисовать на доске разными инструментами, чтобы создавать понятные визуальные объяснения

#### Acceptance Criteria

1. THE Whiteboard System SHALL предоставить инструмент "Карандаш" с толщиной линии от 1 до 10 пикселей
2. THE Whiteboard System SHALL предоставить инструмент "Маркер" с толщиной линии от 10 до 30 пикселей
3. THE Whiteboard System SHALL предоставить инструмент "Ластик" с размером от 10 до 50 пикселей
4. THE Whiteboard System SHALL предоставить палитру из 12 базовых цветов для выбора
5. WHEN Room Participant выбирает инструмент, THE Whiteboard System SHALL визуально выделить выбранный инструмент

### Requirement 3

**User Story:** Как участник комнаты, я хочу видеть рисунки других участников в реальном времени, чтобы следить за их объяснениями

#### Acceptance Criteria

1. WHEN Room Participant рисует штрих, THE Whiteboard System SHALL отправить координаты штриха в Firebase Realtime Database в течение 100 миллисекунд
2. WHEN новый штрих появляется в Firebase Realtime Database, THE Whiteboard System SHALL отрисовать его на Canvas всех участников в течение 200 миллисекунд
3. THE Whiteboard System SHALL группировать точки штриха в пакеты по 5-10 точек для оптимизации трафика
4. THE Whiteboard System SHALL отображать курсор другого участника с его никнеймом во время рисования

### Requirement 4

**User Story:** Как участник комнаты, я хочу очистить доску, чтобы начать новый рисунок

#### Acceptance Criteria

1. THE Whiteboard System SHALL предоставить кнопку "Очистить доску"
2. WHEN Room Participant нажимает "Очистить доску", THE Whiteboard System SHALL показать диалог подтверждения
3. WHEN Room Participant подтверждает очистку, THE Whiteboard System SHALL удалить все штрихи из Firebase Realtime Database
4. WHEN штрихи удалены из Firebase Realtime Database, THE Whiteboard System SHALL очистить Canvas у всех участников в течение 500 миллисекунд

### Requirement 5

**User Story:** Как участник комнаты, я хочу сохранить рисунок как картинку, чтобы использовать его позже

#### Acceptance Criteria

1. THE Whiteboard System SHALL предоставить кнопку "Сохранить как PNG"
2. WHEN Room Participant нажимает "Сохранить как PNG", THE Whiteboard System SHALL конвертировать Canvas в PNG формат
3. THE Whiteboard System SHALL автоматически скачать PNG файл с именем "whiteboard-YYYY-MM-DD-HH-MM.png"
4. THE Whiteboard System SHALL сохранять изображение с белым фоном размером 800x600 пикселей

### Requirement 6

**User Story:** Как участник комнаты, я хочу чтобы доска автоматически очищалась при выходе всех участников, чтобы не занимать место в базе данных

#### Acceptance Criteria

1. WHEN последний участник покидает комнату, THE Whiteboard System SHALL удалить все штрихи доски из Firebase Realtime Database в течение 5 секунд
2. THE Whiteboard System SHALL хранить максимум 1000 штрихов на одну доску
3. WHEN количество штрихов превышает 1000, THE Whiteboard System SHALL удалить самые старые штрихи
4. THE Whiteboard System SHALL использовать не более 500 КБ данных на одну доску

### Requirement 7

**User Story:** Как участник комнаты, я хочу чтобы доска работала плавно, чтобы рисование было комфортным

#### Acceptance Criteria

1. THE Whiteboard System SHALL отрисовывать штрихи со скоростью не менее 30 кадров в секунду
2. THE Whiteboard System SHALL реагировать на движение мыши с задержкой не более 16 миллисекунд
3. THE Whiteboard System SHALL оптимизировать отрисовку используя requestAnimationFrame
4. WHEN Canvas содержит более 500 штрихов, THE Whiteboard System SHALL использовать оптимизацию отрисовки для поддержания производительности
