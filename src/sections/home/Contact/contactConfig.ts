export interface InquiryFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  description: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  description?: string;
}

/**
 * Creative engineering project disciplines aligned with HASH.DEVS core capabilities.
 */
export const PROJECT_TYPES = [
  'Digital Product',
  'Website & Experience',
  'Branding & Identity',
  'AI & Automation',
  'Creative Technology',
  'Other',
] as const;

export const INITIAL_FORM_DATA: InquiryFormData = {
  name: '',
  email: '',
  company: '',
  projectType: 'Digital Product',
  description: '',
};

/**
 * Central studio phone constants.
 * Kept unpublished by default until the owner provides the verified number via VITE_STUDIO_PHONE.
 */
export const STUDIO_PHONE_NUMBER =
  import.meta.env.VITE_STUDIO_PHONE || null;
export const STUDIO_PHONE_DISPLAY =
  import.meta.env.VITE_STUDIO_PHONE_DISPLAY || STUDIO_PHONE_NUMBER;
export const STUDIO_PHONE_TEL = STUDIO_PHONE_NUMBER
  ? `tel:${STUDIO_PHONE_NUMBER.replace(/[^\d+]/g, '')}`
  : null;

/**
 * Verified studio contact channels and operational metadata.
 */
export const STUDIO_CONTACT_INFO = {
  email: 'hello@hash.devs',
  phone: STUDIO_PHONE_DISPLAY,
  phoneRaw: STUDIO_PHONE_NUMBER,
  phoneTel: STUDIO_PHONE_TEL,
  phoneHours: 'MON–FRI // 09:00–18:00 PST',
  responseGuarantee: 'RESPONSE WITHIN 24 HOURS',
};

/**
 * Constructs a genuine mailto: link for general direct studio inquiries with a professional pre-filled template.
 */
export function buildGeneralInquiryMailto(): string {
  const subject = 'Project Inquiry — HASH.DEVS';
  const body = [
    'Hello HASH.DEVS Team,',
    '',
    "I'm interested in discussing a potential project with your studio.",
    '',
    'Name:',
    'Company / Brand:',
    'Project Type:',
    'Project Overview:',
    '',
    "I'd love to discuss this opportunity further.",
    '',
    'Best regards,',
    '[Your Name]',
  ].join('\r\n');

  return `mailto:${STUDIO_CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Constructs a structured plain text brief from user-entered inquiry form values.
 */
export function buildInquiryBriefText(data: InquiryFormData): string {
  const companyText = data.company.trim() || 'Not specified';

  return [
    'Hello HASH.DEVS Team,',
    '',
    'Here is my project inquiry brief submitted via hash.devs:',
    '',
    '--- CLIENT DETAILS ---',
    `Name: ${data.name.trim()}`,
    `Work Email: ${data.email.trim()}`,
    `Company / Brand: ${companyText}`,
    '',
    '--- PROJECT SPECIFICATION ---',
    `Project Type: ${data.projectType}`,
    '',
    '--- PROJECT OVERVIEW ---',
    data.description.trim(),
    '',
    '---',
    'Transmitted via HASH.DEVS Project Initiation',
    `Timestamp: ${new Date().toISOString()}`,
  ].join('\r\n');
}

/**
 * Constructs a genuine mailto: link containing the structured project inquiry brief.
 */
export function buildFormInquiryMailto(data: InquiryFormData): string {
  const subject = `New Project Inquiry — HASH.DEVS`;
  const body = buildInquiryBriefText(data);

  return `mailto:${STUDIO_CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const CONTACT_COPY = {
  identifier: '07 // PROJECT INITIATION',
  index: '07',
  headline: {
    line1: "LET'S BUILD",
    line2: 'SOMETHING',
    line3: 'EXCEPTIONAL.',
  },
  supporting:
    'We collaborate with ambitious founders, brands, and enterprise teams to engineer distinctive digital products, intelligent systems, and immersive web experiences.',
  manifesto: 'AMBITIOUS IDEAS DEMAND UNCOMPROMISING ENGINEERING.',
};
