'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF, PDFPreview } from '@/components/ResumePDF';
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
  Languages,
  Save,
  Sparkles,
  ArrowLeft,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  period: string;
  desc: string;
}

interface Education {
  id: number;
  school: string;
  degree: string;
  period: string;
}

interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string;
}

const emptyResume: ResumeData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    github: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: '',
};

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [resumeName, setResumeName] = useState('My Resume');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState<number | null>(null);
  const [previewScale, setPreviewScale] = useState(50);

  const { control, watch, setValue, reset } = useForm<ResumeData>({
    defaultValues: emptyResume,
  });

  const formData = watch();

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      if (id === 'new') {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/resumes/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            setResumeName(data.name);
          }
          if (data.body) {
            if (data.body.themeColor) {
              setThemeColor(data.body.themeColor);
            }
            reset({
              personal: {
                fullName: data.body.personal?.fullName || '',
                title: data.body.personal?.title || '',
                email: data.body.personal?.email || '',
                phone: data.body.personal?.phone || '',
                location: data.body.personal?.location || '',
                github: data.body.personal?.github || '',
              },
              experience: data.body.experience || [],
              education: data.body.education || [],
              skills: data.body.skills || [],
              languages: data.body.languages || '',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [id, reset]);

  // Create new resume on first edit
  const createNewResume = async () => {
    if (id !== 'new') return null;

    try {
      const res = await fetch('/api/resumes', { method: 'GET' });
      if (res.ok) {
        const resumes = await res.json();
        if (resumes.length > 0) {
          // Use first existing resume for new users
          return resumes[0].id;
        }
      }

      // Create new resume by updating existing one
      // (seed script creates empty resumes for each user)
      const createRes = await fetch('/api/resumes', { method: 'GET' });
      const data = await createRes.json();
      if (data && data.length > 0) {
        return data[0].id;
      }
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
    return null;
  };

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    const currentPersonal = formData.personal || emptyResume.personal;
    setValue('personal', { ...currentPersonal, [field]: value });
  };

  const addListEntry = (section: 'experience' | 'education') => {
    const newItem = section === 'experience'
      ? { id: Date.now(), company: '', position: '', period: '', desc: '' }
      : { id: Date.now(), school: '', degree: '', period: '' };

    setValue(section, [...formData[section], newItem] as any);
  };

  const updateListEntry = (
    section: 'experience' | 'education',
    id: number,
    field: string,
    value: string
  ) => {
    setValue(
      section,
      (formData[section] as any[]).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ) as any
    );
  };

  const removeItem = (section: 'experience' | 'education', id: number) => {
    setValue(
      section,
      (formData[section] as any[]).filter((item) => item.id !== id) as any
    );
  };

  const handleDownloadPDF = async () => {
    try {
      const blob = await pdf(
        <ResumePDF data={formData} themeColor={themeColor} />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeName || 'resume'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const handleEnhanceWithAI = async (expId: number) => {
    setIsEnhancing(expId);
    try {
      const exp = formData.experience.find((e) => e.id === expId);
      if (!exp) return;

      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: exp.position,
          description: exp.desc,
          company: exp.company,
          period: exp.period,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const expIndex = formData.experience.findIndex((e) => e.id === expId);
        const newExperience = [...formData.experience];
        newExperience[expIndex] = {
          ...exp,
          company: data.company || exp.company,
          position: data.position || exp.position,
          period: data.period || exp.period,
          desc: data.enhanced,
        };
        setValue('experience', newExperience);
      }
    } catch (error) {
      console.error('Failed to enhance with AI:', error);
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleEnhanceEducationWithAI = async (eduId: number) => {
    setIsEnhancing(eduId);
    try {
      const edu = formData.education.find((e) => e.id === eduId);
      if (!edu) return;

      const res = await fetch('/api/ai/enhance-education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school: edu.school,
          degree: edu.degree,
          period: edu.period,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const eduIndex = formData.education.findIndex((e) => e.id === eduId);
        const newEducation = [...formData.education];
        newEducation[eduIndex] = {
          ...edu,
          school: data.school || edu.school,
          degree: data.degree || edu.degree,
          period: data.period || edu.period,
        };
        setValue('education', newEducation);
      }
    } catch (error) {
      console.error('Failed to enhance education with AI:', error);
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleSaveResume = async () => {
    if (id === 'new') {
      // Create new resume - redirect to first existing resume
      try {
        const res = await fetch('/api/resumes');
        if (res.ok) {
          const resumes = await res.json();
          if (resumes.length > 0) {
            router.push(`/editor/${resumes[0].id}`);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to get resumes:', error);
      }
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resumeName,
          body: {
            ...formData,
            themeColor,
          },
        }),
      });

      if (res.ok) {
        setSaveMessage('Resume saved!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Save failed');
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveMessage('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Left Panel - Editor */}
      <div className="w-full lg:w-[45%] p-6 overflow-y-auto max-h-screen bg-white shadow-xl print:hidden">
        <header className="mb-8 flex flex-col gap-4 border-b pb-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Resume Editor</h1>
                <p className="text-sm text-slate-500">
                  {saveMessage && (
                    <span className="text-green-600 font-medium">{saveMessage}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-2 border-slate-200"
                title="Theme color"
              />
              <button
                onClick={handleSaveResume}
                disabled={isSaving}
                className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition font-medium shadow-sm disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm text-sm"
              >
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-700">Resume Name:</label>
            <input
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="flex-1 max-w-xs p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Enter resume name"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-700">Preview Scale:</label>
            <input
              type="range"
              min="50"
              max="100"
              value={previewScale}
              onChange={(e) => setPreviewScale(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-slate-600 font-medium">{previewScale}%</span>
          </div>
        </header>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
            <User size={18} /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">
                Full Name
              </label>
              <input
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.personal?.fullName || ''}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">
                Position
              </label>
              <input
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.personal?.title || ''}
                onChange={(e) => updatePersonal('title', e.target.value)}
              />
            </div>
            <input
              placeholder="Email"
              className="p-2 border rounded-md"
              value={formData.personal?.email || ''}
              onChange={(e) => updatePersonal('email', e.target.value)}
            />
            <input
              placeholder="Phone"
              className="p-2 border rounded-md"
              value={formData.personal?.phone || ''}
              onChange={(e) => updatePersonal('phone', e.target.value)}
            />
          </div>
        </section>

        {/* Work Experience */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
              <Briefcase size={18} /> Work Experience
            </h2>
            <button
              onClick={() => addListEntry('experience')}
              className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 text-sm font-semibold"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          {formData.experience.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-50 p-4 rounded-xl mb-4 relative border border-slate-200"
            >
              <button
                onClick={() => removeItem('experience', exp.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Company"
                  className="p-2 border rounded bg-white text-sm"
                  value={exp.company}
                  onChange={(e) =>
                    updateListEntry('experience', exp.id, 'company', e.target.value)
                  }
                />
                <input
                  placeholder="Position"
                  className="p-2 border rounded bg-white text-sm"
                  value={exp.position}
                  onChange={(e) =>
                    updateListEntry('experience', exp.id, 'position', e.target.value)
                  }
                />
                <input
                  placeholder="Period (e.g.: 2021 - 2024)"
                  className="p-2 border rounded bg-white col-span-2 text-sm"
                  value={exp.period}
                  onChange={(e) =>
                    updateListEntry('experience', exp.id, 'period', e.target.value)
                  }
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">
                  Description
                </span>
                <button
                  onClick={() => handleEnhanceWithAI(exp.id)}
                  disabled={isEnhancing === exp.id}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {isEnhancing === exp.id ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              <textarea
                placeholder="Describe your achievements..."
                className="w-full p-2 border rounded bg-white h-24 text-sm"
                value={exp.desc}
                onChange={(e) =>
                  updateListEntry('experience', exp.id, 'desc', e.target.value)
                }
              />
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
              <GraduationCap size={18} /> Education
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => addListEntry('education')}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 text-sm font-semibold"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
          {formData.education.map((edu) => (
            <div
              key={edu.id}
              className="bg-slate-50 p-4 rounded-xl mb-4 relative border border-slate-200"
            >
              <button
                onClick={() => removeItem('education', edu.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleEnhanceEducationWithAI(edu.id)}
                  disabled={isEnhancing === edu.id}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {isEnhancing === edu.id ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="School / University"
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.school}
                  onChange={(e) =>
                    updateListEntry('education', edu.id, 'school', e.target.value)
                  }
                />
                <input
                  placeholder="Degree / Field of Study"
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.degree}
                  onChange={(e) =>
                    updateListEntry('education', edu.id, 'degree', e.target.value)
                  }
                />
                <input
                  placeholder="Graduation Year"
                  className="p-2 border rounded bg-white text-sm"
                  value={edu.period}
                  onChange={(e) =>
                    updateListEntry('education', edu.id, 'period', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-2">
            <Code size={18} /> Skills
          </h2>
          <textarea
            placeholder="React, JavaScript, SQL..."
            className="w-full p-2 border rounded h-20 text-sm"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) =>
              setValue('skills', e.target.value.split(',').map((s) => s.trim()))
            }
          />
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-2">
            <Languages size={18} /> Languages
          </h2>
          <input
            className="w-full p-2 border rounded text-sm"
            value={formData.languages || ''}
            onChange={(e) => setValue('languages', e.target.value)}
          />
        </section>
      </div>

      {/* Right Panel - PDF Preview */}
      <div className="w-full lg:w-[50%] overflow-hidden">
        <PDFPreview data={formData} themeColor={themeColor} scale={previewScale} />
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
          .bg-slate-500 { background: white !important; }
        }
      `}</style>
    </div>
  );
}
