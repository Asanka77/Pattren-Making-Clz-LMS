import React, { useState } from 'react';
import { CustomForm, CourseItem } from '../../types';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  CheckCircle,
  FileText,
  Upload,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CourseCustomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: CustomForm;
  course?: CourseItem;
  onOpenStandardRegistration?: () => void;
}

export function CourseCustomFormModal({
  isOpen,
  onClose,
  form,
  course,
  onOpenStandardRegistration,
}: CourseCustomFormModalProps) {
  const { language } = useLanguage();
  const { submitCustomForm } = useData();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleFileUpload = (fieldKey: string, file: File) => {
    // Validate size (max 8MB for browser upload)
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please select a smaller document or photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        handleInputChange(fieldKey, res);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate required fields
    for (const f of form.fields || []) {
      if (f.required) {
        const val = formData[f.name || f.id];
        if (val === undefined || val === null || val === '') {
          setErrorMsg(
            language === 'si'
              ? `කරුණාකර "${f.labelSinhala || f.label}" අනිවාර්ය තොරතුර ඇතුළත් කරන්න.`
              : `Please fill in the required field: "${f.label}".`
          );
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      const submission = await submitCustomForm(form.slug || form.id, formData);
      setSubmittedRef(submission.id);
    } catch (err: any) {
      console.error('Custom form submission error:', err);
      setErrorMsg(
        language === 'si'
          ? 'දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Submission failed. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isSinhala = language === 'si';
  const displayTitle = (isSinhala && form.titleSinhala) ? form.titleSinhala : form.title;
  const displayInstructions = (isSinhala && form.instructionsSinhala) ? form.instructionsSinhala : form.instructions;
  const displaySuccess = (isSinhala && form.successMessageSinhala) ? form.successMessageSinhala : form.successMessage;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#a89f91] hover:text-white rounded cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30 uppercase">
              {course?.title || 'Atelier Admission'}
            </span>
            <span className="text-[10px] font-mono text-[#a89f91]">
              Secure Application Portal
            </span>
          </div>

          <h3 className="text-xl font-editorial font-bold text-[#f7e2a9]">
            {displayTitle}
          </h3>

          {displayInstructions && (
            <p className="text-xs text-[#a89f91] mt-1 leading-relaxed">
              {displayInstructions}
            </p>
          )}
        </div>

        {/* Success Screen */}
        {submittedRef ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 shadow-xl">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                {displaySuccess || 'Application Submitted Successfully!'}
              </h4>
              <p className="text-xs text-[#a89f91] max-w-md mx-auto">
                {isSinhala
                  ? 'අපගේ ඇකඩමි සම්බන්ධීකාරක කණ්ඩායම විසින් ඔබගේ අයදුම්පත පරීක්ෂා කර ඔබව වට්ස්ඇප් මගින් සම්බන්ධ කර ගනු ඇත.'
                  : 'Our atelier counseling team has received your registration details and will reach out via WhatsApp with your intake confirmation.'}
              </p>
              <div className="inline-block px-3 py-1 rounded bg-[#0c090a] border border-[#dfb56c]/40 text-xs font-mono text-[#dfb56c]">
                Application Reference: <strong className="text-white">{submittedRef}</strong>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/94777595560?text=Hello%20Ceylon%20Style%20Studio!%20I%20have%20submitted%20application%20ref:%20${submittedRef}%20for%20${encodeURIComponent(course?.title || form.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#1e1316] hover:bg-[#2b1b1f] border border-white/20 text-[#f7f3eb] text-xs font-semibold rounded transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
            {errorMsg && (
              <div className="p-3 rounded bg-rose-950/80 border border-rose-500/60 text-rose-200 flex items-center gap-2 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Dynamic Fields */}
            <div className="space-y-4">
              {(form.fields || []).map((f) => {
                const fieldKey = f.name || f.id;
                const fieldLabel = (isSinhala && f.labelSinhala) ? f.labelSinhala : f.label;
                const currentValue = formData[fieldKey] ?? '';

                return (
                  <div key={f.id} className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#f7f3eb] flex items-center justify-between">
                      <span>
                        {fieldLabel} {f.required && <span className="text-[#dfb56c] font-bold">*</span>}
                      </span>
                      {f.required && (
                        <span className="text-[10px] text-[#a89f91] font-mono">
                          {isSinhala ? 'අනිවාර්යයි' : 'Required'}
                        </span>
                      )}
                    </label>

                    {/* Single-line Text / Email / Phone */}
                    {(f.type === 'text' || f.type === 'email' || f.type === 'phone') && (
                      <input
                        type={f.type === 'email' ? 'email' : f.type === 'phone' ? 'tel' : 'text'}
                        value={currentValue}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder={f.placeholder || ''}
                        required={f.required}
                        className="w-full px-3 py-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none transition-colors"
                      />
                    )}

                    {/* Textarea */}
                    {f.type === 'textarea' && (
                      <textarea
                        rows={3}
                        value={currentValue}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder={f.placeholder || ''}
                        required={f.required}
                        className="w-full px-3 py-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none transition-colors leading-relaxed"
                      />
                    )}

                    {/* Dropdown Select */}
                    {f.type === 'dropdown' && (
                      <select
                        value={currentValue}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        required={f.required}
                        className="w-full px-3 py-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9] focus:border-[#dfb56c] outline-none"
                      >
                        <option value="">
                          {isSinhala ? '-- තෝරන්න --' : '-- Please Select --'}
                        </option>
                        {(f.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Radio Options */}
                    {f.type === 'radio' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(f.options || []).map((opt) => (
                          <label
                            key={opt}
                            className={`p-2.5 rounded border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                              currentValue === opt
                                ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9]'
                                : 'bg-[#0c090a] border-white/10 text-[#a89f91] hover:text-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name={fieldKey}
                              value={opt}
                              checked={currentValue === opt}
                              onChange={() => handleInputChange(fieldKey, opt)}
                              className="accent-[#dfb56c]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Checkbox */}
                    {f.type === 'checkbox' && (
                      <label className="flex items-center gap-2 p-2 rounded bg-[#0c090a] border border-white/10 text-xs text-[#f7f3eb] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(currentValue)}
                          onChange={(e) => handleInputChange(fieldKey, e.target.checked)}
                          className="w-4 h-4 accent-[#dfb56c]"
                        />
                        <span>{f.placeholder || fieldLabel}</span>
                      </label>
                    )}

                    {/* File Upload (Payment slip, portfolio, ID) */}
                    {f.type === 'file' && (
                      <div className="p-3 rounded bg-[#0c090a] border border-white/10 space-y-2">
                        <label className="btn-3d-secondary px-3 py-2 text-xs rounded cursor-pointer inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {currentValue ? 'Change Uploaded File' : 'Upload Document or Photo (Max 8MB)'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(fieldKey, file);
                            }}
                          />
                        </label>

                        {currentValue && (
                          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>File attached ready for submission</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {onOpenStandardRegistration ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStandardRegistration();
                  }}
                  className="text-xs text-[#a89f91] hover:text-[#dfb56c] underline"
                >
                  {isSinhala
                    ? 'ප්‍රධාන ලියාපදිංචි පෝරමය භාවිතා කරන්න'
                    : 'Or use standard studio registration form'}
                </button>
              ) : <div />}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 border border-white/15 rounded text-[#a89f91] hover:text-white"
                >
                  {isSinhala ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded shadow-lg hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting
                      ? (isSinhala ? 'ඉදිරිපත් කරමින්...' : 'Submitting...')
                      : (isSinhala ? 'අයදුම්පත ඉදිරිපත් කරන්න' : 'Submit Application')}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
