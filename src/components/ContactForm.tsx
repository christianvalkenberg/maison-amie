'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 p-6 bg-olive-50 border border-olive-200">
        <CheckCircle className="text-olive-600 shrink-0 mt-0.5" size={20} />
        <p className="font-body text-olive-800">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Naam en e-mail naast elkaar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-body text-sm text-dark mb-1">{t('name')} *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 transition-colors"
          />
        </div>
        <div>
          <label className="block font-body text-sm text-dark mb-1">{t('email')} *</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-body text-sm text-dark mb-1">{t('phone')}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 transition-colors"
          />
        </div>
        <div>
          <label className="block font-body text-sm text-dark mb-1">{t('subject')} *</label>
          <input
            type="text"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm text-dark mb-1">{t('message')} *</label>
        <textarea
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={16} />
          <p className="font-body text-sm">{t('error')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
