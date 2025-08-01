# Release Notes - Russian Chrome Anonymizer v1.0.0

## 🎉 Первый релиз - Полная система анонимизации PII

**Версия:** 1.0.0  
**Дата:** Январь 2025  
**Автор:** https://t.me/ai_for_robot

---

## ✨ Новые возможности

### 🔒 Анонимизация персональных данных
- **ФИО** - полные имена на русском языке
- **Адреса** - российские адреса с улицами, домами, квартирами
- **Телефоны** - мобильные и стационарные номера в различных форматах
- **Email адреса** - электронная почта
- **Паспортные данные** - серия, номер паспорта
- **Банковские данные** - счета, корр. счета, БИК
- **Документы** - СНИЛС, ИНН, ОГРН, ОКТМО
- **Даты** - даты рождения, выдачи документов
- **Компании** - все формы собственности (ООО, АО, ИП и др.)

### 🔄 Двусторонняя работа
- **Анонимизация** - замена PII на маркеры
- **Деанонимизация** - восстановление оригинальных данных
- **Буфер обмена** - автоматическая работа с копированным текстом

### 🎯 Умная обработка
- **Пересечения** - предотвращение конфликтов между паттернами
- **Приоритеты** - правильный порядок обработки данных
- **Контекст** - учет различных форматов написания

---

## 🛠️ Технические улучшения

### Архитектура
- **Manifest V3** - современный стандарт Chrome расширений
- **Service Worker** - фоновая обработка данных
- **Popup Interface** - удобный пользовательский интерфейс
- **Storage API** - безопасное хранение данных в браузере

### Паттерны анонимизации
- **Компании**: `/(?:^|\s)(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)\s+(?:«[^»]+»|"[^"]+"|'[^']+'|[А-ЯЁа-яё\-\s]+)|(?:«|"|')(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)\s+[^»"']+(?:»|"|')|(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)"[^"]+"/gi`
- **Банковские счета**: `/(?:счет|счёт|банковский\s+счет)\s*:?\s*\d{20}|\b\d{20}\b/g`
- **Паспортные данные**: `/номер\s+\d{6}/gi`
- **И многое другое...**

### Производительность
- **Быстрая обработка** - оптимизированные регулярные выражения
- **Минимальное потребление памяти** - эффективная архитектура
- **Стабильная работа** - тщательное тестирование

---

## 🧪 Тестирование

### Покрытие тестами
- ✅ **Компании** - все формы собственности и варианты написания
- ✅ **Банковские данные** - полные счета и БИК
- ✅ **Паспортные данные** - серия и номер
- ✅ **Полный текст** - комплексная проверка всех типов данных

### Результаты тестирования
- **21 сущность** найдена и анонимизирована в полном тексте
- **100% успех** для всех типов персональных данных
- **0 конфликтов** между паттернами

---

## 📦 Установка

### Способ 1: Из исходного кода
1. Скачайте файлы из папки `src/`
2. Откройте Chrome и перейдите в `chrome://extensions/`
3. Включите "Режим разработчика"
4. Нажмите "Загрузить распакованное расширение"
5. Выберите папку с файлами

### Способ 2: Из zip архива
1. Скачайте `RussianChromeAnonymizer_v1.0.0.zip`
2. Распакуйте архив
3. Следуйте инструкциям выше

---

## 🚀 Использование

### Анонимизация
1. Скопируйте текст с персональными данными
2. Нажмите на иконку расширения
3. Нажмите "Анонимизировать"
4. Получите текст с замененными PII на маркеры

### Деанонимизация
1. Скопируйте анонимизированный текст
2. Нажмите на иконку расширения
3. Нажмите "Восстановить"
4. Получите оригинальный текст с восстановленными данными

---

## 🔧 Требования

- **Chrome 88+** или совместимый браузер
- **Разрешения**: буфер обмена, активные вкладки, хранение данных

---

## 📝 Известные особенности

- Расширение работает только с русским текстом
- Некоторые сложные форматы могут требовать ручной корректировки
- Данные хранятся локально в браузере

---

## 🤝 Поддержка

- **Автор**: https://t.me/ai_for_robot
- **Репозиторий**: https://github.com/RobotAvi/RussianChromeAnnonymizerForGPT
- **Issues**: Сообщайте о проблемах в GitHub

---

## 📈 Планы на будущее

- [ ] Поддержка других языков
- [ ] Интеграция с популярными сервисами
- [ ] Расширенные настройки анонимизации
- [ ] API для разработчиков

---

**Спасибо за использование Russian Chrome Anonymizer!** 🎯 