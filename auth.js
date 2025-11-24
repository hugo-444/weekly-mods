/**
 * Arabic Foundations — Auth UI (Frontend only)
 * Handles screen toggles, validation, password helpers, and fake submission feedback.
 */

const AuthUI = (() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRules = [
    { key: 'length', label: '8+ characters', test: value => value.length >= 8 },
    { key: 'case', label: 'upper and lower case', test: value => /[a-z]/.test(value) && /[A-Z]/.test(value) },
    { key: 'number', label: 'a number', test: value => /\d/.test(value) },
    { key: 'special', label: 'a special character', test: value => /[^A-Za-z0-9]/.test(value) }
  ];

  const state = {
    activeScreen: 'login',
    lastResetEmail: '',
    accountName: 'new learner'
  };

  const elements = {
    screens: [],
    tabs: [],
    forms: {},
    strengthBar: null,
    strengthLabel: null,
    passwordHints: [],
    resetEmailTargets: [],
    accountNameTargets: []
  };

  function init() {
    cacheElements();
    bindTabClicks();
    bindLinkClicks();
    bindPasswordToggles();
    bindForms();
    bindValidationHandlers();
    showScreen('login');
    updateStrengthMeter(0);
    updatePasswordHints({});
    updateFormButtons();
  }

  function cacheElements() {
    elements.screens = Array.from(document.querySelectorAll('[data-auth-screen]'));
    elements.tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
    elements.forms = {
      login: document.getElementById('loginForm'),
      signup: document.getElementById('signupForm'),
      forgot: document.getElementById('forgotForm')
    };
    elements.strengthBar = document.querySelector('[data-strength-bar]');
    elements.strengthLabel = document.querySelector('[data-strength-label]');
    elements.passwordHints = Array.from(document.querySelectorAll('[data-password-rule]'));
    elements.resetEmailTargets = Array.from(document.querySelectorAll('[data-reset-email]'));
    elements.accountNameTargets = Array.from(document.querySelectorAll('[data-account-name]'));
  }

  function bindTabClicks() {
    elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.authTab;
        if (target) {
          showScreen(target);
        }
      });
    });
  }

  function bindLinkClicks() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-auth-link]');
      if (!trigger) {
        return;
      }

      event.preventDefault();
      const target = trigger.dataset.authLink;
      if (target) {
        showScreen(target);
      }
    });
  }

  function bindPasswordToggles() {
    document.querySelectorAll('[data-password-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('aria-controls');
        const input = document.getElementById(targetId);
        if (!input) {
          return;
        }
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.setAttribute('aria-pressed', String(isPassword));
        button.textContent = isPassword ? 'Hide' : 'Show';
      });
    });
  }

  function bindForms() {
    if (elements.forms.login) {
      attachFormHandler(elements.forms.login, handleLoginSuccess);
    }
    if (elements.forms.signup) {
      attachFormHandler(elements.forms.signup, handleSignupSuccess);
    }
    if (elements.forms.forgot) {
      attachFormHandler(elements.forms.forgot, handleForgotSuccess);
    }
  }

  function attachFormHandler(form, onSuccess) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        revealInvalidFields(form);
        updateFormButtons(form);
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      setLoading(submitBtn, true);

      window.setTimeout(() => {
        setLoading(submitBtn, false);
        onSuccess(form);
        updateFormButtons(form);
      }, 900);
    });
  }

  function handleLoginSuccess(form) {
    const emailField = form.querySelector('[name="email"]');
    const email = emailField ? emailField.value.trim() : '';
    
    // Mock role assignment based on email (for demo purposes)
    // In production, this would come from backend
    let role = 'user';
    if (email.includes('admin') || email === 'admin@arabic.one') {
      role = 'admin';
    } else if (email.includes('premium') || email.includes('pro')) {
      role = email.includes('pro') ? 'pro' : 'premium';
    }
    
    // Save auth state to localStorage
    const authData = {
      loggedIn: true,
      role: role,
      email: email,
      name: email.split('@')[0] // Simple name extraction
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    
    showAlert('login', `Signed in as ${role}. Redirecting...`, 'success');
    form.reset();
    resetFormState(form);
    
    // Redirect based on role
    setTimeout(() => {
      if (role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 1000);
  }

  function handleSignupSuccess(form) {
    const nameField = form.querySelector('[name="fullName"]');
    const emailField = form.querySelector('[name="email"]');
    const name = nameField ? nameField.value.trim() : '';
    const email = emailField ? emailField.value.trim() : '';
    
    state.accountName = extractFirstName(name) || 'new learner';
    updateAccountNameTargets();
    
    // Save auth state (defaults to 'user' role for new signups)
    const authData = {
      loggedIn: true,
      role: 'user',
      email: email,
      name: name || state.accountName
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    
    form.reset();
    resetFormState(form);
    updatePasswordHints({});
    updateStrengthMeter(0);
    showScreen('signup-success');
  }

  function handleForgotSuccess(form) {
    const emailField = form.querySelector('[name="email"]');
    state.lastResetEmail = emailField ? emailField.value.trim() : '';
    updateResetEmailTargets();
    form.reset();
    resetFormState(form);
    showScreen('reset-confirm');
  }

  function bindValidationHandlers() {
    document.addEventListener('input', event => {
      if (!isAuthInput(event.target)) {
        return;
      }
      runValidation(event.target);
      updateFormButtons(event.target.form);
    }, true);

    document.addEventListener('change', event => {
      if (!isAuthInput(event.target)) {
        return;
      }
      runValidation(event.target, { force: true });
      updateFormButtons(event.target.form);
    }, true);

    document.addEventListener('blur', event => {
      if (!isAuthInput(event.target)) {
        return;
      }
      runValidation(event.target, { force: true });
      updateFormButtons(event.target.form);
    }, true);
  }

  function isAuthInput(target) {
    return target instanceof HTMLInputElement && Boolean(target.closest('.auth-form'));
  }

  function runValidation(input, { force = false } = {}) {
    const rule = input.dataset.validate;
    if (!rule) {
      return;
    }

    const trimmedValue = input.value.trim();
    const shouldShow = force || trimmedValue.length > 0;
    let result;

    switch (rule) {
      case 'email':
        result = validateEmail(trimmedValue);
        break;
      case 'password':
        result = validateStrongPassword(input.value);
        break;
      case 'password-basic':
        result = validateBasicPassword(trimmedValue);
        break;
      case 'confirm':
        result = validateConfirmPassword(input);
        break;
      case 'text':
        result = validateText(trimmedValue);
        break;
      default:
        result = { isValid: true, message: '' };
        break;
    }

    if (rule === 'password' && result) {
      updateStrengthMeter(result.score || 0);
      updatePasswordHints(result.matches || {});
      revalidateConfirmField();
    }

    if (!shouldShow) {
      clearGroupState(input);
      return;
    }

    applyGroupState(input, {
      isValid: result?.isValid ?? true,
      message: result?.message || '',
      showState: true
    });
  }

  function revalidateConfirmField() {
    const confirmField = document.querySelector('[data-validate="confirm"]');
    if (confirmField && confirmField.value) {
      runValidation(confirmField, { force: true });
    }
  }

  function validateEmail(value) {
    if (!value) {
      return { isValid: false, message: 'Email is required.' };
    }
    if (!emailPattern.test(value)) {
      return { isValid: false, message: 'Use a valid email like learner@example.com.' };
    }
    return { isValid: true, message: 'Looks good.' };
  }

  function validateStrongPassword(value) {
    const matches = {};
    let score = 0;

    passwordRules.forEach(rule => {
      const passed = rule.test(value);
      matches[rule.key] = passed;
      if (passed) {
        score += 1;
      }
    });

    if (!value) {
      return { isValid: false, message: 'Password is required.', matches, score };
    }

    const missing = passwordRules
      .filter(rule => !matches[rule.key])
      .map(rule => rule.label);

    return {
      isValid: missing.length === 0,
      message: missing.length === 0 ? 'Strong password ready.' : `Add ${missing.join(', ')}.`,
      matches,
      score
    };
  }

  function validateBasicPassword(value) {
    if (!value) {
      return { isValid: false, message: 'Password is required.' };
    }
    if (value.length < 4) {
      return { isValid: false, message: 'Password must be at least 4 characters.' };
    }
    return { isValid: true, message: '' };
  }

  function validateConfirmPassword(input) {
    const targetId = input.dataset.confirmTarget;
    const passwordField = document.getElementById(targetId);
    const passwordValue = passwordField ? passwordField.value : '';
    const value = input.value;

    if (!value) {
      return { isValid: false, message: 'Confirm your password.' };
    }
    if (value !== passwordValue) {
      return { isValid: false, message: 'Passwords must match exactly.' };
    }
    return { isValid: true, message: 'Passwords match.' };
  }

  function validateText(value) {
    if (!value) {
      return { isValid: false, message: 'This field is required.' };
    }
    if (value.length < 2) {
      return { isValid: false, message: 'Please enter at least two characters.' };
    }
    return { isValid: true, message: '' };
  }

  function applyGroupState(input, { isValid, message, showState }) {
    const group = input.closest('.input-group');
    if (!group) {
      return;
    }

    const msg = group.querySelector('.validation-message');
    group.classList.toggle('is-valid', Boolean(showState && isValid));
    group.classList.toggle('is-invalid', Boolean(showState && !isValid));

    if (msg) {
      msg.textContent = showState ? message : '';
    }

    input.setCustomValidity(isValid ? '' : message || 'Invalid value.');
    input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
  }

  function clearGroupState(input) {
    const group = input.closest('.input-group');
    if (!group) {
      return;
    }
    group.classList.remove('is-valid', 'is-invalid');
    const msg = group.querySelector('.validation-message');
    if (msg) {
      msg.textContent = '';
    }
    input.setCustomValidity('');
    input.setAttribute('aria-invalid', 'false');
  }

  function revealInvalidFields(form) {
    Array.from(form.querySelectorAll('input')).forEach(input => {
      runValidation(input, { force: true });
    });
  }

  function updateStrengthMeter(score) {
    if (!elements.strengthBar || !elements.strengthLabel) {
      return;
    }
    const percent = Math.min(100, Math.max(0, (score / passwordRules.length) * 100));
    elements.strengthBar.style.width = `${percent}%`;
    const rootStyles = getComputedStyle(document.documentElement);
    const weak = rootStyles.getPropertyValue('--accent-danger').trim();
    const medium = rootStyles.getPropertyValue('--accent-highlight').trim();
    const strong = rootStyles.getPropertyValue('--accent-success').trim();

    let color = weak;
    if (score >= passwordRules.length) {
      color = strong;
    } else if (score >= 2) {
      color = medium;
    }
    elements.strengthBar.style.background = color;

    const labels = [
      'Add at least 8 characters.',
      'Add uppercase and lowercase letters.',
      'Add a number or special character.',
      'Almost there — include any missing rule.',
      'Strong password ready.'
    ];
    elements.strengthLabel.textContent = labels[Math.min(score, labels.length - 1)];
  }

  function updatePasswordHints(matches) {
    elements.passwordHints.forEach(item => {
      const key = item.dataset.passwordRule;
      item.classList.toggle('is-met', Boolean(matches && matches[key]));
    });
  }

  function setLoading(button, isLoading) {
    if (!button) {
      return;
    }
    if (isLoading) {
      button.dataset.originalText = button.dataset.originalText || button.textContent.trim();
      button.textContent = button.dataset.loadingText || 'Working...';
      button.classList.add('is-loading');
      button.dataset.authLoading = 'true';
      button.disabled = true;
    } else {
      button.classList.remove('is-loading');
      button.dataset.authLoading = '';
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }

  function updateFormButtons(targetForm) {
    const forms = targetForm ? [targetForm] : Object.values(elements.forms).filter(Boolean);
    forms.forEach(form => {
      const submitBtn = form.querySelector('[type="submit"]');
      if (!submitBtn || submitBtn.dataset.authLoading === 'true') {
        return;
      }
      submitBtn.disabled = !form.checkValidity();
    });
  }

  function showAlert(name, message, variant = 'success', silent = false) {
    const alert = document.querySelector(`[data-form-alert="${name}"]`);
    if (!alert) {
      return;
    }

    alert.classList.remove('is-success', 'is-error');
    alert.hidden = !message;

    if (!message || silent) {
      alert.textContent = '';
      return;
    }

    alert.textContent = message;
    alert.classList.add(variant === 'error' ? 'is-error' : 'is-success');
  }

  function resetFormState(form) {
    form.querySelectorAll('input').forEach(input => {
      input.setCustomValidity('');
      input.setAttribute('aria-invalid', 'false');
      clearGroupState(input);
    });
  }

  function showScreen(name) {
    const normalized = normalizeScreenName(name);
    state.activeScreen = normalized;

    elements.screens.forEach(screen => {
      const isActive = screen.dataset.authScreen === normalized;
      screen.classList.toggle('is-active', isActive);
    });

    const isTabScreen = normalized === 'login' || normalized === 'signup';
    elements.tabs.forEach(tab => {
      const match = tab.dataset.authTab === normalized;
      tab.classList.toggle('is-active', Boolean(match && isTabScreen));
      tab.setAttribute('aria-selected', match && isTabScreen ? 'true' : 'false');
    });

    if (!isTabScreen) {
      elements.tabs.forEach(tab => tab.classList.remove('is-active'));
    }

    if (normalized !== 'login') {
      showAlert('login', '', 'success', true);
    }

    const targetForm = normalized === 'login'
      ? elements.forms.login
      : normalized === 'signup'
        ? elements.forms.signup
        : normalized === 'forgot'
          ? elements.forms.forgot
          : null;
    if (targetForm) {
      updateFormButtons(targetForm);
    }
  }

  function normalizeScreenName(name) {
    if (name === 'reset' || name === 'reset-confirm') {
      return 'reset-confirm';
    }
    if (name === 'signup-success') {
      return 'signup-success';
    }
    if (name === 'forgot') {
      return 'forgot';
    }
    if (name === 'signup') {
      return 'signup';
    }
    return 'login';
  }

  function updateResetEmailTargets() {
    elements.resetEmailTargets.forEach(target => {
      target.textContent = state.lastResetEmail || 'you@example.com';
    });
  }

  function updateAccountNameTargets() {
    elements.accountNameTargets.forEach(target => {
      target.textContent = state.accountName;
    });
  }

  function extractFirstName(value) {
    return value.trim().split(' ')[0];
  }

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AuthUI.init();
});

