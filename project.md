# приклад коду

```javascript
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Plus, 
  Trash2, 
  Download,
  Github,
  Languages
} from 'lucide-react';

const App = () => {
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [formData, setFormData] = useState({
    personal: {
      fullName: 'Олександр Коваленко',
      title: 'Full Stack Developer',
      email: 'alex.k@example.com',
      phone: '+380 50 123 4567',
      location: 'Київ, Україна',
      github: 'github.com/alexk',
    },
    experience: [
      {
        id: 1,
        company: 'Tech Solutions',
        position: 'Senior Developer',
        period: '2021 - Теперішній час',
        desc: 'Розробка високонавантажених систем на React та Node.js. Оптимізація продуктивності бази даних.'
      }
    ],
    education: [
      {
        id: 1,
        school: 'КПІ ім. Ігоря Сікорського',
        degree: 'Магістр комп\'ютерних наук',
        period: '2015 - 2021'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    languages: 'Українська (Рідна), Англійська (B2)'
  });

  const updatePersonal = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addListEntry = (section) => {
    const newItem = section === 'experience' 
      ? { id: Date.now(), company: '', position: '', period: '', desc: '' }
      : { id: Date.now(), school: '', degree: '', period: '' };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const updateListEntry = (section, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (section, id) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Ліва панель - Редактор */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto max-h-screen bg-white shadow-xl print:hidden">
        <header className="mb-8 flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Редактор Резюме</h1>
            <p className="text-sm text-slate-500">Заповніть дані та збережіть у PDF</p>
          </div>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={themeColor} 
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-2 border-slate-200"
              title="Колір оформлення"
            />
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <Download size={18} /> Зберегти PDF
            </button>
          </div>
        </header>

        {/* Контактна інформація */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
            <User size={18} /> Контакти
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Прізвище та ім'я</label>
              <input 
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Посада</label>
              <input 
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.personal.title}
                onChange={(e) => updatePersonal('title', e.target.value)}
              />
            </div>
            <input 
              placeholder="Email" 
              className="p-2 border rounded-md"
              value={formData.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
            />
            <input 
              placeholder="Телефон" 
              className="p-2 border rounded-md"
              value={formData.personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
            />
          </div>
        </section>

        {/* Досвід роботи */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
              <Briefcase size={18} /> Досвід роботи
            </h2>
            <button 
              onClick={() => addListEntry('experience')}
              className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 text-sm font-semibold"
            >
              <Plus size={16} /> Додати
            </button>
          </div>
          {formData.experience.map(exp => (
            <div key={exp.id} className="bg-slate-50 p-4 rounded-xl mb-4 relative border border-slate-200">
              <button 
                onClick={() => removeItem('experience', exp.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input 
                  placeholder="Компанія" 
                  className="p-2 border rounded bg-white text-sm"
                  value={exp.company}
                  onChange={(e) => updateListEntry('experience', exp.id, 'company', e.target.value)}
                />
                <input 
                  placeholder="Посада" 
                  className="p-2 border rounded bg-white text-sm"
                  value={exp.position}
                  onChange={(e) => updateListEntry('experience', exp.id, 'position', e.target.value)}
                />
                <input 
                  placeholder="Період (н-р: 2021 - 2024)" 
                  className="p-2 border rounded bg-white col-span-2 text-sm"
                  value={exp.period}
                  onChange={(e) => updateListEntry('experience', exp.id, 'period', e.target.value)}
                />
              </div>
              <textarea 
                placeholder="Опис досягнень..." 
                className="w-full p-2 border rounded bg-white h-24 text-sm"
                value={exp.desc}
                onChange={(e) => updateListEntry('experience', exp.id, 'desc', e.target.value)}
              />
            </div>
          ))}
        </section>

        {/* Освіта */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
              <GraduationCap size={18} /> Освіта
            </h2>
            <button 
              onClick={() => addListEntry('education')}
              className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 text-sm font-semibold"
            >
              <Plus size={16} /> Додати
            </button>
          </div>
          {formData.education.map(edu => (
            <div key={edu.id} className="bg-slate-50 p-4 rounded-xl mb-4 relative border border-slate-200">
              <button 
                onClick={() => removeItem('education', edu.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  placeholder="Навчальний заклад" 
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.school}
                  onChange={(e) => updateListEntry('education', edu.id, 'school', e.target.value)}
                />
                <input 
                  placeholder="Ступінь / Спеціальність" 
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.degree}
                  onChange={(e) => updateListEntry('education', edu.id, 'degree', e.target.value)}
                />
                <input 
                  placeholder="Рік закінчення" 
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.period}
                  onChange={(e) => updateListEntry('education', edu.id, 'period', e.target.value)}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-2">
            <Code size={18} /> Навички
          </h2>
          <textarea 
            placeholder="React, JavaScript, SQL..." 
            className="w-full p-2 border rounded h-20 text-sm"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData(prev => ({...prev, skills: e.target.value.split(',').map(s => s.trim())}))}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-2">
            <Languages size={18} /> Мови
          </h2>
          <input 
            className="w-full p-2 border rounded text-sm"
            value={formData.languages}
            onChange={(e) => setFormData(prev => ({...prev, languages: e.target.value}))}
          />
        </section>
      </div>

      {/* Права панель - Попередній перегляд (A4) */}
      <div className="w-full lg:w-1/2 p-4 lg:p-8 bg-slate-500 flex justify-center overflow-y-auto">
        <div id="resume-preview" className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[15mm] text-slate-800 print:shadow-none print:m-0 print:w-full">
          {/* Header */}
          <header className="border-b-4 pb-6 mb-8" style={{ borderColor: themeColor }}>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2" style={{ color: themeColor }}>
              {formData.personal.fullName || 'Ваше Ім\'я'}
            </h1>
            <p className="text-xl font-medium text-slate-600 mb-4 tracking-wide">{formData.personal.title || 'Посада'}</p>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail size={14} style={{ color: themeColor }} /> {formData.personal.email}</div>
              <div className="flex items-center gap-2"><Phone size={14} style={{ color: themeColor }} /> {formData.personal.phone}</div>
              <div className="flex items-center gap-2"><MapPin size={14} style={{ color: themeColor }} /> {formData.personal.location}</div>
              {formData.personal.github && (
                <div className="flex items-center gap-2"><Github size={14} style={{ color: themeColor }} /> {formData.personal.github}</div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-3 gap-8">
            {/* Основна частина */}
            <div className="col-span-2">
              <section className="mb-8">
                <h3 className="text-lg font-bold border-b-2 mb-4 pb-1 uppercase tracking-wider" style={{ color: themeColor, borderColor: themeColor }}>
                  Досвід роботи
                </h3>
                {formData.experience.map(exp => (
                  <div key={exp.id} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800 text-base">{exp.position}</h4>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{exp.period}</span>
                    </div>
                    <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                  </div>
                ))}
              </section>

              <section>
                <h3 className="text-lg font-bold border-b-2 mb-4 pb-1 uppercase tracking-wider" style={{ color: themeColor, borderColor: themeColor }}>
                  Освіта
                </h3>
                {formData.education.map(edu => (
                  <div key={edu.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-slate-800 text-sm">{edu.school}</h4>
                      <span className="text-xs font-semibold text-slate-400">{edu.period}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">{edu.degree}</p>
                  </div>
                ))}
              </section>
            </div>

            {/* Бокова панель резюме */}
            <div className="col-span-1">
              <section className="mb-8">
                <h3 className="text-lg font-bold border-b-2 mb-4 pb-1 uppercase tracking-wider" style={{ color: themeColor, borderColor: themeColor }}>
                  Навички
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill, i) => skill && (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded uppercase tracking-tighter"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-lg font-bold border-b-2 mb-4 pb-1 uppercase tracking-wider" style={{ color: themeColor, borderColor: themeColor }}>
                  Мови
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {formData.languages}
                </p>
              </section>

              <div className="mt-20 pt-10 border-t border-slate-100 text-[9px] text-slate-300 uppercase tracking-widest text-center">
                Створено в ResumeBuilder
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body { 
            margin: 0;
            -webkit-print-color-adjust: exact; 
          }
          .print\\:hidden { display: none !important; }
          #resume-preview { 
            box-shadow: none !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            position: absolute;
            top: 0;
            left: 0;
          }
          /* Вимикаємо фон сайту при друці */
          .bg-slate-500 { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default App;

```


