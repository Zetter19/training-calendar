const startDate = new Date('2024-06-24'); // Vecka 26 börjar den 24 juni 2024
const endDate = new Date('2024-08-20');
const calendarElement = document.getElementById('calendar');
const weeklySummaryElement = document.getElementById('weekly-summary');
const totalSummaryElement = document.getElementById('total-summary');

function getWeekNumber(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function formatDate(date) {
    const options = { month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('sv-SE', options);
}

function createCalendar() {
    let currentDate = new Date(startDate);
    let currentWeekNumber = getWeekNumber(currentDate);
    let weekDiv = createWeekDiv(currentWeekNumber);

    const weeklyTasksSummary = [];

    while (currentDate <= endDate) {
        const dayDiv = createDayDiv(currentDate);
        weekDiv.querySelector('.days').appendChild(dayDiv);

        if (currentDate.getDay() === 0 || currentDate === endDate) {
            calendarElement.appendChild(weekDiv);
            weeklyTasksSummary.push({
                weekNumber: currentWeekNumber,
                tasks: Array(9).fill(0),
            });
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate <= endDate) {
                currentWeekNumber = getWeekNumber(currentDate);
                weekDiv = createWeekDiv(currentWeekNumber);
            }
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    updateSummaries(weeklyTasksSummary);
}

function createWeekDiv(weekNumber) {
    const weekDiv = document.createElement('div');
    weekDiv.className = 'week';

    const weekHeader = document.createElement('div');
    weekHeader.className = 'week-header';
    weekHeader.textContent = `Vecka ${weekNumber}`;

    const daysDiv = document.createElement('div');
    daysDiv.className = 'days';

    weekDiv.appendChild(weekHeader);
    weekDiv.appendChild(daysDiv);

    return weekDiv;
}

function createDayDiv(date) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';

    const formattedDate = formatDate(date);

    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.innerHTML = formattedDate;

    dayDiv.appendChild(dayHeader);

    const taskNames = [
        'Vilodag', 'Uppvärmning', 'Kondition', 'Styrka/Explosivitet',
        'Agility', 'Klubba/Boll', 'Rörlighet', 'Video', 'Övrigt'
    ];

    for (let i = 0; i < 9; i++) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${date.toDateString()}-${i + 1}`;
        checkbox.checked = localStorage.getItem(checkbox.id) === 'true';

        checkbox.addEventListener('change', (event) => {
            localStorage.setItem(event.target.id, event.target.checked);
            updateSummariesOnCheck();
        });

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = taskNames[i];

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        dayDiv.appendChild(taskDiv);
    }

    return dayDiv;
}

function updateSummaries(weeklyTasksSummary) {
    weeklySummaryElement.innerHTML = '';
    totalSummaryElement.innerHTML = '';

    const totalTasks = Array(9).fill(0);
    const taskNames = [
        'Vilodag', 'Uppvärmning', 'Kondition', 'Styrka/Explosivitet',
        'Agility', 'Klubba/Boll', 'Rörlighet', 'Video', 'Övrigt'
    ];

    weeklyTasksSummary.forEach((week) => {
        const weekSummaryDiv = document.createElement('div');
        weekSummaryDiv.className = 'summary-week';

        const weekHeader = document.createElement('div');
        weekHeader.className = 'summary-header';
        weekHeader.textContent = `Vecka ${week.weekNumber}`;

        const tasksSummaryDiv = document.createElement('div');
        tasksSummaryDiv.className = 'summary-tasks';

        weekSummaryDiv.appendChild(weekHeader);
        weekSummaryDiv.appendChild(tasksSummaryDiv);

        for (let i = 0; i < 9; i++) {
            const taskCount = countTasksForWeek(week.weekNumber, i + 1);
            totalTasks[i] += taskCount;

            const taskSummary = document.createElement('div');
            taskSummary.textContent = `${taskNames[i]}: ${taskCount}`;

            tasksSummaryDiv.appendChild(taskSummary);
        }

        weeklySummaryElement.appendChild(weekSummaryDiv);
    });

    const totalSummaryDiv = document.createElement('div');
    totalSummaryDiv.className = 'summary-total';

    const totalHeader = document.createElement('div');
    totalHeader.className = 'summary-header';
    totalHeader.textContent = 'Total Summering';

    const totalTasksSummaryDiv = document.createElement('div');
    totalTasksSummaryDiv.className = 'summary-tasks';

    totalSummaryDiv.appendChild(totalHeader);
    totalSummaryDiv.appendChild(totalTasksSummaryDiv);

    for (let i = 0; i < 9; i++) {
        const taskSummary = document.createElement('div');
        taskSummary.textContent = `${taskNames[i]}: ${totalTasks[i]}`;

        totalTasksSummaryDiv.appendChild(taskSummary);
    }

    totalSummaryElement.appendChild(totalSummaryDiv);
}

function countTasksForWeek(weekNumber, taskNumber) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (weekNumber - 26) * 7);

    let taskCount = 0;

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStartDate);
        currentDate.setDate(weekStartDate.getDate() + i);
        const checkboxId = `task-${currentDate.toDateString()}-${taskNumber}`;
        if (localStorage.getItem(checkboxId) === 'true') {
            taskCount++;
        }
    }

    return taskCount;
}

function updateSummariesOnCheck() {
    const weeklyTasksSummary = [];

    let currentDate = new Date(startDate);
    let currentWeekNumber = getWeekNumber(currentDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 || currentDate === endDate) {
            weeklyTasksSummary.push({
                weekNumber: currentWeekNumber,
                tasks: Array(9).fill(0),
            });
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate <= endDate) {
                currentWeekNumber = getWeekNumber(currentDate);
            }
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    updateSummaries(weeklyTasksSummary);
}

createCalendar();
``
