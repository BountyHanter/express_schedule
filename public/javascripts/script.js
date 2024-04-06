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

function initializeScheduleCheck() {
    fetch('/api/schedule')
        .then(response => response.json())
        .then(data => {
            const schedule = data.map(item => ({
                ...item,
                // Преобразуем строки времени в объекты Date для удобства сравнения
                starttimefirsthalf: new Date(`1970/01/01 ${item.starttimefirsthalf}`),
                endtimefirsthalf: new Date(`1970/01/01 ${item.endtimefirsthalf}`),
                starttimesecondhalf: new Date(`1970/01/01 ${item.starttimesecondhalf}`),
                endtimesecondhalf: new Date(`1970/01/01 ${item.endtimesecondhalf}`),
                // Флаги для отслеживания, было ли уже показано уведомление
                firstHalfNotified: false,
                secondHalfNotified: false,
                endFirstHalfNotified: false,
                endSecondHalfNotified: false
            }));

            setInterval(() => {
                const now = new Date();
                const currentTime = new Date(`1970/01/01 ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

                schedule.forEach(item => {
                    // Проверяем для каждого времени начала и выводим сообщение за 2 минуты до начала
                    // Начало первой половины
                    checkAndNotify(item, 'starttimefirsthalf', currentTime, item.firstHalfNotified, 'Начало первой половины пары скоро', 'firstHalfNotified');
                    // Начало второй половины
                    checkAndNotify(item, 'starttimesecondhalf', currentTime, item.secondHalfNotified, 'Начало второй половины пары скоро', 'secondHalfNotified');
                    // Конец первой половины
                    checkAndNotify(item, 'endtimefirsthalf', currentTime, item.endFirstHalfNotified, 'Первая половина пары скоро закончится', 'endFirstHalfNotified');
                    // Конец второй половины
                    checkAndNotify(item, 'endtimesecondhalf', currentTime, item.endSecondHalfNotified, 'Вторая половина пары скоро закончится', 'endSecondHalfNotified');
                });
            }, 1000);
        })
        .catch(error => console.error('Ошибка при получении расписания:', error));
}

function checkAndNotify(item, timeKey, currentTime, notifiedFlag, message, notifyProp) {
    const timeDiff = (item[timeKey] - currentTime) / 60000; // Разница в минутах
    if (timeDiff > 0 && timeDiff <= 2 && !notifiedFlag) {
        console.log(message);
        item[notifyProp] = true; // Установка флага, чтобы избежать повторного уведомления
    }
}

initializeScheduleCheck();