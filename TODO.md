# TODO List

## Security Implementation Plan

### Step 1: Install Dependencies
- [ ] Install bcryptjs for password hashing
- [ ] Install jsonwebtoken for JWT authentication

### Step 2: Update server.js
- [ ] Add bcryptjs for password hashing
- [ ] Add JWT token generation
- [ ] Update signup endpoint to hash passwords
- [ ] Update login endpoint to compare hashed passwords and generate JWT

### Step 3: Update login.html
- [ ] Handle JWT tokens in login form
- [ ] Store JWT in localStorage securely

### Step 4: Update script.js
- [ ] Handle JWT tokens in user authentication
- [ ] Update cart sync to use JWT

### Step 5: Security Improvements
- [ ] Ensure .env is in .gitignore
- [ ] Add input validation
