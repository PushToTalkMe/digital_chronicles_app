# Digital Chronicles App

## Документация

### Инициализация

-   Выполнить команду `npm install`

### Запуск Backend

#### Первый вариант через Docker

-   Установить и запустить Docker
-   Выполнить в packages/backend `npx prisma generate`
-   Выполнить команду в рабочей папке `npm run docker:build`
-   После инициализации контейнера, будут доступны образы frontend(3001), backend(3000) и postgres(5432).
-   Backend будет принимать запросы по адресу `http://localhost:3000/api`

#### Второй вариант локально

-   Установить WSL (windows sub linux) или VM
-   Установить Ubuntu Server или любую другую операционную систему с ядром Linux
-   Установить туда PostgreSQL
-   В папке packages/backend добавить `.env` файл с `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database"`
-   Перейдите в папку packages/backend и выполните команды
    ```bash
    npx prisma generate
    npx prisma migrate reset --force
    ```
-   Запустить сервер можно командой `npm run dev`
-   Backend будет принимать запросы по адресу `http://localhost:3000/api`

### Запуск Frontend

#### Первый вариант через Docker

-   Установить и запустить Docker
-   Выполнить в packages/backend `npx prisma generate`
-   Выполнить команду в рабочей папке `npm run docker:build`
-   После инициализации контейнера, будут доступны образы frontend(3001), backend(3000) и postgres(5432).
-   Frontend будет принимать запросы по адресу `http://localhost:3001`

#### Второй вариант локально

-   Запустить клиентскую часть можно командой `npm run dev:frontend`
-   Frontend будет принимать запросы по адресу `http://localhost:3001`
