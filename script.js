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

// Lägg till dessa variabler i början av filen, utanför alla funktioner
const maxRegularSeats = 20;
const maxMultiscreenSeats = 10;
let bookings = [];

function validateBooking(event) {
    event.preventDefault();
    
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
    const existingBookingsForTime = bookings.filter(booking => booking.time === time);
    const totalBookedSeats = existingBookingsForTime.reduce((sum, booking) => sum + booking.guests, 0);
    
    if (room === 'multiscreen') {
        if (totalBookedSeats + guests > maxMultiscreenSeats) {
            messageDiv.innerHTML = 'Tyvärr är multiscreen-rummet fullt vid denna tid';
            return false;
        }
    } else {
        if (totalBookedSeats + guests > maxRegularSeats) {
            messageDiv.innerHTML = 'Tyvärr är det fullt vid denna tid';
            return false;
        }
    }
    
    // Lägg till bokningen i array
    bookings.push({ time, guests, room });
    
    // Om alla kontroller är OK
    messageDiv.innerHTML = 'Bokning mottagen! Vi kontaktar dig snart.';
    document.getElementById('bookingForm').reset();
    return false;
}

