// Authentication page (Login/Signup)
const AuthPage = {
  _mode: 'login', // login or signup

  render() {
    Component.mount(`
      <div class="auth-page">
        <div class="auth-container">
          <div class="auth-header">
            <div class="auth-logo">📚</div>
            <h1 class="auth-title text-gradient">ATAR Study Platform</h1>
            <p class="auth-subtitle">Your all-in-one companion for Year 11 & 12 success</p>
          </div>
          <div class="auth-card" id="authCard">
            ${this._mode === 'login' ? this._loginForm() : this._signupForm()}
          </div>
        </div>
      </div>
    `);
  },

  _loginForm() {
    return `
      <h2 style="margin-bottom:20px">Welcome back</h2>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="loginEmail" placeholder="your@email.com" value="student@atar.edu.au">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="loginPassword" placeholder="Enter password" value="password123">
      </div>
      <button class="btn btn-primary w-full btn-lg" onclick="AuthPage.login()" style="margin-top:8px">
        Sign In
      </button>
      <div class="auth-footer">
        Don't have an account? <span class="auth-link" onclick="AuthPage.switchMode('signup')">Sign up</span>
      </div>
    `;
  },

  _signupForm() {
    return `
      <h2 style="margin-bottom:20px">Create your account</h2>
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" id="signupName" placeholder="Your name">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="signupEmail" placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="signupPassword" placeholder="Create a password">
      </div>
      <div class="form-group">
        <label class="form-label">Year Level</label>
        <select class="form-select" id="signupYear">
          <option value="11">Year 11</option>
          <option value="12" selected>Year 12</option>
        </select>
      </div>
      <button class="btn btn-primary w-full btn-lg" onclick="AuthPage.signup()" style="margin-top:8px">
        Create Account
      </button>
      <div class="auth-footer">
        Already have an account? <span class="auth-link" onclick="AuthPage.switchMode('login')">Sign in</span>
      </div>
    `;
  },

  switchMode(mode) {
    this._mode = mode;
    const card = document.getElementById('authCard');
    if (card) {
      card.innerHTML = mode === 'login' ? this._loginForm() : this._signupForm();
    }
  },

  login() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      Component.toast('Please fill in all fields', 'error');
      return;
    }

    // Mock login
    Store.update({
      isAuthenticated: true,
      user: {
        name: 'Alex Student',
        email: email,
        yearLevel: 12,
        avatar: null,
        joinDate: new Date().toISOString(),
      }
    });

    if (!Store.get('onboardingComplete')) {
      Storage.initializeDefaults();
      Router.navigate('/onboarding');
    } else {
      Storage.initializeDefaults();
      Router.navigate('/dashboard');
    }

    Component.toast('Welcome back!', 'success');
  },

  signup() {
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const year = document.getElementById('signupYear')?.value;

    if (!name || !email || !password) {
      Component.toast('Please fill in all fields', 'error');
      return;
    }

    Store.update({
      isAuthenticated: true,
      user: {
        name: name,
        email: email,
        yearLevel: parseInt(year),
        avatar: null,
        joinDate: new Date().toISOString(),
      }
    });

    Storage.initializeDefaults();
    Router.navigate('/onboarding');
    Component.toast('Account created! Let\'s set up your profile.', 'success');
  }
};
