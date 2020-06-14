function register() {
    var loginElem = document.getElementById("vt-login-form");
    loginElem.style.display = "none";
    var registerElem = document.getElementById("vt-register-form");
    registerElem.style.display = "flex";
}

function login() {
    var registerElem = document.getElementById("vt-register-form");
    registerElem.style.display = "none";
    var loginElem = document.getElementById("vt-login-form");
    loginElem.style.display = "flex";
}

function sendLogin() {
    var email = document.getElementById("email").value;
    var pwd = document.getElementById("password").value;
    var requestObject = {
        "email": email,
        "password": pwd
    };
    var reqLogin = fetch(window.location.origin + '/login', {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
        if (!res.ok) {
            document.getElementById("vt-form-container").style.display = "flex";
            document.getElementById("container-main-others").style.display = "none";
            document.getElementById("container-main").style.display = "none";
        } else {
            document.getElementById("vt-form-container").style.display = "none";
            //document.getElementById("container-main-others").style.display = "none";
            document.getElementById("container-main").style.display = "flex";
            document.getElementById("container-main").style.flexDirection = "column";
            generateCalendar();
        }
        return res.json();
    }).then((res) => {
       if(res.id) {
          sessionStorage.setItem('userid', res.id);
       }
    }).catch((err) => {
        document.getElementById("vt-form-container").style.display = "flex";
        document.getElementById("container-main-others").style.display = "none";
        document.getElementById("container-main").style.display = "none";
    });

    reqLogin.then((resp) => {
        console.log(resp);
    })
}

function sendRegister() {
    var name = document.getElementById("reg-name").value;
    var email = document.getElementById("reg-email").value;
    var pwd = document.getElementById("reg-orig-password").value;
    var requestObject = {
        "name": name,
        "email": email,
        "password": pwd
    };
    fetch(window.location.origin + '/users', {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
        if (!res.ok) {
            alert('Authentication failed.');
        } else {
            document.getElementById("reg-name").value= "";
            document.getElementById("reg-email").value = "";
            document.getElementById("reg-orig-password").value = "";
            document.getElementById("reg-conf-password").value = "";
            alert('Registration successfull. Now you can login.');
        }
    }).catch((err) => {
    });
}

function validatepassword() {
    var pwd = document.getElementById("reg-orig-password").value;
    var confPwd = document.getElementById("reg-conf-password").value;
    if(pwd === confPwd) {
        document.getElementById("pwd-error").innerText = "";
        document.getElementById("register-btn").disabled = false;
    } else {
        document.getElementById("pwd-error").innerText = "Password mismatch. Registration will not be allowed";
        document.getElementById("register-btn").disabled = true;
    }
}

function getTimeSlots() {
    var x = {
        nextSlot: 60,
        startTime: '9:00',
        endTime: '19:00'
    };
    var slotTime = moment(x.startTime, "HH:mm");
    var endTime = moment(x.endTime, "HH:mm");
    var times = [];
    while (slotTime < endTime) {
        times.push(slotTime.format("HH:mm"));
        slotTime = slotTime.add(x.nextSlot, 'minutes');
    }
    return times;
}

function generateCalendar() {
    var timeSlots = ['', ...getTimeSlots()];
    var elem = document.getElementById("calendar-container");
    var today = moment();
    for (var i = 0; i < 8; i++) {
        var row = document.createElement('div');
        row.id = 'row' + i;
        row.className = 'row';
        elem.appendChild(row);
        for (let j = 0; j < 10; j++) {
	    var tomorrow = moment(today).add(i, 'days').format('YYYY-MM-DD');
            var dayOfMonth = tomorrow;
            let column = document.createElement('div');
            column.id = 'column' + i;
            column.className = 'column';
            if (j !== 0 && i === 0) {
                column.innerText = timeSlots[j]
            }
            if (j === 0 && i !== 0) {
                column.innerText = dayOfMonth;
                //dayOfMonth++;
            }
            if (i !== 0 && j !== 0) {
                let currDate = dayOfMonth+"/"+timeSlots[j];
                //let endDate = moment().add(i - 1, 'days').set({ hour: parseInt(timeSlots[j]), minute: 0, second: 0 }).add(1, 'hours').utc().format();
		column.setAttribute('data-selected', currDate);
                column.addEventListener("click", function () {
                    if (this.style.backgroundColor === 'lightgreen') {
                        this.style.backgroundColor = 'white';
         		this.removeAttribute('data-checked');
                    } else {
                        this.setAttribute('data-checked', currDate);
                        this.style.backgroundColor = 'lightgreen';
                    }
                })
            }
            row.appendChild(column);
        }
    }
    fetch(window.location.origin + '/meetings/'+ sessionStorage.getItem('userid'), {
    method: "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then((res) => {
        return res.json();
    }).then((res) => {
console.log(res);
       // console.log(document.querySelector("[data-selected='"+res.slots[i].start_at+"']"));
	for(var i =0;i<res.length;i++) {
console.log(res.length);
 console.log(document.querySelectorAll("[data-selected='"+res[i].start_at+"']")[0]);
		document.querySelectorAll("[data-selected='"+res[i].start_at+"']").style.backgroundColor = 'lightgreen';
	}
    }).catch((err) => {
    });

}

