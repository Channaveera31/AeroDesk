// ===== US006 – External JS: AeroDesk Registration =====

const registrationForm = document.getElementById("registrationForm");
const resetBtn         = document.getElementById("resetBtn");

function setError(id, msg) { document.getElementById("err-" + id).textContent = msg; }
function clearAllErrors()  {
  ["firstName","lastName","dob","email","address","contact"].forEach(id => setError(id,""));
}

function generatePassengerId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// US004: Password = first 4 letters of FirstName + @123
function generatePassword(firstName) {
  return firstName.substring(0, 4) + "@123";
}

// ===== SUBMIT =====
registrationForm.addEventListener("submit", function(e) {
  e.preventDefault();
  clearAllErrors();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const dob       = document.getElementById("dob").value;
  const email     = document.getElementById("email").value.trim();
  const address   = document.getElementById("address").value.trim();
  const contact   = document.getElementById("contact").value.trim();

  let hasError = false;

  // US006 – 1) All fields mandatory
  if (!firstName) { setError("firstName", "First Name is required.");    hasError = true; }
  if (!lastName)  { setError("lastName",  "Last Name is required.");     hasError = true; }
  if (!dob)       { setError("dob",       "Date of Birth is required."); hasError = true; }
  if (!email)     { setError("email",     "Email ID is required.");      hasError = true; }
  if (!address)   { setError("address",   "Address is required.");       hasError = true; }
  if (!contact)   { setError("contact",   "Contact Number is required."); hasError = true; }

  // US006 – 2) DOB > 1/1/1924 (exact error message)
  if (dob) {
    if (new Date(dob) <= new Date("1924-01-01")) {
      setError("dob", "Choose a date greater than 1/1/1924");
      hasError = true;
    }
  }

  // US006 – 3) Contact: exactly 10 digits (exact error message)
  if (contact && !/^\d{10}$/.test(contact)) {
    setError("contact", "Enter a valid contact number");
    hasError = true;
  }

  // US006 – 4) Email format check (exact error message)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "Enter a valid mail id");
    hasError = true;
  }

  if (hasError) return;

  // All valid → show acknowledgement
  const passengerId = generatePassengerId();
  const password    = generatePassword(firstName);

  document.getElementById("ackPassengerId").textContent = passengerId;
  document.getElementById("ackFirstName").textContent   = firstName;
  document.getElementById("ackLastName").textContent    = lastName;
  document.getElementById("ackDob").textContent         = dob;
  document.getElementById("ackEmail").textContent       = email;
  document.getElementById("ackContact").textContent     = contact;
  document.getElementById("ackPassword").textContent    = password;

  sessionStorage.setItem("loggedInUser", passengerId);
  sessionStorage.setItem("passengerName", firstName + " " + lastName);
  sessionStorage.setItem("passengerData", JSON.stringify({
    passengerId, firstName, lastName, dob, email, address, contact, password
  }));

  document.getElementById("regForm").style.display   = "none";
  document.getElementById("ackScreen").style.display = "block";
});

// US006 – 5) Reset with exact confirmation text
resetBtn.addEventListener("click", function() {
  if (confirm("Is it Okay to reset the fields?")) {
    registrationForm.reset();
    clearAllErrors();
  }
});