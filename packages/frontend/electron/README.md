# DayOfWeekAndPercentsLeft App

This is an Electron app that displays the day of the week and the percentage of remaining time

---

## Содержание

1. [Commands](#commands)
2. [npm run build description](#npm-run-build-description)

## Notes

### Commands

Run app:

```bash
npx electron .
```

Install Electron Packager:

```bash
npm install electron-packager -g
```

Pack project:

```bash
npm run build
```

### npm run build description

- **`electron-packager`**

    - Это основная команда, которая используется для создания пакета
      приложения `Electron`

    - `electron-packager` — это популярный инструмент для упаковки
      Electron-приложений

- **`.` (точка)**

    - Указывает директорию проекта, из которой будет создан пакет

    - В данном случае точка означает текущую рабочую директорию (`./`)

- **`DayOfWeekApp`**

    - Это имя приложения, которое будет задано после упаковки

    - Имя будет использоваться для создания каталога и файла приложения

- **`--platform=win32`**

    - Указывает платформу, для которой создается пакет

    - `win32` означает, что пакет предназначен для операционной системы Windows

- **`--arch=x64`**

    - Указывает архитектуру процессора, для которой создается пакет

    - `x64` означает, что приложение будет работать на 64-битных системах
      Windows

- **`--overwrite`**

    - Этот флаг указывает, что если уже существует пакет с таким же именем и
      конфигурацией, его нужно перезаписать

    - Без этого флага команда может выдать ошибку, если пакет уже существует

- **`--icon=assets/icon.ico`**

    - Указывает путь к файлу иконки в формате .ico, который будет использоваться
      для исполняемого файла .exe. Если этот параметр не указан, Electron
      Packager будет использовать стандартную иконку Electron