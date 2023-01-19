let verificationCode;
const users = [];
const name = document.getElementById("name");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const pass = document.getElementById("password");
const rePass = document.getElementById("repassword");
const address = document.getElementById("address");
const image = document.getElementById("image");
const checkbox = document.getElementById("checkbox");
const otp = document.getElementById("otp");
const logEmail = document.getElementById("logEmail");
const logPassword = document.getElementById("logPassword");

const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
const toolTip1 = document.getElementsByClassName("tooltiptext")[0];
const toolTip2 = document.getElementsByClassName("tooltiptext")[1];
const modal = document.getElementById("modal");
const loginModal = document.querySelector(".loginModal");
const loginClose = document.querySelector(".close");
const signUp = document.getElementById("signup");
const otpModal = document.getElementById("otpModal");
const otpClose = document.querySelectorAll(".close")[1];
const otpVerify = document.getElementById("verify");
const logIn = document.getElementById("login");
const resend = document.querySelector(".resend");

function matchPassword() {
	if(!pass.value.match(validPassword)) {
		toolTip1.style.visibility = "visible";
		} else {
		toolTip1.style.visibility = "hidden";
	}
}

function matchRePass() {
	if(pass.value.length > 0 && rePass.value === pass.value) {
		toolTip2.style.visibility = "hidden";
		} else {
		toolTip2.style.visibility = "visible";
	}
}

function sendEmail(code) {
	emailjs.init("Aa82slTOn5_ej9X7q");
	emailjs.send("service_l7kxuwe", "template_ud2jsee", {to_email: email.value, to_name: name.value, message_html: code})
	.then(function(response) {
		console.log("Email successfully sent!");
		}, function(error) {
		console.log("Error sending email:", error);
	});
}

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
	}
}

signUp.onclick = (e) => {
	if(email.value.match(validEmail)) {
		if(pass.value.match(validPassword)) {
			if(rePass.value === pass.value) {
				if(address.value) {
					if(image.value) {
						if(checkbox.checked) {
							e.preventDefault();
							otpModal.style.display = "block";
							verificationCode = Math.random().toString(36).slice(-6);
							sendEmail(verificationCode);
							otpVerify.addEventListener("click", (e) => {
								if(otp.value) {
									if(otp.value === verificationCode) {
										e.preventDefault();
										let imageFile = image.files[0];
										let reader = new FileReader();
										reader.readAsDataURL(imageFile);
										reader.addEventListener('load', () => {
											let user = {
												id: Date.now(),
												name: name.value,
												dob: dob.value,
												email: email.value,
												phone: phone.value,
												password: pass.value,
												address: address.value,
												image: image.value,
											};
											users.push(user);
											localStorage.setItem('users', JSON.stringify(users));
											window.location.href = "puzzle.html";
										});
										} else {
										otp.setCustomValidity('Incorrect otp');
									}
									} else {
									otp.setCustomValidity('Otp required');
								}
							});
							} else {
							checkbox.setCustomValidity('Agree to terms and condition');
						}
						} else {
						image.setCustomValidity('Upload the image');
					}
					} else {
					address.setCustomValidity('Address is required');
				}
				} else {
				rePass.setCustomValidity('Password did not match');
			}
			} else {
			pass.setCustomValidity('Match the format');
		}
		} else {
		email.setCustomValidity('Invalid email format');
	}
};

logIn.onclick = (e) => {
	const user = users.find(user => user.email == logEmail.value);
	if(user) {
		if(logPassword.value == user.password) {
			e.preventDefault();
			window.location.href = "puzzle.html";
			} else {
			logPassword.setCustomValidity('Password did not match');
		}
		} else {
		logEmail.setCustomValidity('Email not found');
	}
}

// Login Modal
loginModal.onclick = function() {
	modal.style.display = "block";
}
loginClose.onclick = function() {
	modal.style.display = "none";
}

// Otp Modal
otpClose.onclick = function() {
	otpModal.style.display = "none";
}

resend.onclick = function() {
	verificationCode = Math.random().toString(36).slice(-6);
	sendEmail(verificationCode);
}

window.onclick = function(event) {
	if (event.target == modal || event.target == otpModal) {
		modal.style.display = "none";
		otpModal.style.display = "none";
	}
}

window.onkeydown = function(event) {
	if (event.key == "Escape") {
		modal.style.display = "none";
		otpModal.style.display = "none";
	}
}

restoreFromLocalStorage();
