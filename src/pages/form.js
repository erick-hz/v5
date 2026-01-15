import React, { useState, useCallback, useMemo } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';

// Constants
const FORM_SUBMIT_URL = 'https://formsubmit.co/ajax/yerickk8@gmail.com';

// Regex to detect URLs in text
const URL_PATTERN =
  /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|net|org|io|dev|app|co|me|info|biz|xyz|online|site))/gi;

// Regex to detect potentially dangerous HTML/Script tags
const XSS_PATTERN = /<script|<iframe|javascript:|onerror=|onload=/gi;

// Spam keywords detection
const SPAM_KEYWORDS = /\b(viagra|casino|lottery|prize|winner|click here|buy now|limited offer)\b/gi;

const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    noUrls: true,
    noXss: true,
    messages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name must be less than 50 characters',
      pattern: 'Name can only contain letters',
      noUrls: 'URLs are not allowed in this field',
      noXss: 'Invalid characters detected',
    },
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      maxLength: 'Email is too long',
      pattern: 'Please enter a valid email',
    },
  },
  reason: {
    required: true,
    minLength: 10,
    maxLength: 500,
    noUrls: true,
    noXss: true,
    noSpam: true,
    messages: {
      required: 'Message is required',
      minLength: 'Message must be at least 10 characters',
      maxLength: 'Message must be less than 500 characters',
      noUrls: 'URLs are not allowed in messages',
      noXss: 'Invalid characters detected',
      noSpam: 'Spam content detected',
    },
  },
};

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  reason: '',
  emoji: '',
};

const STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
};

const StyledFormSection = styled.section`
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 20px;

  @media (max-width: 768px) {
    padding: 80px 20px 60px;
  }

  @media (max-width: 480px) {
    padding: 100px 15px 40px;
  }

  h1 {
    font-size: clamp(32px, 5vw, 60px);
    color: var(--lightest-slate);
    margin-bottom: 20px;
    margin-top: 0;

    @media (max-width: 480px) {
      font-size: clamp(28px, 7vw, 40px);
      margin-bottom: 15px;
      margin-top: 20px;
      line-height: 1.2;
    }
  }

  .subtitle {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;
    margin-bottom: 40px;
    line-height: 1.5;

    @media (max-width: 480px) {
      font-size: var(--fz-sm);
      margin-bottom: 30px;
      line-height: 1.6;
    }
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 480px) {
    gap: 20px;
  }

  .honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (max-width: 480px) {
      gap: 8px;
    }

    label {
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      display: flex;
      align-items: center;
      gap: 5px;

      @media (max-width: 480px) {
        font-size: var(--fz-xs);
      }

      .required {
        color: var(--green);
      }
    }

    input,
    textarea {
      background-color: var(--light-navy);
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      color: var(--lightest-slate);
      font-family: var(--font-sans);
      font-size: var(--fz-lg);
      padding: 15px 20px;
      transition: var(--transition);
      width: 100%;
      box-sizing: border-box;

      @media (max-width: 768px) {
        font-size: var(--fz-md);
        padding: 12px 16px;
      }

      @media (max-width: 480px) {
        font-size: var(--fz-sm);
        padding: 10px 14px;
      }

      &:focus {
        outline: none;
        border-color: var(--green);
        box-shadow: 0 0 0 3px var(--green-tint);
      }

      &::placeholder {
        color: var(--slate);
      }
    }

    textarea {
      resize: vertical;
      min-height: 150px;

      @media (max-width: 480px) {
        min-height: 120px;
      }
    }

    .emoji-input {
      font-size: 24px;
      text-align: center;
      padding: 10px;

      @media (max-width: 480px) {
        font-size: 20px;
        padding: 8px;
      }
    }

    .emoji-hint {
      color: var(--slate);
      font-size: var(--fz-xs);
      font-style: italic;

      @media (max-width: 480px) {
        font-size: var(--fz-xxs);
      }
    }

    .field-error {
      color: var(--pink);
      font-size: var(--fz-xs);
      font-family: var(--font-mono);
      margin-top: -5px;
      animation: slideDown 0.3s ease-out;

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    &.has-error {
      input,
      textarea {
        border-color: var(--pink);

        &:focus {
          box-shadow: 0 0 0 3px rgba(245, 125, 255, 0.1);
        }
      }
    }
  }

  .submit-button {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 20px;
    cursor: pointer;
    border: none;
    font-family: var(--font-mono);
    transition: var(--transition);
    width: 100%;

    @media (max-width: 480px) {
      margin-top: 15px;
      padding: 12px 20px;
      font-size: var(--fz-sm);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px -15px var(--green-tint);
    }

    @media (max-width: 480px) {
      &:not(:disabled):hover {
        transform: translateY(-2px);
      }
    }
  }

  .success-message {
    padding: 20px;
    background-color: var(--green-tint);
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    color: var(--green);
    text-align: center;
    font-family: var(--font-mono);

    @media (max-width: 480px) {
      padding: 15px;
      font-size: var(--fz-sm);
    }
  }

  .error-message {
    padding: 20px;
    background-color: rgba(245, 125, 255, 0.1);
    border: 1px solid var(--pink);
    border-radius: var(--border-radius);
    color: var(--pink);
    text-align: center;
    font-family: var(--font-mono);

    @media (max-width: 480px) {
      padding: 15px;
      font-size: var(--fz-sm);
    }
  }
`;

