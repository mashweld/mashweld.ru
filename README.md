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
npm run lint:js       # ESLint (gulpfile.js, src/js/main.js)
npm run lint:css      # Stylelint (src/styl/**/*.styl)
npm run lint:pug      # pug-lint (src/templates/)
```

## Деплой

```bash
npm run deploy   # публикация в ветку gh-pages
```

## Стек

| Слой       | Технология                               |
|------------|------------------------------------------|
| Шаблоны    | Pug                                      |
| Стили      | Stylus → PostCSS (autoprefixer, cssnano) |
| JS         | Vanilla JS + jQuery                      |
| Сборка     | Gulp 5                                   |
| Dev-сервер | browser-sync                             |
| Тесты      | Playwright (визуальная регрессия)        |
| Деплой     | GitHub Pages (`gh-pages`)                |

## Структура

```
src/
  templates/   # Pug-шаблоны
  styl/        # Stylus-стили
  js/          # JavaScript
  img/         # Изображения
  fonts/       # Шрифты
www/           # Результат сборки (gitignore)
tests/         # Playwright-тесты
```
