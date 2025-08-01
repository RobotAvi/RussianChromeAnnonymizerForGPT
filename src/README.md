# 📁 Исходный код расширения

Эта папка содержит все файлы, необходимые для работы Chrome расширения.

## 📄 Файлы

### `manifest.json`
**Конфигурация расширения**
- Определяет метаданные расширения
- Настраивает разрешения и API
- Указывает точки входа (service worker, popup)

### `service_worker.js`
**Основная логика анонимизации**
- Содержит все паттерны для отлавливания PII
- Реализует функции анонимизации и деанонимизации
- Обрабатывает сообщения от popup окна
- Управляет хранением данных в chrome.storage

### `popup.html`
**Интерфейс пользователя**
- HTML разметка для popup окна
- Содержит кнопки и поля для взаимодействия
- Отображает статус операций

### `popup.js`
**Логика интерфейса**
- Обрабатывает клики по кнопкам
- Читает и записывает в буфер обмена
- Отправляет команды в service worker
- Обновляет UI в реальном времени

### `icons/`
**Иконки расширения**
- `anon16.png` - 16x16 пикселей
- `anon32.png` - 32x32 пикселей  
- `anon48.png` - 48x48 пикселей
- `anon128.png` - 128x128 пикселей

## 🏗️ Архитектура

```
popup.html + popup.js
       ↓
   chrome.runtime.sendMessage
       ↓
service_worker.js
       ↓
   chrome.storage.local
```

## ⚙️ Основные функции

### 🔒 Анонимизация
1. Получение текста из буфера обмена
2. Применение паттернов для поиска PII
3. Замена найденных данных на маркеры
4. Сохранение соответствий в storage
5. Возврат анонимизированного текста

### 🔓 Деанонимизация
1. Получение анонимизированного текста
2. Загрузка соответствий из storage
3. Замена маркеров на оригинальные данные
4. Возврат восстановленного текста

## 🎯 Паттерны

Расширение поддерживает следующие типы данных:

- **ADDRESS** - российские адреса
- **FIO** - полные имена
- **PHONE** - номера телефонов
- **EMAIL** - электронные адреса
- **SNILS** - номера СНИЛС
- **INN** - ИНН физических и юридических лиц
- **PASSPORT_SERIES** - серия паспорта
- **PASSPORT_NUMBER** - номер паспорта
- **BIRTHDATE** - даты
- **BANK_ACCOUNT** - банковские счета
- **CORR_ACCOUNT** - корр. счета
- **BIK** - БИК
- **COMPANY** - названия компаний
- **OGRN** - номера ОГРН
- **OKTMO** - коды ОКТМО

## 🛠️ Разработка

При внесении изменений:

1. Измените файлы в этой папке
2. Обновите расширение в `chrome://extensions/`
3. Протестируйте изменения в файлах из папки `tests/`
4. Проверьте работу в реальных условиях

## 📋 Версия

**v1.0.0** - Первый релиз с полной функциональностью 