const FormPage = ({ location }) => {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);

  // Memoized validation function
  const validateField = useCallback((name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) {
      return '';
    }

    const trimmedValue = value.trim();

    if (rules.required && !trimmedValue) {
      return rules.messages.required;
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return rules.messages.maxLength;
    }

    if (rules.noXss && XSS_PATTERN.test(trimmedValue)) {
      return rules.messages.noXss;
    }

    if (rules.noUrls && URL_PATTERN.test(trimmedValue)) {
      return rules.messages.noUrls;
    }

    if (rules.noSpam && SPAM_KEYWORDS.test(trimmedValue)) {
      return rules.messages.noSpam;
    }

    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.messages.minLength;
    }

    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      return rules.messages.pattern;
    }

    return '';
  }, []);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const requiredFields = ['name', 'email', 'reason'];
    return (
      requiredFields.every(field => formState[field].trim()) &&
      Object.values(errors).every(error => !error)
    );
  }, [formState, errors]);

  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    e => {
      const { name, value } = e.target;
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField],
  );

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      // Validate all fields
      const requiredFields = ['name', 'email', 'reason'];
      const newErrors = {};
      const newTouched = {};

      requiredFields.forEach(field => {
        newErrors[field] = validateField(field, formState[field]);
        newTouched[field] = true;
      });

      setErrors(newErrors);
      setTouched(newTouched);

      // Check for errors
      if (Object.values(newErrors).some(error => error)) {
        return;
      }

      setStatus(STATUS.SUBMITTING);

      try {
        // Timeout controller for fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(FORM_SUBMIT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formState.name.trim(),
            email: formState.email.trim(),
            reason: formState.reason.trim(),
            emoji: formState.emoji || 'No emoji',
            _captcha: 'true',
            _subject: 'New Contact Form Submission',
            _template: 'table',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus(STATUS.SUCCESS);
          setFormState(INITIAL_FORM_STATE);
          setErrors({});
          setTouched({});
        } else {
          setStatus(STATUS.ERROR);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Form submission timeout');
        } else {
          console.error('Form submission error:', error);
        }
        setStatus(STATUS.ERROR);
      }
    },
    [formState, validateField],
  );

  return (
    <Layout location={location}>
      <StyledFormSection>
        <h1>Get In Touch</h1>
        <p className="subtitle">Let's connect! Fill out the form below.</p>

        <StyledForm onSubmit={handleSubmit}>
          {/* Honeypot field - hidden from users, catches bots */}
          <input type="text" name="_gotcha" className="honeypot" tabIndex="-1" autoComplete="off" />

          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your name"
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.reason ? 'has-error' : ''}`}>
            <label htmlFor="reason">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formState.reason}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell me about your project or just say hi!"
              required
            />
            {errors.reason && <span className="field-error">{errors.reason}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="emoji">
              Emoji (Optional)
              <span className="emoji-hint"> - Express yourself! 😊</span>
            </label>
            <input
              type="text"
              id="emoji"
              name="emoji"
              value={formState.emoji}
              onChange={handleChange}
              placeholder="😊"
              className="emoji-input"
              maxLength="2"
            />
          </div>

          {status === STATUS.SUCCESS && (
            <div className="success-message">
              ✓ Message sent successfully! I'll get back to you soon.
            </div>
          )}

          {status === STATUS.ERROR && (
            <div className="error-message">
              ✗ Something went wrong. Please try again or email me directly.
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={status === STATUS.SUBMITTING || !isFormValid}>
            {status === STATUS.SUBMITTING ? 'Sending...' : 'Send Message'}
          </button>
        </StyledForm>
      </StyledFormSection>
    </Layout>
  );
};

FormPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default FormPage;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
