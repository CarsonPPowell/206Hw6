document.addEventListener('DOMContentLoaded', (event) => {
    const parseCSVData = (data) => {
        const lines = data.split('\n').filter(Boolean);
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const fields = line.split(',');
            let item = {};
            headers.forEach((header, i) => {
                item[header.replace(/"/g, '')] = fields[i] ? fields[i].replace(/"/g, '') : '';
            });
            return item;
        });
    };

    const displayData = (player, contentDiv, dataCategory) => {
        const playerInfo = [
            `Name: ${player.nameFirst} ${player.nameLast}`,
            `Birthdate: ${player.birthYear}-${player.birthMonth}-${player.birthDay}`,
            `Birth City: ${player.birthCity}`,
            `Birth Country: ${player.birthCountry}`,
            `Play Debut: ${player.debut}`,
            `Category: ${dataCategory}`
        ];
        contentDiv.innerHTML = playerInfo.map(info => `<p>${info}</p>`).join('');
    };
    const fetchCareerStats = (playerID, contentDiv, csvFile, tableName) => {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const stats = parseCSVData(data);
                const playerStats = stats.filter(stat => stat.playerID === playerID);
                if (playerStats.length > 0) {
                    let tableHTML = `<table data-role="table" id="${tableName}" class="ui-responsive table-stroke">`;
                    tableHTML += '<thead><tr>';
                    Object.keys(playerStats[0]).forEach(key => {
                        tableHTML += `<th>${key}</th>`;
                    });
                    tableHTML += '</tr></thead><tbody>';
                    playerStats.forEach(playerStat => {
                        tableHTML += '<tr>';
                        for (let key in playerStat) {
                            if (playerStat.hasOwnProperty(key)) {
                                tableHTML += `<td>${playerStat[key]}</td>`;
                            }
                        }
                        tableHTML += '</tr>';
                    });
                    tableHTML += '</tbody></table>';
                    contentDiv.innerHTML = tableHTML;
    
                    // Refresh the table to apply jQuery Mobile styles
                    $(`#${tableName}`).table().table("refresh");
                } else {
                    contentDiv.innerHTML = `<p>No ${dataCategory} stats found for this player.</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const fetchStats = (playerID, contentDiv, csvFile, tableName, year) => {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const stats = parseCSVData(data);
                const playerStats = stats.filter(stat => stat.playerID === playerID && stat.yearID === year);
                if (playerStats.length > 0) {
                    let tableHTML = `<table data-role="table" id="${tableName}" class="ui-responsive table-stroke">`;
                    tableHTML += '<thead><tr>';
                    Object.keys(playerStats[0]).forEach(key => {
                        tableHTML += `<th>${key}</th>`;
                    });
                    tableHTML += '</tr></thead><tbody>';
                    playerStats.forEach(playerStat => {
                        tableHTML += '<tr>';
                        for (let key in playerStat) {
                            if (playerStat.hasOwnProperty(key)) {
                                tableHTML += `<td>${playerStat[key]}</td>`;
                            }
                        }
                        tableHTML += '</tr>';
                    });
                    tableHTML += '</tbody></table>';
                    contentDiv.innerHTML = tableHTML;
    
                    // Refresh the table to apply jQuery Mobile styles
                    $(`#${tableName}`).table().table("refresh");
                } else {
                    contentDiv.innerHTML = `<p>No stats found for this player in ${year}.</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
    };
    

    const fetchPlayerCareerData = (firstName, lastName, contentDiv, csvFile, tableName, dataCategory) => {
        fetch('csv/People.csv')
            .then(response => response.text())
            .then(data => {
                const players = parseCSVData(data);
                const player = players.find(player => player.nameFirst.toLowerCase() === firstName.toLowerCase() && player.nameLast.toLowerCase() === lastName.toLowerCase());
                if (player) {
                    displayData(player, contentDiv, dataCategory);
                    const playerID = player.playerID;
                    fetchCareerStats(playerID, contentDiv, csvFile, tableName);
                } else {
                    contentDiv.innerHTML = `<p>No player found with the name ${firstName} ${lastName}.</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const fetchPlayerData = (firstName, lastName, contentDiv, csvFile, tableName, dataCategory, year) => {
        fetch('csv/People.csv')
            .then(response => response.text())
            .then(data => {
                const players = parseCSVData(data);
                const player = players.find(player => player.nameFirst.toLowerCase() === firstName.toLowerCase() && player.nameLast.toLowerCase() === lastName.toLowerCase());
                if (player) {
                    displayData(player, contentDiv, dataCategory);
                    const playerID = player.playerID;
                    fetchStats(playerID, contentDiv, csvFile, tableName, year);
                } else {
                    contentDiv.innerHTML = `<p>No player found with the name ${firstName} ${lastName}.</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
    };

    document.getElementById('batter-search-button').addEventListener('click', () => {
        const firstName = document.getElementById('batter-first-name').value;
        const lastName = document.getElementById('batter-last-name').value;
        const batterDataDiv = document.getElementById('batterData');
        fetchPlayerCareerData(firstName, lastName, batterDataDiv, 'csv/Batting.csv', 'batter-stats-table', 'Batter');
    });

    document.getElementById('pitcher-search-button').addEventListener('click', () => {
        const firstName = document.getElementById('pitcher-first-name').value;
        const lastName = document.getElementById('pitcher-last-name').value;
        const pitcherDataDiv = document.getElementById('pitcherData');
        fetchPlayerCareerData(firstName, lastName, pitcherDataDiv, 'Pitching.csv', 'pitcher-stats-table', 'Pitcher');
    });
    document.getElementById('batter-compare-button').addEventListener('click', () => {
        const firstName1 = document.getElementById('batter-first-name1').value;
        const lastName1 = document.getElementById('batter-last-name1').value;
        const year1 = document.getElementById('batter-year1').value;
        const firstName2 = document.getElementById('batter-first-name2').value;
        const lastName2 = document.getElementById('batter-last-name2').value;
        const year2 = document.getElementById('batter-year2').value;
        const player1DataDiv = document.getElementById('player1Data');
        const player2DataDiv = document.getElementById('player2Data');
        fetchPlayerData(firstName1, lastName1, player1DataDiv, 'csv/Batting.csv', 'batter-stats-table1', 'Batter', year1);
        fetchPlayerData(firstName2, lastName2, player2DataDiv, 'csv/Batting.csv', 'batter-stats-table2', 'Batter', year2);
    });
    


});
