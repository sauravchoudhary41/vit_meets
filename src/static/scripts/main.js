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
            alert('Authentication failed.');
            document.getElementById("vt-form-container").style.display = "flex";
            document.getElementById("container-main-others").style.display = "none";
            document.getElementById("container-main").style.display = "none";
        } else {
            document.getElementById("vt-form-container").style.display = "none";
            document.getElementById("container-main-others").style.display = "none";
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
        alert('Authentication failed.');
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
    var date = moment();
    var dayOfMonth = date.format('D');
    for (var i = 0; i < 8; i++) {
        var row = document.createElement('div');
        row.id = 'row' + i;
        row.className = 'row';
        elem.appendChild(row);
        for (let j = 0; j < 10; j++) {
            let column = document.createElement('div');
            column.id = 'column' + i;
            column.className = 'column';
            if (j !== 0 && i === 0) {
                column.innerText = timeSlots[j]
            }
            if (j === 0 && i !== 0) {
                column.innerText = dayOfMonth;
                dayOfMonth++;
            }
            if (i !== 0 && j !== 0) {
                let currDate = moment().add(i - 1, 'days').set({ hour: parseInt(timeSlots[j]), minute: 0, second: 0 }).utc().format();
                let endDate = moment().add(i - 1, 'days').set({ hour: parseInt(timeSlots[j]), minute: 0, second: 0 }).add(1, 'hours').utc().format();
                column.addEventListener("click", function () {
                    if (this.style.backgroundColor === 'lightgreen') {
                        this.style.backgroundColor = 'white';
                        this.removeAttribute('data-selected');
                        this.removeAttribute('data-selected-end');
                    } else {
                        this.setAttribute('data-selected', currDate);
                        this.setAttribute('data-selected-end', endDate)
                        this.style.backgroundColor = 'lightgreen';
                    }
                })
            }
            row.appendChild(column);
        }
    }
}

function sendAvailabilitySlots() {
    var slots = document.querySelectorAll("[data-selected]");
    var timestamps = {
        "slots": []
    }
    for (var i = 0; i < slots.length; i++) {
        timestamps.slots.push(
            {
                'start_at': slots[i].getAttribute("data-selected"),
                'end_at': slots[i].getAttribute("data-selected-end")
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
//     }
//     let elem = document.getElementById("user-list");
//     for(let i=0;i<usersList.users.length; i++) {
//         let newUser = document.createElement("div");
//         newUser.className = 'users';
//         newUser.setAttribute('data-users', usersList.users[i].id);
//         newUser.innerText = usersList.users[i].name;
//         newUser.addEventListener('click', function() {
//             // alert(this.getAttribute("data-users"));
//             generateCalendar();
//         })
//         elem.appendChild(newUser);
        
//     }
// }

// function getTimeSlots() {
//     var x = {
//         nextSlot: 60,
//         startTime: '9:00',
//         endTime: '19:00'
//     };
    
//     var slotTime = moment(x.startTime, "HH:mm");
//     var endTime = moment(x.endTime, "HH:mm");
    
//     let times = [];
//     while (slotTime < endTime)
//     {
//       times.push(slotTime.format("HH:mm"));
//       slotTime = slotTime.add(x.nextSlot, 'minutes');
//     }
//     return times;
// }

// function generateCalendar() {
//     let timeSlots = ['',...getTimeSlots()];
//     let elem = document.getElementById("calendar-container");
//     elem.innerHTML = '';
//     let date = moment();
//     let dayOfMonth = date.format('D');
//     for(let i=0; i<8; i++) {
//         let row = document.createElement('div');
//         row.id = 'row'+ i;
//         row.className = 'row';
//         elem.appendChild(row);
//         for(let j=0; j<10; j++) {
//             let column = document.createElement('div');
//             column.id = 'column'+ i;
//             column.className = 'column';
//             if(j!==0 && i===0) {
//                 column.innerText = timeSlots[j]
//             }
//             if(j===0 && i!==0) {
//                 column.innerText = dayOfMonth;
//                 dayOfMonth++;
//             }
//             if(i!==0 && j!==0) {
//                 let currDate = moment().add(i-1, 'days').set({ hour: parseInt(timeSlots[j]),minute: 0,second: 0}).utc().format();
//                 column.addEventListener("click", function() {
//                     if(this.style.backgroundColor === 'lightgreen') {
//                         this.style.backgroundColor= 'white';
//                         this.removeAttribute('data-selected');
//                     } else {
//                         this.setAttribute('data-selected', currDate);
//                         this.style.backgroundColor = 'lightgreen';
//                     }
//                 })
//             //column.innerText = currDate;
//             }
//             row.appendChild(column);
//         }
//     }
// }

// function sendAvailabilitySlots() {
//     let slots = document.querySelectorAll("[data-selected]");
//     var timestamps = [];
//     for (var i = 0; i < slots.length; i++) {
//         timestamps.push(
//             {
//                 'start_at': slots[i].getAttribute("data-selected"),
//                 'end_at': slots[i].getAttribute("data-selected-end")
//             });
//     }
//     console.log({"available_slots": timestamps});
//     fetch(window.location.origin + '/meetings', {
//         method: "POST",
//         body: JSON.stringify(requestObject),
//         headers: { 
//             "Content-type": "application/json; charset=UTF-8"
//         } 
//     }).then((res) => {
//         if (!res.ok) {
//             alert('Authentication failed.');
//         } else {
//             document.getElementById("reg-name").value= "";
//             document.getElementById("reg-email").value = "";
//             document.getElementById("reg-orig-password").value = "";
//             document.getElementById("reg-conf-password").value = "";
//             alert('Registration successfull. Now you can login.');
//         }
//     }).catch((err) => {
//     });
// }

// function searchUsers() {
//     var searchedKey = event.target.value;
//     var matchedUsers = document.querySelectorAll("[class='users'");
//     for(var i=0; i<matchedUsers.length; i++) {
//         if(matchedUsers[i].innerText.indexOf( searchedKey ) === -1) {
//             matchedUsers[i].style.display = 'none';
//         } else {
//             matchedUsers[i].style.display = 'block';
//         }
//     }    
// }