function sendAvailabilitySlots() {
    var slots = document.querySelectorAll("[data-checked]");
    var timestamps = {
        "slots": []
    }
    for (var i = 0; i < slots.length; i++) {
        timestamps.slots.push(
            {
                'start_at': slots[i].getAttribute("data-checked")
            });
    }
    var userid = sessionStorage.getItem('userid');

    fetch(window.location.origin + '/meetings/'+ userid, {
        method: "POST",
        body: JSON.stringify(timestamps),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
    }).catch((err) => {
    });
}

// function getAllUsers () {
//     let usersList = {
//         users: [
//             {
//                 id: 01,
//                 name:"Mithilesh",
//                 email:"mithileshkumar0108@gmail.com"
//             },
//             {
//                 id: 02,
//                 name:"Sawan",
//                 email:"kumar.sawan1@gmail.com"
//             }
//         ]
//             }
//         ]
                        this.setAttribute('data-checked', currDate);
                        this.style.backgroundColor = 'lightgreen';
                    }
                })
            }
            row.appendChild(column);
        }
    }

}

function sendAvailabilitySlots() {
    var slots = document.querySelectorAll("[data-checked]");
    var timestamps = {
        "slots": []
    }
    for (var i = 0; i < slots.length; i++) {
        timestamps.slots.push(
            {
                'start_at': slots[i].getAttribute("data-checked")
            });
    }
    var userid = sessionStorage.getItem('userid');

    fetch(window.location.origin + '/meetings/'+ userid, {
        method: "POST",
        body: JSON.stringify(timestamps),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
    }).catch((err) => {
    });
}

function register() {
    var loginElem = document.getElementById("vt-login-form");
    loginElem.style.display = "none";
    var registerElem = document.getElementById("vt-register-form");
    registerElem.style.display = "flex";
}

function showOtherCalendar() {
	document.getElementById("container-main").style.display = "none";
        document.getElementById("container-main-others").style.display = "flex";
        document.getElementById("container-main-others").style.flexDirection = "column";
        document.getElementById("other-container").style.flexDirection = "column";
        generateOtherCalendar();

}

function login() {
    var registerElem = document.getElementById("vt-register-form");
    registerElem.style.display = "none";
    var loginElem = document.getElementById("vt-login-form");
    loginElem.style.display = "flex";
}

function sendLogin() {
    var email = document.getElementById("email").value;
    var pwd = document.getElementById("password").value;
    var requestObject = {
        "email": email,
        "password": pwd
    };
    var reqLogin = fetch(window.location.origin + '/login', {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
        if (!res.ok) {
            document.getElementById("vt-form-container").style.display = "flex";
            document.getElementById("container-main-others").style.display = "none";
            document.getElementById("container-main").style.display = "none";
        } else {
            document.getElementById("vt-form-container").style.display = "none";
            document.getElementById("container-main").style.display = "flex";
            document.getElementById("container-main").style.flexDirection = "column";
        }
        return res.json();
    }).then((res) => {
       if(res.id) {
          sessionStorage.setItem('userid', res.id);
	  generateCalendar();
       }
    }).catch((err) => {
        document.getElementById("vt-form-container").style.display = "flex";
        document.getElementById("container-main-others").style.display = "none";
        document.getElementById("container-main").style.display = "none";
    });

    reqLogin.then((resp) => {
        
    })
}

function sendRegister() {
    var name = document.getElementById("reg-name").value;
    var email = document.getElementById("reg-email").value;
    var pwd = document.getElementById("reg-orig-password").value;
    var requestObject = {
        "name": name,
        "email": email,
        "password": pwd
    };
    fetch(window.location.origin + '/users', {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then((res) => {
        if (!res.ok) {
