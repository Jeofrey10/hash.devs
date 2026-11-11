import {
  InquiryFormData,
  FormErrors,
  buildFormInquiryMailto,
  buildInquiryBriefText,
} from './contactConfig';

/**
 * Validates RFC 5322 compliant email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates the essential inquiry form fields on the client without external services.
 */
export function validateInquiryForm(data: InquiryFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  const cleanName = data.name.trim();
  const cleanEmail = data.email.trim();
  const cleanDescription = data.description.trim();

  if (!cleanName) {
    errors.name = 'Your name is required.';
  } else if (cleanName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!cleanEmail) {
    errors.email = 'A valid work email is required.';
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = 'Please provide a valid work email (e.g., name@company.com).';
  }

  if (!cleanDescription) {
    errors.description = 'Please tell us about your project.';
  } else if (cleanDescription.length < 10) {
    errors.description = 'Please provide at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Constructs the client-side mailto URL and prepares the brief for dispatch.
 */
export function prepareEmailDispatch(data: InquiryFormData): {
  mailtoUrl: string;
  briefText: string;
  subject: string;
} {
  const mailtoUrl = buildFormInquiryMailto(data);
  const briefText = buildInquiryBriefText(data);
  const subject = `New Project Inquiry — HASH.DEVS`;

  return {
    mailtoUrl,
    briefText,
    subject,
  };
}
