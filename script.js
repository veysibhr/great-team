document.getElementById('add-player').addEventListener('click', function() {
    
    const playerSection = document.getElementById('player-section');
    const newPlayer = document.createElement('div');
    newPlayer.classList.add('player-row');
    newPlayer.innerHTML = `
        <input type="text" placeholder="Nom du joueur" class="player-name">
        <input type="number" min="1" max="10" placeholder="Note" class="player-note">
        <select class="player-poste">
            <option value="defenseur">Défenseur</option>
            <option value="milieu">Milieu</option>
            <option value="attaquant">Attaquant</option>
        </select>
    `;
    playerSection.appendChild(newPlayer);
});

document.getElementById('generate-teams').addEventListener('click', function() {
   
    const playerNames = document.querySelectorAll('.player-name');
    const playerNotes = document.querySelectorAll('.player-note');
    const playerPostes = document.querySelectorAll('.player-poste');

    const players = [];
    for (let i = 0; i < playerNames.length; i++) {
        players.push({
            nom: playerNames[i].value,
            note: parseInt(playerNotes[i].value, 10),
            poste: playerPostes[i].value
        });
    }

    
    fetch('/generate-teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players }),
    })
    .then(response => response.json())
    .then(data => {
       
        document.getElementById('result-section').style.display = 'block';
        const team1Result = document.getElementById('team1-result');
        const team2Result = document.getElementById('team2-result');

        
        team1Result.innerHTML = `<h3>Équipe 1</h3>
            <div class="players-box">` + data.team1.map(p => `<p>${p.nom}</p>`).join('') + `</div>
            <h4>Note totale : ${data.score1}</h4>`;

        team2Result.innerHTML = `<h3>Équipe 2</h3>
            <div class="players-box">` + data.team2.map(p => `<p>${p.nom}</p>`).join('') + `</div>
            <h4>Note totale : ${data.score2}</h4>`;
    });
});
