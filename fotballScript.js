$(document).ready(function() {
    console.log("Script started");
    const $apiPage = $('#api-page');
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '922edd8576abf99a986a585a8529e0da'
        }
    };

    // Hämtar avslutade matcher från Premier League denna säsong
    fetch('https://v3.football.api-sports.io/fixtures?league=39&season=2023&status=FT', options)
        .then(response => {
            console.log("Response received:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            console.log("Data received:", response);
            if (!response.response || response.response.length === 0) {
                $apiPage.html('<div class="no-matches">Inga matcher hittades.</div>');
                return;
            }
            
            // Sortera matcher efter datum (senaste först)
            const matches = response.response.sort((a, b) => 
                new Date(b.fixture.date) - new Date(a.fixture.date)
            ).slice(0, 10); // Visa bara de 10 senaste matcherna
            
            let matchesHtml = '<div class="matches-container">';
            
            matches.forEach(match => {
                const homeGoals = match.goals.home ?? '-';
                const awayGoals = match.goals.away ?? '-';
                const matchDate = new Date(match.fixture.date);
                
                matchesHtml += `
                    <div class="match-card">
                        <div class="match-teams">
                            <div class="team">
                                <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                                <span>${match.teams.home.name}</span>
                            </div>
                            <div class="score">
                                <span class="big-score">${homeGoals} - ${awayGoals}</span>
                            </div>
                            <div class="team">
                                <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
                                <span>${match.teams.away.name}</span>
                            </div>
                        </div>
                        <div class="match-info">
                            <span class="date">Datum: ${matchDate.toLocaleDateString('sv-SE')}</span>
                            <span class="time">Tid: ${matchDate.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'})}</span>
                            <span class="status">Status: ${match.fixture.status.long}</span>
                        </div>
                    </div>
                `;
            });
            
            matchesHtml += '</div>';
            $apiPage.html(matchesHtml);
        })
        .catch(err => {
            console.error('Ett fel uppstod:', err);
            $apiPage.html(`<div class="error">Kunde inte ladda matchdata: ${err.message}</div>`);
        });
});