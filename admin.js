// Testdata för bokningar
const testBookings = [
    {
        id: "20240315001",
        name: "Anna Andersson",
        email: "anna.andersson@test.se",
        phone: "070-123 45 67",
        date: "2024-03-15",
        time: "12:00",
        guests: 4,
        room: "standard",
        status: "Bekräftad",
        createdAt: "2024-03-14T10:30:00"
    },
    {
        id: "20240315002",
        name: "Erik Svensson",
        email: "erik.svensson@test.se",
        phone: "070-234 56 78",
        date: "2024-03-15",
        time: "11:30",
        guests: 2,
        room: "multiscreen",
        status: "Ny",
        createdAt: "2024-03-14T11:15:00"
    },
    {
        id: "20240315003",
        name: "Maria Larsson",
        email: "maria.larsson@test.se",
        phone: "070-345 67 89",
        date: "2024-03-16",
        time: "12:30",
        guests: 6,
        room: "standard",
        status: "Avslutad",
        createdAt: "2024-03-14T09:45:00"
    },
    {
        id: "20240315004",
        name: "Johan Nilsson",
        email: "johan.nilsson@test.se",
        phone: "070-456 78 90",
        date: "2024-03-16",
        time: "11:00",
        guests: 3,
        room: "standard",
        status: "Bekräftad",
        createdAt: "2024-03-14T14:20:00"
    }
];

$(document).ready(function() {
    // Om det inte finns några bokningar i localStorage, lägg till testbokningarna
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify(testBookings));
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || testBookings;
    
    function updateDashboard() {
        $('#total-bookings').text(bookings.length);
        
        // Räkna lediga bord för dagens datum
        const today = new Date().toISOString().split('T')[0];
        const todaysBookings = bookings.filter(booking => booking.date === today);
        const totalBookedSeats = todaysBookings.reduce((sum, booking) => sum + booking.guests, 0);
        const availableSeats = 20 - totalBookedSeats;
        
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
            const statusClass = booking.status.toLowerCase().replace('å', 'a').replace('ä', 'a');
            const bookingCard = `
                <div class="booking-card">
                    <div class="booking-header">
                        <h3>Bokning #${booking.id.slice(-4)}</h3>
                        <span class="booking-status ${statusClass}">${booking.status}</span>
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

    // Initialisera dashboard och visa bokningar
    updateDashboard();
    displayBookings();
});
