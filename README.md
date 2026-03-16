# mashweld.ru

Сайт компании ООО «ВЕЛДТЕХМАШ-О» — поставщика сварочного оборудования.

## Требования

- Node.js >= 22.18.0
- npm >= 10.9.3

## Установка

```bash
npm install
```

## Разработка

```bash
npm start        # сборка + watch + browser-sync на http://localhost:3000
```

## Сборка

```bash
npm run build    # сборка в www/
```

## Тесты

```bash
npm test              # сборка + визуальные регрессионные тесты (Playwright)
npm run test:update   # обновить эталонные скриншоты
```

## Линтинг

```bash
npm run lint          # JS + CSS + Pug
npm run lint:js       # ESLint (gulpfile.js, playwright.config.js, tests/)
npm run lint:css      # Stylelint (src/scss/**/*.scss)
npm run lint:pug      # pug-lint (src/templates/)
```

## Аудит

```bash
npm run audit    # проверка зависимостей на уязвимости
```

## Деплой

```bash
npm run deploy   # публикация в ветку gh-pages (ручной)
```

Автоматический деплой настроен через GitHub Actions: при пуше в `master` запускается CI (линтинг, аудит, сборка, тесты) и, при успехе, деплой на GitHub Pages.

## Стек

| Слой       | Технология                               |
|------------|------------------------------------------|
| Шаблоны    | Pug                                      |
| Стили      | SCSS → PostCSS (autoprefixer, cssnano)   |
| Лайтбокс   | GLightbox                                |
| Сборка     | Gulp 5                                   |
| Dev-сервер | browser-sync                             |
| Тесты      | Playwright (визуальная регрессия)        |
| CI/CD      | GitHub Actions                           |
| Деплой     | GitHub Pages (`gh-pages`)                |

## Структура

```
src/
  templates/   # Pug-шаблоны
  scss/        # SCSS-стили
  img/         # Изображения
  fonts/       # Шрифты
  css/         # Статические CSS (print.css)
www/           # Результат сборки (gitignore)
tests/         # Playwright-тесты
.github/       # CI/CD и Dependabot
```
