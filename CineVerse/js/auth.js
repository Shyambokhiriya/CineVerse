document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(!loginForm.checkValidity()) { loginForm.classList.add('was-validated'); return; }
            
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            const user = users.find(u => u.email === email && u.password === pass);
            if(user) {
                if(user.status !== 'Active') { alert('Account disabled.'); return; }
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = user.role === 'admin' ? 'admin/dashboard.html' : 'index.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('regPassword').value;
            const confirmPass = document.getElementById('regConfirmPassword').value;
            
            const confirmInput = document.getElementById('regConfirmPassword');
            if (pass !== confirmPass) confirmInput.setCustomValidity('Passwords do not match');
            else confirmInput.setCustomValidity('');

            if(!registerForm.checkValidity()) { registerForm.classList.add('was-validated'); return; }

            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if(users.some(u => u.email === email)) { alert('Email already registered.'); return; }

            users.push({ id: Date.now(), name, email, password: pass, role: 'user', status: 'Active', date: new Date().toISOString().split('T')[0] });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please log in.');
            document.getElementById('login-tab').click();
            registerForm.reset();
            registerForm.classList.remove('was-validated');
        });
    }
});