(function getAllUsers () {
    let usersList = {
        users: [
            {
                id: 01,
                name:"Mithilesh",
                email:"mithileshkumar0108@gmail.com"
            },
            {
                id: 02,
                name:"Sawan",
                email:"kumar.sawan1@gmail.com"
            }
        ]
    }
    let elem = document.getElementById("user-list");
    for(let i=0;i<usersList.users.length; i++) {
        let newUser = document.createElement("div");
        newUser.className = 'users';
        newUser.setAttribute('data-users', usersList.users[i].id);
        newUser.innerText = usersList.users[i].name;
        newUser.addEventListener('click', function() {
            // alert(this.getAttribute("data-users"));
            generateCalendar();
        })
        elem.appendChild(newUser);
        
    }
})();

function getTimeSlots() {
    var x = {
        nextSlot: 60,
        startTime: '9:00',
        endTime: '19:00'
    };
    
    var slotTime = moment(x.startTime, "HH:mm");
    var endTime = moment(x.endTime, "HH:mm");
    
    let times = [];
    while (slotTime < endTime)
    {
      times.push(slotTime.format("HH:mm"));
      slotTime = slotTime.add(x.nextSlot, 'minutes');
    }
    return times;
}

function generateCalendar() {
    let timeSlots = ['',...getTimeSlots()];
    let elem = document.getElementById("calendar-container");
    elem.innerHTML = '';
    let date = moment();
    let dayOfMonth = date.format('D');
    for(let i=0; i<8; i++) {
        let row = document.createElement('div');
        row.id = 'row'+ i;
        row.className = 'row';
        elem.appendChild(row);
        for(let j=0; j<10; j++) {
            let column = document.createElement('div');
            column.id = 'column'+ i;
            column.className = 'column';
            if(j!==0 && i===0) {
                column.innerText = timeSlots[j]
            }
            if(j===0 && i!==0) {
                column.innerText = dayOfMonth;
                dayOfMonth++;
            }
            if(i!==0 && j!==0) {
                let currDate = moment().add(i-1, 'days').set({ hour: parseInt(timeSlots[j]),minute: 0,second: 0}).utc().format();
                column.addEventListener("click", function() {
                    if(this.style.backgroundColor === 'lightgreen') {
                        this.style.backgroundColor= 'white';
                        this.removeAttribute('data-selected');
                    } else {
                        this.setAttribute('data-selected', currDate);
                        this.style.backgroundColor = 'lightgreen';
                    }
                })
            //column.innerText = currDate;
            }
            row.appendChild(column);
        }
    }
}

function sendAvailabilitySlots() {
    let slots = document.querySelectorAll("[data-selected]");
    let timestamps = [];
    for( let i=0;i <slots.length; i++) {
        timestamps.push({"start_at": slots[i].getAttribute("data-selected")});
    }
    console.log({"available_slots": timestamps});
}

function searchUsers() {
    var searchedKey = event.target.value;
    var matchedUsers = document.querySelectorAll("[class='users'");
    for(var i=0; i<matchedUsers.length; i++) {
        if(matchedUsers[i].innerText.indexOf( searchedKey ) === -1) {
            matchedUsers[i].style.display = 'none';
        } else {
            matchedUsers[i].style.display = 'block';
        }
    }    
}