# Firebase Database Rules для Whiteboard

## Проблема
Ошибка `PERMISSION_DENIED` при попытке сохранить штрихи на доске.

## Решение
Нужно добавить правила в Firebase Realtime Database.

## Как настроить

1. **Откройте Firebase Console:**
   - https://console.firebase.google.com/

2. **Выберите ваш проект**

3. **Перейдите в Realtime Database:**
   - В левом меню: Build → Realtime Database
   - Вкладка "Rules"

4. **Добавьте правила для whiteboard:**

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        
        "users": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        
        "signals": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        
        "whiteboard": {
          ".read": "auth != null",
          ".write": "auth != null",
          
          "strokes": {
            ".read": "auth != null",
            ".write": "auth != null",
            
            "$strokeId": {
              ".read": "auth != null",
              ".write": "auth != null",
              ".validate": "newData.hasChildren(['id', 'tool', 'color', 'size', 'points', 'userId', 'timestamp'])"
            }
          }
        }
      }
    },
    
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

5. **Нажмите "Publish"**

## Объяснение правил

### Базовые правила:
- `"auth != null"` - доступ только для авторизованных пользователей
- Применяется ко всем операциям чтения и записи

### Whiteboard правила:
- `rooms/$roomId/whiteboard/strokes` - путь к штрихам
- Каждый штрих должен иметь обязательные поля:
  - `id` - уникальный идентификатор
  - `tool` - инструмент (marker/eraser)
  - `color` - цвет в hex формате
  - `size` - размер кисти
  - `points` - массив точек
  - `userId` - ID пользователя
  - `timestamp` - время создания

## Альтернативные правила (более строгие)

Если хотите ограничить доступ только для участников комнаты:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        "whiteboard": {
          "strokes": {
            ".read": "auth != null && root.child('rooms').child($roomId).child('users').child(auth.uid).exists()",
            ".write": "auth != null && root.child('rooms').child($roomId).child('users').child(auth.uid).exists()",
            
            "$strokeId": {
              ".validate": "newData.hasChildren(['id', 'tool', 'color', 'size', 'points', 'userId', 'timestamp']) && newData.child('userId').val() == auth.uid"
            }
          }
        }
      }
    }
  }
}
```

Это проверяет что:
1. Пользователь авторизован
2. Пользователь находится в комнате (есть в `rooms/$roomId/users`)
3. userId в штрихе совпадает с текущим пользователем

## Проверка

После настройки правил:
1. Перезапустите приложение
2. Войдите в комнату
3. Откройте whiteboard
4. Попробуйте нарисовать
5. Проверьте консоль - не должно быть ошибок `PERMISSION_DENIED`

## Отладка

Если ошибка сохраняется:
1. Проверьте что пользователь авторизован: `auth != null`
2. Проверьте путь в Firebase Console: `rooms/{roomId}/whiteboard/strokes`
3. Проверьте что правила опубликованы (кнопка "Publish")
4. Подождите 1-2 минуты для применения правил
