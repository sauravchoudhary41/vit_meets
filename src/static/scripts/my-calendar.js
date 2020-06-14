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

(function generateCalendar() {
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
})();

function sendAvailabilitySlots() {
    var slots = document.querySelectorAll("[data-selected]");
    var timestamps = [];
    for (var i = 0; i < slots.length; i++) {
        timestamps.push(
            {
                'start_at': slots[i].getAttribute("data-selected"),
                'end_at': slots[i].getAttribute("data-selected-end")
            });
    }
    console.log(timestamps)
}