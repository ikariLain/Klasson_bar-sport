// Javascript for hamburger menu
document.addEventListener('DOMContentLoaded', () => {
    const menuOpen = document.querySelector('#menu-open-button');
    const menuClose = document.querySelector('#menu-close-button');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (menuOpen && menuClose && navMenu) {
        menuOpen.addEventListener('click', () => {
            navMenu.style.left = '0';
            body.classList.add('show-mobile-menu');
        });

        menuClose.addEventListener('click', () => {
            navMenu.style.left = '-300px';
            body.classList.remove('show-mobile-menu');
        });
    }
});

// Lägg till dessa variabler i början av filen
const maxRegularSeats = 20;
const maxMultiscreenSeats = 10;
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

function validateBooking(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = parseInt(document.getElementById('guests').value);
    const room = document.getElementById('room').value;
    const messageDiv = document.getElementById('bookingMessage');
    
    // Kontrollera öppettider (11:00 - 13:00)
    const bookingTime = new Date(`1970-01-01T${time}`);
    const openTime = new Date('1970-01-01T11:00');
    const closeTime = new Date('1970-01-01T13:00');
    
    if (bookingTime < openTime || bookingTime > closeTime) {
        messageDiv.innerHTML = 'Vi har endast öppet mellan 11:00 och 13:00';
        return false;
    }
    
    // Kontrollera antal gäster
    if (guests < 1 || guests > 20) {
        messageDiv.innerHTML = 'Antal gäster måste vara mellan 1 och 20';
        return false;
    }
    
    // Kontrollera tillgängliga platser
    const existingBookingsForTime = bookings.filter(booking => 
        booking.date === date && booking.time === time
    );
    const totalBookedSeats = existingBookingsForTime.reduce((sum, booking) => sum + booking.guests, 0);
    
    if (room === 'multiscreen' && totalBookedSeats + guests > maxMultiscreenSeats) {
        messageDiv.innerHTML = 'Tyvärr är multiscreen-rummet fullt vid denna tid';
        return false;
    } else if (totalBookedSeats + guests > maxRegularSeats) {
        messageDiv.innerHTML = 'Tyvärr är det fullt vid denna tid';
        return false;
    }
    
    // Skapa ett unikt ID för bokningen
    const bookingId = Date.now().toString();
    
    // Lägg till bokningen i array
    const newBooking = {
        id: bookingId,
        name,
        email,
        phone,
        date,
        time,
        guests,
        room,
        status: 'Ny',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Visa bekräftelse
    messageDiv.innerHTML = `
        <div class="success-message">
            Bokning bekräftad!<br>
            Boknings-ID: ${bookingId}<br>
            Spara detta ID för framtida referens.
        </div>
    `;
    
    document.getElementById('bookingForm').reset();
    return false;
}

$(document).ready(function() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    function updateDashboard() {
        $('#total-bookings').text(bookings.length);
        
        // Räkna lediga bord för dagens datum
        const today = new Date().toISOString().split('T')[0];
        const todaysBookings = bookings.filter(booking => booking.date === today);
        const totalBookedSeats = todaysBookings.reduce((sum, booking) => sum + booking.guests, 0);
        const availableSeats = maxRegularSeats - totalBookedSeats;
        
        $('#available-tables').text(availableSeats);
    }

    function displayBookings() {
        const $bookingsGrid = $('.bookings-grid');
        $bookingsGrid.empty();
        
        // Sortera bokningar efter datum och tid
        const sortedBookings = bookings.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateB - dateA;
        });

        sortedBookings.forEach(booking => {
            const bookingCard = `
                <div class="booking-card" data-booking-id="${booking.id}">
                    <div class="booking-header">
                        <h3>Bokning #${booking.id.slice(-4)}</h3>
                        <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>Namn:</strong> ${booking.name}</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Telefon:</strong> ${booking.phone}</p>
                        <p><strong>Datum:</strong> ${booking.date}</p>
                        <p><strong>Tid:</strong> ${booking.time}</p>
                        <p><strong>Antal gäster:</strong> ${booking.guests}</p>
                        <p><strong>Rum:</strong> ${booking.room === 'multiscreen' ? 'Multiscreen' : 'Standard'}</p>
                        <p><strong>Skapad:</strong> ${new Date(booking.createdAt).toLocaleString('sv-SE')}</p>
                    </div>
                    <div class="booking-actions">
                        <button class="status-btn" data-id="${booking.id}">Ändra status</button>
                        <button class="delete-booking" data-id="${booking.id}">Ta bort</button>
                    </div>
                </div>
            `;
            $bookingsGrid.append(bookingCard);
        });

        // Hantera statusändringar
        $('.status-btn').on('click', function() {
            const bookingId = $(this).data('id');
            const booking = bookings.find(b => b.id === bookingId);
            const newStatus = booking.status === 'Ny' ? 'Bekräftad' : 
                            booking.status === 'Bekräftad' ? 'Avslutad' : 'Ny';
            
            booking.status = newStatus;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            displayBookings();
        });

        // Hantera borttagning
        $('.delete-booking').on('click', function() {
            const bookingId = $(this).data('id');
            if (confirm('Är du säker på att du vill ta bort denna bokning?')) {
                const index = bookings.findIndex(b => b.id === bookingId);
                bookings.splice(index, 1);
                localStorage.setItem('bookings', JSON.stringify(bookings));
                updateDashboard();
                displayBookings();
            }
        });
    }

    // Initialisera dashboard
    updateDashboard();
    displayBookings();
});