# Технічне завдання: 
AI Resume Builder (Full-Stack)1. 
Технологічний стекFramework: Next.js  (App Router).
Styling: Tailwind CSS.
Database: Neon (PostgreSQL).ORM: Drizzle ORM.Auth: NextAuth.js 
.AI Integration: Grok AI SDK 
.Deployment: Vercel.2.
 Структура бази даних (Drizzle Schema)Таблиця usersid: serial / uuid (Primary Key).email: text (Unique, Not Null).password: text (Hashed).Таблиця resumesid: uuid (Primary Key).userId: integer / uuid (Foreign Key -> users.id).body: jsonb (Зберігає всю структуру резюме: personal, experience, education, skills).updatedAt: timestamp.3. Функціональні вимогиАвторизація (Auth)Реалізувати сторінку Login/Register.Pre-filled Credentials: Додати кнопки швидкого входу для тестових акаунтів (Seed users).Захистити роути /dashboard та /editor (тільки для авторизованих).Редактор та автозбереженняФорма з розділами: Контакти, Досвід, Освіта, Навички.Auto-save: При кожній зміні інпуту (з debounce 1 сек) відправляти PATCH запит на сервер для оновлення jsonb поля в БД.Інтеграція Grok AIКнопка "AI Покращити" біля полів experience.desc.Функція автозаповнення: на основі title (посади) Grok має згенерувати список типових навичок та обов'язків.AI-чатбокс для порад щодо покращення тексту резюме.Генерація PDFВикористати бібліотеку @react-pdf/renderer для генерації PDF на стороні клієнта (це дозволяє створювати складні макети, які не розваляться при друці).Альтернатива: Браузерний window.print() з кастомними CSS медіа-запитами @media print.4. План розробки (Промпт для виконання)Виконай наступні кроки:Налаштуй схему Drizzle для Neon Postgres (users, resumes).Створи скрипт seed.ts, який створює 10 користувачів (user1@gmail.com ... user10@gmail.com) з паролем user123 та порожнім об'єктом резюме для кожного.Реалізуй API роут для автозбереження JSON-даних резюме.Створи UI редактор на React Hook Form, який синхронізується з БД.Додай ендпоінт для Grok AI, який приймає текст і повертає "професійну версію" для резюме.Додай кнопку "Завантажити PDF", яка рендерить поточний стан JSON у документ.5. Дані для Сідів (Seed Data)EmailPassworduser1@gmail.com ... user10@gmail.comuser123