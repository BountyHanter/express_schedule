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

async function updateCurrentClass() {
    const timetableResponse = await fetch('../data/timetable.json');
    const timetable = await timetableResponse.json();
    const currentDay = new Date().toLocaleDateString('ru-RU', { weekday: 'long' }).toLowerCase();
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const totalMinutes = currentHours * 60 + currentMinutes;

    const todayTimetable = timetable[currentDay] || [];
    let currentClassInfo = 'Пар нет';

    for (let classInfo of todayTimetable) {
        const startTimeFirstHalf = classInfo.startTimeFirstHalf.split(':');
        const endTimeSecondHalf = classInfo.endTimeSecondHalf.split(':');
        const startMinutes = parseInt(startTimeFirstHalf[0]) * 60 + parseInt(startTimeFirstHalf[1]);
        const endMinutes = parseInt(endTimeSecondHalf[0]) * 60 + parseInt(endTimeSecondHalf[1]);

        if (totalMinutes >= startMinutes && totalMinutes <= endMinutes) {
            currentClassInfo = `Сейчас пара - ${classInfo.pairNumber}, ${classInfo.subject}, ${classInfo.auditorium}`;
            break;
        }
    }

    document.querySelector('.pair').textContent = currentClassInfo;
}

updateCurrentClass();
// Вы можете вызывать эту функцию регулярно, например, каждую минуту, чтобы обновлять информацию о текущей паре
setInterval(updateCurrentClass, 60000);