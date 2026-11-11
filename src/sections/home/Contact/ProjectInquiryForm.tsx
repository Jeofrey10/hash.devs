import { useState, ChangeEvent, FormEvent } from 'react';
import {
  InquiryFormData,
  FormErrors,
  PROJECT_TYPES,
  INITIAL_FORM_DATA,
  STUDIO_CONTACT_INFO,
} from './contactConfig';
import {
  validateInquiryForm,
  prepareEmailDispatch,
  isValidEmail,
} from './inquiryService';

export function ProjectInquiryForm() {
  const [formData, setFormData] = useState<InquiryFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'dispatched'>('idle');
  const [lastDispatchedBrief, setLastDispatchedBrief] = useState<string>('');
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'description') => {
    validateSingleField(field, formData[field]);
  };

  const validateSingleField = (
    field: 'name' | 'email' | 'description',
    value: string
  ) => {
    let error: string | undefined;

    if (field === 'name') {
      if (!value.trim()) {
        error = 'Your name is required.';
      } else if (value.trim().length < 2) {
        error = 'Name must be at least 2 characters.';
      }
    }

    if (field === 'email') {
      if (!value.trim()) {
        error = 'A valid work email is required.';
      } else if (!isValidEmail(value)) {
        error = 'Please provide a valid work email (e.g., name@company.com).';
      }
    }

    if (field === 'description') {
      if (!value.trim()) {
        error = 'Please tell us about your project.';
      } else if (value.trim().length < 10) {
        error = 'Please provide at least 10 characters.';
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, projectType: type }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateInquiryForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(`inquiry-${firstError}`);
      if (element) {
        element.focus();
      }
      return;
    }

    const { mailtoUrl, briefText } = prepareEmailDispatch(formData);
    setLastMailtoUrl(mailtoUrl);
    setLastDispatchedBrief(briefText);
    setStatus('dispatched');

    // Trigger visitor's default email client
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_self';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = mailtoUrl;
    }
  };

  const handleCopyBrief = () => {
    if (lastDispatchedBrief) {
      navigator.clipboard.writeText(lastDispatchedBrief);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    }
  };

  const handleEdit = () => {
    setStatus('idle');
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setStatus('idle');
    setLastDispatchedBrief('');
    setLastMailtoUrl('');
  };

  // -------------------------------------------------------------
  // DISPATCHED PREPARED STATE (No fake delivery, completely transparent)
  // -------------------------------------------------------------
  if (status === 'dispatched') {
    return (
      <div
        role="region"
        aria-label="Project Details Prepared"
        className="relative flex flex-col justify-between rounded-2xl border border-brand-neon/60 bg-[#0E1210] p-6 sm:p-8 laptop:p-10 shadow-xl animate-fade-in"
      >
        {/* Precision Registration Brackets */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-neon" />
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-neon" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-neon" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-neon" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 font-mono text-xs">
            <span className="text-brand-neon font-bold tracking-widest uppercase">
              EMAIL DISPATCH PREPARED
            </span>
            <span className="text-brand-muted text-[11px]">HELLO@HASH.DEVS</span>
          </div>

          <div className="p-4 rounded-xl border border-brand-neon/30 bg-[#050706] flex items-start gap-3.5">
            <span className="text-brand-neon text-lg">✉</span>
            <div>
              <h3 className="font-mono text-sm font-bold text-brand-white uppercase tracking-wider">
                Project Details Prepared
              </h3>
              <p className="mt-1 font-body text-xs sm:text-sm text-brand-white/90 leading-relaxed">
                Your email application will open with your project details prepared. Please review and send to complete your inquiry.
              </p>
            </div>
          </div>

          {/* Prepared Summary */}
          <div className="rounded-xl border border-brand-border/70 bg-[#050706] p-4 font-mono text-xs flex flex-col gap-2.5">
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span className="text-brand-muted text-[11px]">RECIPIENT:</span>
              <span className="text-brand-neon font-bold">{STUDIO_CONTACT_INFO.email}</span>
            </div>
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span className="text-brand-muted text-[11px]">CLIENT:</span>
              <span className="text-brand-white">{formData.name} ({formData.email})</span>
            </div>
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span className="text-brand-muted text-[11px]">TYPE:</span>
              <span className="text-brand-white">{formData.projectType}</span>
            </div>
            <div>
              <span className="text-brand-muted text-[11px] block mb-1">PROJECT SUMMARY:</span>
              <p className="font-body text-xs text-white/70 italic line-clamp-3 bg-[#0E1210] p-2.5 rounded border border-brand-border/40">
                "{formData.description.trim()}"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={lastMailtoUrl}
              className="px-4 py-2 rounded-lg bg-brand-neon/15 hover:bg-brand-neon/25 border border-brand-neon font-mono text-xs font-bold text-brand-neon transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            >
              OPEN EMAIL CLIENT AGAIN ↗
            </a>
            <button
              type="button"
              onClick={handleCopyBrief}
              className="px-4 py-2 rounded-lg bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon font-mono text-xs text-brand-white hover:text-brand-neon transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            >
              {copiedBrief ? 'DETAILS COPIED ✓' : 'COPY INQUIRY DETAILS'}
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="px-4 py-2 rounded-lg bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon font-mono text-xs text-brand-white hover:text-brand-neon transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            >
              ← EDIT DETAILS
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-brand-muted hover:text-brand-white font-mono text-xs underline transition-colors focus-visible:outline-none"
            >
              Start New Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE INQUIRY FORM VIEW
  // -------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative flex flex-col justify-between rounded-2xl border border-brand-border/80 bg-[#0E1210] p-6 sm:p-8 laptop:p-10 shadow-xl transition-all"
    >
      {/* Corner Registration Brackets */}
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-border" />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-border" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-border" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-border" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6 sm:mb-8 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
          <span className="text-brand-white font-bold tracking-widest uppercase">
            PROJECT INTAKE
          </span>
        </div>
        <span className="text-brand-muted text-[11px]">* REQUIRED FIELDS</span>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Field 01: Name */}
        <div>
          <label htmlFor="inquiry-name" className="block font-mono text-xs text-brand-white mb-2 font-semibold">
            01. YOUR NAME <span className="text-brand-neon">*</span>
          </label>
          <input
            id="inquiry-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur('name')}
            placeholder="Elena Rostova"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full bg-[#050706] border rounded-xl px-4 py-3 font-mono text-sm text-brand-white placeholder-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 ${
              errors.name
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-brand-border hover:border-brand-border-hover focus-visible:border-brand-neon focus-visible:ring-brand-neon'
            }`}
          />
          {errors.name && (
            <span id="name-error" className="mt-1.5 block font-mono text-[10px] text-red-400">
              {errors.name}
            </span>
          )}
        </div>

        {/* Field 02: Work Email */}
        <div>
          <label htmlFor="inquiry-email" className="block font-mono text-xs text-brand-white mb-2 font-semibold">
            02. WORK EMAIL <span className="text-brand-neon">*</span>
          </label>
          <input
            id="inquiry-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleBlur('email')}
            placeholder="name@organization.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full bg-[#050706] border rounded-xl px-4 py-3 font-mono text-sm text-brand-white placeholder-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 ${
              errors.email
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-brand-border hover:border-brand-border-hover focus-visible:border-brand-neon focus-visible:ring-brand-neon'
            }`}
          />
          {errors.email && (
            <span id="email-error" className="mt-1.5 block font-mono text-[10px] text-red-400">
              {errors.email}
            </span>
          )}
        </div>

        {/* Field 03: Company / Brand (Optional) */}
        <div>
          <label htmlFor="inquiry-company" className="block font-mono text-xs text-brand-muted mb-2 font-semibold">
            03. COMPANY / BRAND <span className="text-white/40 font-normal">(OPTIONAL)</span>
          </label>
          <input
            id="inquiry-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Studio, venture, or company name"
            className="w-full bg-[#050706] border border-brand-border hover:border-brand-border-hover rounded-xl px-4 py-3 font-mono text-sm text-brand-white placeholder-white/20 transition-all focus-visible:outline-none focus-visible:border-brand-neon focus-visible:ring-1 focus-visible:ring-brand-neon"
          />
        </div>

        {/* Field 04: Project Type (Compact selection) */}
        <div>
          <span className="block font-mono text-xs text-brand-white mb-2 font-semibold">
            04. PROJECT TYPE <span className="text-brand-neon">*</span>
          </span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project Type Selection">
            {PROJECT_TYPES.map((type) => {
              const isSelected = formData.projectType === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleTypeSelect(type)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon ${
                    isSelected
                      ? 'border border-brand-neon bg-brand-neon/15 text-brand-white font-bold shadow-[0_0_10px_rgba(53,232,91,0.2)]'
                      : 'border border-brand-border bg-[#050706] text-brand-muted hover:text-brand-white hover:border-brand-border-hover'
                  }`}
                >
                  <span className={isSelected ? 'text-brand-neon mr-1' : 'text-white/30 mr-1'}>■</span>
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 05: Tell Us About Your Project */}
        <div>
          <label htmlFor="inquiry-description" className="block font-mono text-xs text-brand-white mb-2 font-semibold">
            05. TELL US ABOUT YOUR PROJECT <span className="text-brand-neon">*</span>
          </label>
          <textarea
            id="inquiry-description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            placeholder="Describe your goals, challenges, requirements, or timeline..."
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'desc-error' : undefined}
            className={`w-full bg-[#050706] border rounded-xl px-4 py-3 font-body text-sm text-brand-white placeholder-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 leading-relaxed ${
              errors.description
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-brand-border hover:border-brand-border-hover focus-visible:border-brand-neon focus-visible:ring-brand-neon'
            }`}
          />
          {errors.description && (
            <span id="desc-error" className="mt-1.5 block font-mono text-[10px] text-red-400">
              {errors.description}
            </span>
          )}
        </div>
      </div>

      {/* Explanatory Message & Submit Action */}
      <div className="mt-8 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-brand-muted leading-relaxed text-center sm:text-left max-w-sm">
          Your email application will open with your project details prepared. Please review and send to complete your inquiry.
        </p>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian bg-brand-neon hover:bg-[#2ED150] text-brand-obsidian shadow-[0_0_20px_rgba(53,232,91,0.35)] hover:shadow-[0_0_28px_rgba(53,232,91,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <span>TRANSMIT INQUIRY ↗</span>
        </button>
      </div>
    </form>
  );
}
