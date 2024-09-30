import random
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-teams', methods=['POST'])
def generate_teams():
    players = request.json['players']
    team1, team2, score1, score2 = create_teams(players)
    return jsonify({'team1': team1, 'team2': team2, 'score1': score1, 'score2': score2})


def create_teams(players):
    
    defenseurs = sorted([p for p in players if p['poste'] == 'defenseur'], key=lambda x: x['note'], reverse=True)
    milieux = sorted([p for p in players if p['poste'] == 'milieu'], key=lambda x: x['note'], reverse=True)
    attaquants = sorted([p for p in players if p['poste'] == 'attaquant'], key=lambda x: x['note'], reverse=True)

    
    team1, team2 = [], []

    
    def distribute_players(poste_joueurs):
        for i, joueur in enumerate(poste_joueurs):
            if len(team1) <= len(team2):
                team1.append(joueur)
            else:
                team2.append(joueur)

    
    distribute_players(defenseurs)
    distribute_players(milieux)
    distribute_players(attaquants)

   
    score_team1 = sum([p['note'] for p in team1])
    score_team2 = sum([p['note'] for p in team2])

    
    if abs(score_team1 - score_team2) / max(score_team1, score_team2) > 0.1:
        def swap_players():
            nonlocal score_team1, score_team2
            for i in range(min(len(team1), len(team2))):
                team1[i], team2[i] = team2[i], team1[i]
                score_team1 = sum([p['note'] for p in team1])
                score_team2 = sum([p['note'] for p in team2])
                if abs(score_team1 - score_team2) / max(score_team1, score_team2) <= 0.1:
                    break

        swap_players()

    return team1, team2, score_team1, score_team2




if __name__ == '__main__':
    app.run(debug=True)
