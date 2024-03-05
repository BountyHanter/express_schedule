function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    const weekday = now.toLocaleString('default', { weekday: 'long' });
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.querySelector('.date').textContent = `Год: ${year}, Месяц: ${month}, День: ${day}, День недели: ${weekday}`;
    document.querySelector('.time').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

// Есть библиотеки для работы со временем
document.addEventListener("DOMContentLoaded", function() {
    fetch('../data/combined_schedule.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const schedule = data.schedule; // Теперь обращаемся к массиву через data.schedule
            const now = new Date();
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeekText = daysOfWeek[now.getDay()];
            const currentTime = now.getHours() * 60 + now.getMinutes();
            let TimeRing = Infinity

            const todaySchedule = schedule.filter(pair => pair.dayOfWeek === dayOfWeekText);
            const currentPair = todaySchedule.find(pair => {
                const startTime = parseInt(pair.startTimeFirstHalf.split(':')[0]) * 60 + parseInt(pair.startTimeFirstHalf.split(':')[1]);
                const endTime = parseInt(pair.endTimeSecondHalf.split(':')[0]) * 60 + parseInt(pair.endTimeSecondHalf.split(':')[1]);
                console.log(startTime)
                console.log(endTime)
                console.log(currentTime)
                return currentTime >= startTime && currentTime <= endTime;
            });

            // Функция для преобразования времени из формата "часы:минуты" в минуты
            const timeToMinutes = (timeString) => {
                const [hours, minutes] = timeString.split(':').map(Number);
                return hours * 60 + minutes;
            };

// Переменная для хранения флага, найдено ли уже ближайшее время
            let foundClosestTime = false;

// Перебираем текущее расписание
            for (const pair of todaySchedule) {
                if (foundClosestTime) {
                    break; // Если уже найдено ближайшее время, прерываем цикл
                }

                const times = [
                    pair.startTimeFirstHalf,
                    pair.endTimeFirstHalf,
                    pair.startTimeSecondHalf,
                    pair.endTimeSecondHalf
                ];

                // Перебираем все времена в паре
                for (const time of times) {
                    const timeInMinutes = timeToMinutes(time);

                    // Если время в текущей паре больше текущего времени, выводим его
                    if (timeInMinutes > currentTime) {
                        TimeRing = time
                        console.log(`Ближайшее время в текущей паре: ${time}`);
                        // Устанавливаем флаг в true, чтобы указать, что ближайшее время найдено
                        foundClosestTime = true;
                        // Завершаем выполнение цикла
                        break;
                    }
                }
            }
            if (currentPair) {
                console.log(currentPair)
                console.log(`Предмет: ${currentPair.subject}, Аудитория: ${currentPair.auditorium}, Номер пары: ${currentPair.pairNumber}`);
                const pairElement = document.querySelector('.pair');
                pairElement.textContent = `Предмет: ${currentPair.subject}, Аудитория: ${currentPair.auditorium}, Номер пары: ${currentPair.pairNumber}, Ближайший звонок: ${TimeRing} `;
            }
            else {
                const pairElement = document.querySelector('.pair');
                pairElement.textContent = `Перемена\\Нет пар`;
            }
        })
        .catch(error => console.error('Fetch error:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    var today = new Date();
    var dayOfWeek = today.getDay(); // Возвращает день недели от 0 (воскресенье) до 6 (суббота)

    var schedules = document.querySelectorAll('.schudele table');
    // Сначала скрываем все таблицы
    schedules.forEach(function(schedule) {
        schedule.style.display = 'none';
    });

    // Отображаем таблицу для текущего дня, если это не воскресенье
    if(dayOfWeek > 0) { // dayOfWeek == 0 это воскресенье, которое мы пропускаем
        var scheduleIds = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var currentScheduleId = scheduleIds[dayOfWeek - 1]; // -1 потому что в массиве понедельник имеет индекс 0
        var currentSchedule = document.getElementById(currentScheduleId);
        if (currentSchedule) {
            currentSchedule.style.display = 'table';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const arrow = document.querySelector('.arrow');
    const startTime = new Date(1970, 0, 1, 9, 0, 0); // Начало движения стрелки в 9:00 каждый день

    function updateArrowPosition() {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes(); // Текущее время в минутах
        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes(); // Время начала в минутах

        if (nowMinutes >= startMinutes && nowMinutes <= (startMinutes + 7*60 + 20)) { // Если текущее время от 9:00 до 16:20
            const minutesPassed = nowMinutes - startMinutes; // Сколько минут прошло с 9:00
            let newPosition = minutesPassed * 2; // Новая позиция в пикселях (Отношение 1 минута - 2 пикселя)
            arrow.style.top = `${newPosition}px`;
        }
    }

    setInterval(updateArrowPosition, 600); // Обновляем позицию стрелки каждую секунду
});







