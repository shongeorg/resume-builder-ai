# AI Resume Builder

Повноцінний full-stack додаток для створення резюме з AI-асистентом.

![Login Page](/screenshots/login.png)

## Технологічний стек

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Neon (PostgreSQL)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js (Credentials provider)
- **AI:** Groq SDK (Llama 3.3)
- **Форматування:** Zod

## Функціонал

- ✅ Авторизація з 10 тестовими користувачами
- ✅ Редактор резюме з попереднім переглядом у реальному часі
- ✅ Автозбереження змін (debounce 1 сек)
- ✅ AI покращення описів досвіду роботи
- ✅ PDF експорт через браузерний друк
- ✅ Вибір кольорової схеми
- ✅ Адаптивний дизайн

![Dashboard](/screenshots/dashboard.png)

## Швидкий старт

### 1. Встановлення залежностей

```bash
pnpm install
```

### 2. Налаштування змінних оточення

Створіть файл `.env.local` на основі `.env.example`:

```bash
DATABASE_URL=your_neon_database_url
GROQ_API_KEY=your_groq_api_key
AUTH_SECRET=your_auth_secret
```

Отримати AUTH_SECRET можна командою:
```bash
openssl rand -base64 32
```

### 3. Міграція бази даних

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Seed тестових даних

Створює 10 користувачів (user1@gmail.com ... user10@gmail.com) з паролем `user123`:

```bash
pnpm db:seed
```

### 5. Запуск дев-сервера

```bash
pnpm dev
```

Відкрийте [http://localhost:3000](http://localhost:3000)

## Тестові акаунти

- **Email:** user1@gmail.com ... user10@gmail.com
- **Пароль:** user123

## Структура бази даних

### users
- `id` - serial (PK)
- `email` - text (unique)
- `password` - text (hashed)

### resumes
- `id` - uuid (PK)
- `userId` - integer (FK → users.id)
- `body` - jsonb (структура резюме)
- `updatedAt` - timestamp

## API Endpoints

- `GET /api/resumes` - отримати всі резюме користувача
- `GET /api/resumes/[id]` - отримати конкретне резюме
- `PATCH /api/resumes/[id]` - оновити резюме (автозбереження)
- `POST /api/ai/enhance` - AI покращення опису
- `POST /api/ai/enhance-education` - AI покращення освіти
- `POST /api/register` - реєстрація нового користувача

## Деплой

Найпростіше задеплоїти на [Vercel](https://vercel.com):

1. Підключіть GitHub репозиторій
2. Додайте змінні оточення
3. Задеплойте

```bash
npm run deploy
```

## Скріншоти

![Login](/screenshots/login2.png)
![Login](/screenshots/login3.png)
![Login](/screenshots/login4.png)
![Editor](/screenshots/screenshot.png)
![Editor](/screenshots/screenshot2.png)
![Editor](/screenshots/screenshot3.png)
![Editor](/screenshots/screenshot4.png)
![Editor](/screenshots/screenshot5.png)
![Editor](/screenshots/screenshot6.png)
![Editor](/screenshots/screenshot7.png)
![Editor](/screenshots/screenshot8.png)
![Editor](/screenshots/screenshot9.png)
![Editor](/screenshots/screenshot10.png)
![Editor](/screenshots/screenshot11.png)
![Editor](/screenshots/screenshot12.png)
![Editor](/screenshots/screenshot13.png)
![Editor](/screenshots/screenshot14.png)
![Editor](/screenshots/screenshot15.png)

## Ліцензія

MIT
