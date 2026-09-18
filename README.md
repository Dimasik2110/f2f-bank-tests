# F2F Bank — E2E тесты

End-to-end тесты для веб-приложения F2F Bank с использованием Playwright и TypeScript.

## Технологии

- Playwright
- TypeScript
- Chromium
- Docker
- Docker Compose
- Vue.js
- FastAPI
- PostgreSQL
- Nginx

## Запуск приложения

Клонировать репозиторий:

```bash```
git clone https://github.com/Dimasik2110/f2f-bank-tests.git
cd f2f-bank-tests
Запустить приложение:

docker compose up -d --build

После запуска приложение доступно по адресу:

http://localhost

Остановить приложение:

docker compose down

Для полного сброса приложения вместе с данными:

docker compose down -v
Установка зависимостей

Установить зависимости проекта:

npm install

Установить браузер Chromium для Playwright:

npx playwright install chromium
Запуск тестов

Запустить все E2E-тесты:

npx playwright test

Запустить тесты в UI-режиме:

npx playwright test --ui

Открыть HTML-отчёт:

npx playwright show-report
Результат тестирования

Локальный запуск:

13 тестов — 13 passed

Все тесты выполняются в Chromium.

Покрытые сценарии
Критический приоритет
Регистрация нового пользователя.
Ошибка входа с некорректными данными.
Высокий приоритет
Проверка обязательных полей при регистрации.
Переход со страницы входа на страницу регистрации.
Отображение формы перевода.
Проверка номера телефона.
Запрет перевода с отрицательной суммой.
Проверка обязательных полей формы перевода.
Пополнение баланса.
Средний приоритет
Переход в профиль.
Переход в историю транзакций.
Возврат на главную страницу.
Структура проекта
tests/
├── auth.spec.ts
├── balance.spec.ts
├── navigation.spec.ts
└── transfer.spec.ts

NOTES.md
playwright.config.ts
Найденные баги и особенности

В файле NOTES.md описаны следующие обнаруженные проблемы и особенности приложения:

Поля формы регистрации визуально имеют подписи Name, Surname, Email, Password, но элементы label не связаны с соответствующими input через for и id.
У поля пароля на странице регистрации используется некорректный placeholder Type your message....
Предусмотренное приложением сообщение All fields are required не отображается при обычной отправке пустой формы из-за нативной HTML-валидации required.
Конфигурация Playwright

Основная конфигурация находится в файле:

playwright.config.ts