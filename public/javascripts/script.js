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
    fetch('/api/schedule')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const schedule = data.schedule;
            const now = new Date();
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeekText = daysOfWeek[now.getDay()];
            const currentTime = now.getHours() * 60 + now.getMinutes();
            let TimeRing = "Не определено";

            const todaySchedule = schedule.filter(pair => pair.dayofweek === dayOfWeekText);
            const currentPair = todaySchedule.find(pair => {
                console.log(pair); // Вывести текущий объект пары для проверки
                const startTime = pair.starttimefirsthalf ? pair.starttimefirsthalf.split(':').map(Number) : [0, 0];
                const endTime = pair.endtimesecondhalf ? pair.endtimesecondhalf.split(':').map(Number) : [0, 0];
                const startTimeMinutes = startTime[0] * 60 + startTime[1];
                const endTimeMinutes = endTime[0] * 60 + endTime[1];
                return currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
            });

            // Функция для преобразования времени из формата "часы:минуты" в минуты
            const timeToMinutes = (timeString) => {
                if (!timeString) {
                    return 0; // или другое значение по умолчанию, которое логично в вашем контексте
                }
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
                    pair.starttimefirsthalf,
                    pair.endtimefirsthalf,
                    pair.starttimesecondhalf,
                    pair.endtimesecondhalf
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
                console.log(`Предмет: ${currentPair.subject}, Аудитория: ${currentPair.auditorium}, Номер пары: ${currentPair.pairnumber}`);
                const pairElement = document.querySelector('.pair');
                pairElement.textContent = `Предмет: ${currentPair.subject}, Аудитория: ${currentPair.auditorium}, Номер пары: ${currentPair.pairnumber}, Ближайший звонок: ${TimeRing} `;
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







document.addEventListener("DOMContentLoaded", function() {
    let scheduleData; // Переменная для хранения данных расписания

    // Загружаем данные из базы данных при загрузке страницы
    fetch('/api/schedule')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Получаем все значения колонок из таблицы
            const allValues = data.schedule.map(item => ({
                starttimefirsthalf: item.starttimefirsthalf,
                endtimefirsthalf: item.endtimefirsthalf,
                starttimesecondhalf: item.starttimesecondhalf,
                endtimesecondhalf: item.endtimesecondhalf
            }));

            // Создаем объект Set, чтобы получить уникальные значения
            const uniqueValuesSet = new Set();

            // Добавляем уникальные значения в объект Set
            allValues.forEach(item => {
                const { starttimefirsthalf, endtimefirsthalf, starttimesecondhalf, endtimesecondhalf } = item;
                uniqueValuesSet.add(JSON.stringify({ starttimefirsthalf, endtimefirsthalf, starttimesecondhalf, endtimesecondhalf }));
            });

            // Преобразуем объект Set обратно в массив с уникальными значениями
            uniqueScheduleData = Array.from(uniqueValuesSet).map(item => JSON.parse(item));
            // Преобразование каждого элемента массива в формат Date
            uniqueScheduleData.forEach(item => {
                item.starttimefirsthalf = parseTime(item.starttimefirsthalf);
                item.endtimefirsthalf = parseTime(item.endtimefirsthalf);
                item.starttimesecondhalf = parseTime(item.starttimesecondhalf);
                item.endtimesecondhalf = parseTime(item.endtimesecondhalf);
            });

            // Запускаем проверку времени каждую секунду
            setInterval(() => checkTime(uniqueScheduleData), 1000);
        })
        .catch(error => {
            console.error('Error:', error);
        });

});

let flag = false;

function checkTime(scheduleData) {
    // Получаем текущее время и преобразуем его в формат "часы:минуты:секунды"
    const now = new Date();
    const currentTimeString = now.toTimeString().split(' ')[0];

    // Проверяем данные расписания
    if (scheduleData) {
        // Проходим по каждому элементу расписания
        for (let i = 0; i < scheduleData.length; i++) {
            // Создаем времена для сравнения, вычитаем 2 минуты для каждой части события
            const newStartTimeFirstHalf = subtractMinutes(scheduleData[i].starttimefirsthalf, 2);
            const newEndTimeFirstHalf = subtractMinutes(scheduleData[i].endtimefirsthalf, 2);
            const newStartTimeSecondHalf = subtractMinutes(scheduleData[i].starttimesecondhalf, 2);
            const newEndTimeSecondHalf = subtractMinutes(scheduleData[i].endtimesecondhalf, 2);

            // Сравниваем текущее время с каждым временем начала и окончания каждой части события
            if ((currentTimeString >= newStartTimeFirstHalf && currentTimeString < scheduleData[i].starttimefirsthalf) ||
                (currentTimeString >= newEndTimeFirstHalf && currentTimeString < scheduleData[i].endtimefirsthalf) ||
                (currentTimeString >= newStartTimeSecondHalf && currentTimeString < scheduleData[i].starttimesecondhalf) ||
                (currentTimeString >= newEndTimeSecondHalf && currentTimeString < scheduleData[i].endtimesecondhalf)) {
                // Если текущее время попадает в один из интервалов
                if (!flag) {
                    alert('Через 2 минуты звонок')
                    flag = true;
                }
            }
            // Проверяем, совпадает ли текущее время с каким-либо временем в расписании
            if (currentTimeString === scheduleData[i].starttimefirsthalf ||
                currentTimeString === scheduleData[i].endtimefirsthalf ||
                currentTimeString === scheduleData[i].starttimesecondhalf ||
                currentTimeString === scheduleData[i].endtimesecondhalf) {
                flag = false; // Сбрасываем флаг
            }
        }
    } else {
        console.log('Schedule data is not loaded yet');
    }
}

function subtractMinutes(timeString, minutes) {
    const parts = timeString.split(':');
    const date = new Date();
    date.setHours(parts[0], parts[1] - minutes, parts[2]);
    return date.toTimeString().split(' ')[0];
}

function parseTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    return date.toTimeString().split(' ')[0];
}