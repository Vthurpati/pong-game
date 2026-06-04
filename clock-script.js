// List of available time zones
const availableTimezones = [
    { name: 'New York (EST)', timezone: 'America/New_York' },
    { name: 'Los Angeles (PST)', timezone: 'America/Los_Angeles' },
    { name: 'Chicago (CST)', timezone: 'America/Chicago' },
    { name: 'Denver (MST)', timezone: 'America/Denver' },
    { name: 'London (GMT)', timezone: 'Europe/London' },
    { name: 'Paris (CET)', timezone: 'Europe/Paris' },
    { name: 'Berlin (CET)', timezone: 'Europe/Berlin' },
    { name: 'Moscow (MSK)', timezone: 'Europe/Moscow' },
    { name: 'Dubai (GST)', timezone: 'Asia/Dubai' },
    { name: 'India (IST)', timezone: 'Asia/Kolkata' },
    { name: 'Bangkok (ICT)', timezone: 'Asia/Bangkok' },
    { name: 'Singapore (SGT)', timezone: 'Asia/Singapore' },
    { name: 'Hong Kong (HKT)', timezone: 'Asia/Hong_Kong' },
    { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
    { name: 'Sydney (AEDT)', timezone: 'Australia/Sydney' },
    { name: 'Auckland (NZDT)', timezone: 'Pacific/Auckland' },
    { name: 'São Paulo (BRT)', timezone: 'America/Sao_Paulo' },
    { name: 'Mexico City (CST)', timezone: 'America/Mexico_City' },
    { name: 'Toronto (EST)', timezone: 'America/Toronto' },
    { name: 'Vancouver (PST)', timezone: 'America/Vancouver' },
    { name: 'Cairo (EET)', timezone: 'Africa/Cairo' },
    { name: 'Johannesburg (SAST)', timezone: 'Africa/Johannesburg' },
    { name: 'Istanbul (EET)', timezone: 'Europe/Istanbul' },
    { name: 'Seoul (KST)', timezone: 'Asia/Seoul' }
];

// Default timezones to display
const defaultTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

// Store active timezones
let activeTimezones = [...defaultTimezones];

// Initialize the application
function init() {
    populateTimezoneSelect();
    renderClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
}

// Populate the timezone select dropdown
function populateTimezoneSelect() {
    const select = document.getElementById('timezone-select');
    availableTimezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.timezone;
        option.textContent = tz.name;
        select.appendChild(option);
    });
}

// Add event listeners
document.getElementById('add-btn').addEventListener('click', addTimezone);
document.getElementById('reset-btn').addEventListener('click', resetToDefault);
document.getElementById('timezone-select').addEventListener('change', (e) => {
    if (e.target.value) {
        document.getElementById('add-btn').disabled = false;
    }
});

// Add a new timezone
function addTimezone() {
    const select = document.getElementById('timezone-select');
    const timezone = select.value;

    if (timezone && !activeTimezones.includes(timezone)) {
        activeTimezones.push(timezone);
        renderClocks();
        select.value = '';
    }
}

// Reset to default timezones
function resetToDefault() {
    activeTimezones = [...defaultTimezones];
    renderClocks();
    document.getElementById('timezone-select').value = '';
}

// Render all clock cards
function renderClocks() {
    const container = document.getElementById('clocks-container');
    container.innerHTML = '';

    activeTimezones.forEach(timezone => {
        const tzInfo = availableTimezones.find(tz => tz.timezone === timezone);
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.dataset.timezone = timezone;

        card.innerHTML = `
            <div class="clock-header">
                <h2>${tzInfo ? tzInfo.name : timezone}</h2>
                <button class="remove-btn" onclick="removeTimezone('${timezone}')">✕</button>
            </div>
            <div class="clock-display">
                <div class="digital-time" id="time-${timezone}">--:--:--</div>
                <div class="clock-details">
                    <div class="date" id="date-${timezone}">--/--/----</div>
                    <div class="offset" id="offset-${timezone}">UTC+0</div>
                </div>
            </div>
            <div class="analog-clock" id="analog-${timezone}">
                <svg viewBox="0 0 200 200" class="clock-svg">
                    <circle cx="100" cy="100" r="95" class="clock-face"/>
                    <circle cx="100" cy="100" r="5" class="clock-center"/>
                    
                    <!-- Hour markers -->
                    <g class="hour-markers">
                        <line x1="100" y1="10" x2="100" y2="25" class="marker"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(30 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(60 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(90 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(120 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(150 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(180 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(210 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(240 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(270 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(300 100 100)"/>
                        <line x1="100" y1="10" x2="100" y2="25" class="marker" transform="rotate(330 100 100)"/>
                    </g>
                    
                    <!-- Clock hands -->
                    <line x1="100" y1="100" x2="100" y2="35" class="hour-hand" id="hour-${timezone}"/>
                    <line x1="100" y1="100" x2="100" y2="20" class="minute-hand" id="minute-${timezone}"/>
                    <line x1="100" y1="100" x2="100" y2="15" class="second-hand" id="second-${timezone}"/>
                </svg>
            </div>
        `;

        container.appendChild(card);
    });
}

// Remove a timezone
function removeTimezone(timezone) {
    activeTimezones = activeTimezones.filter(tz => tz !== timezone);
    renderClocks();
}

// Update all clocks
function updateClocks() {
    const now = new Date();

    activeTimezones.forEach(timezone => {
        updateDigitalClock(timezone, now);
        updateAnalogClock(timezone, now);
    });
}

// Update digital clock display
function updateDigitalClock(timezone, now) {
    try {
        // Get time in specific timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const timeString = formatter.format(now);
        const dateString = dateFormatter.format(now);

        // Update digital time
        const timeElement = document.getElementById(`time-${timezone}`);
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        // Update date
        const dateElement = document.getElementById(`date-${timezone}`);
        if (dateElement) {
            dateElement.textContent = dateString;
        }

        // Update UTC offset
        const offsetElement = document.getElementById(`offset-${timezone}`);
        if (offsetElement) {
            const offset = getUTCOffset(timezone, now);
            offsetElement.textContent = `UTC${offset}`;
        }
    } catch (e) {
        console.error(`Error updating timezone ${timezone}:`, e);
    }
}

// Update analog clock display
function updateAnalogClock(timezone, now) {
    try {
        // Create a date in the target timezone
        const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));

        const hours = tzTime.getHours();
        const minutes = tzTime.getMinutes();
        const seconds = tzTime.getSeconds();

        // Calculate rotation angles
        const secondAngle = (seconds * 6); // 360 / 60
        const minuteAngle = (minutes * 6) + (seconds * 0.1); // 360 / 60
        const hourAngle = (hours % 12 * 30) + (minutes * 0.5); // 360 / 12

        // Update hand rotations
        const hourHand = document.getElementById(`hour-${timezone}`);
        const minuteHand = document.getElementById(`minute-${timezone}`);
        const secondHand = document.getElementById(`second-${timezone}`);

        if (hourHand) hourHand.style.transform = `rotate(${hourAngle}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        if (secondHand) secondHand.style.transform = `rotate(${secondAngle}deg)`;
    } catch (e) {
        console.error(`Error updating analog clock for ${timezone}:`, e);
    }
}

// Get UTC offset for a timezone
function getUTCOffset(timezone, date) {
    const tzTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const utcTime = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diff = (tzTime - utcTime) / (1000 * 60 * 60); // Difference in hours

    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(0)}`;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
