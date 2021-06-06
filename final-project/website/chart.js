let myLabels = []; // 0:00 to 24:00 in increments of 10 minutes
for (let index = 0; index < 145; index++) {
    let hours = Math.floor(index / 6);
    if (hours < 10) {
        hours = '0' + hours;
    }
    const minutes = index % 6 + '0';
    const time = hours + ':' + minutes;
    myLabels.push(time);
}

const displayChart = (arr) => {
    // ------------- configuring chart -------------------
    const values = arr

    const myData = {
        labels: myLabels,
        datasets: [{
            label: 'Vaccine availability',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: values,
        }]
    }

    const config = {
        type: 'line',
        data: myData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }
                },
            }
        }
    }
    // --------------- displaying chart ---------------    
    document.querySelector('#location-info').innerHTML = `
        <div id="location-info-not-chart" style="padding: 10px;">            
        </div>
        <canvas id="myChart"></canvas>`

    let myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
// ===================================== above is chart.js stuff =====================================

const indexOfValue = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            return i
        }
    }
}

const getMax = (arr) => {
    let runningMax = 0
    for (const el of arr) {
        if (el > runningMax) {
            runningMax = el
        }
    }
    return runningMax
}

const displayInfo = (storeEl, arr) => {
    const displayInfoEl = document.querySelector('#location-info-not-chart')
    displayInfoEl.innerHTML = ''
    console.log(storeEl)
    console.log(storeEl.querySelector('h3').innerHTML)
    let template = `
        <h2>${storeEl.querySelector('h3').innerHTML}</h2>
        <p>Time with greatest vaccine availability: `
    const maxAvailability = getMax(arr) // setting parameter to variable declared in function will not change parameter bc variable gets garbage collected(probably). need to return instead
    if (maxAvailability == 0) {
        template += `
            <em>not enough data</em></p>`
    } else {
        const correspondingTime = myLabels[indexOfValue(arr, maxAvailability)]
        template += `
            <em>${correspondingTime}</em></p>
            <p>Your best shot at landing an appointment is to check back at around that time.</p>`
    }
    displayInfoEl.innerHTML = template
}

const displayVaccineUnavailableInfo = (ev) => {
    const store = ev.currentTarget
    console.log(store)
    let historic_data = JSON.parse(store.dataset.historic_data)
    console.log(typeof historic_data) // typeof historic_data == Object
    console.log(historic_data)
    displayChart(historic_data)
    displayInfo(store, historic_data)
}

const averageOfArray = (arr) => {
    if (arr == []) {
        return null // for some reason, this returns as NaN
    }
    let runningSum = 0
    for (let i = 0; i < arr.length; i++) {
        runningSum += arr[i]
    }
    return runningSum / arr.length
}

const displayStores = (arr) => {
    const storesElement = document.querySelector('#stores')
    storesElement.innerHTML = ''
    let template = ''
    for (const store of arr) {
        let historicDataString = '['
        for (let i = 0; i < store.historic_data.length; i++) {
            const dataForTime = store.historic_data[i]
            if (Number.isNaN(averageOfArray(dataForTime))) {
                historicDataString += `null`
            } else {
                historicDataString += `${averageOfArray(dataForTime)}`
            }
            if (i !== store.historic_data.length - 1) {
                historicDataString += ','
            }
        }
        historicDataString += ']'
        template = `
                <div id="store-card" data-id="${store.id}" 
                        data-availability="${store.availability}" 
                        data-link="${store.coach_url}"
                        data-historic_data="${historicDataString}">
                    <h3>${store.address}</h3>
                    <p>Are vaccines currently available: <em>${store.availability}</em></p>
                    <p>Vaccines available: <em>${store.drugName}</em></p>
                </div>`
        storesElement.innerHTML += template
    }
    let allStores = document.querySelectorAll('#store-card')
    for (const store of allStores) {
        if (store.dataset.availability == 'yes') {
            store.innerHTML += `
                <p><a style="color:blue" href="${store.dataset.link}">Click to schedule at this location</a></p>`
            store.style = 'background: lightgreen'
        } else {
            store.innerHTML += `
                <p><a style="color:#FF6384" href="#">Click to view historic vaccine availability</a></p>`
            store.onclick = displayVaccineUnavailableInfo
        }
    }
}

const filterStores = (indicesToRemove, arr) => {
    while (indicesToRemove.length !== 0) {
        arr.splice(indicesToRemove.pop(), 1)
    }
}

const distance = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d * 0.621371;
}

const filterAndDisplayStores = (zip) => {
    fetch('/parser/data.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            let localData = data
            fetch('https://s3-us-west-2.amazonaws.com/mhc.cdn.content/vaccineAvailability.json')
                .then(response => {
                    return response.json()
                })
                .then(apiData => {
                    for (let i = 0; i < localData.length; i++) {
                        localData[i].availability = apiData[i].availability
                    }
                    const apiKey = 'R8Jk1lk0CB2b9cO8qvnae8or0pOgG9HV'
                    fetch(`http://open.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${zip}`)
                        .then(response => {
                            return response.json()
                        })
                        .then(data => {
                            const possibleLocations = data
                            console.log(possibleLocations)
                            let home;
                            for (const location of possibleLocations.results[0].locations) {
                                if (location.adminArea1 == 'US') {
                                    home = location // return the last location in the US
                                }
                            }
                            if (home == undefined) {
                                console.log('could not find zip code in the US')
                            }
                            const homeLat = home.latLng.lat
                            const homeLong = home.latLng.lng
                            // console.log(`${zip}: ${typeof homeLat}, lat: ${homeLat}, long: ${homeLong}`) --- KANSAS DEBUG
                            let indicesToRemove = []
                            for (let index = 0; index < localData.length; index++) {
                                if (distance(localData[index].lat, localData[index].long, homeLat, homeLong) >= 10) {
                                    // console.log('should be >= 10:',distance(localData[index].lat, localData[index].long, homeLat, homeLong),'long lat i\'m comparing against:', homeLat, homeLong, localData[index]) --- KANSAS DEBUG
                                    indicesToRemove.push(index)
                                }
                            }
                            filterStores(indicesToRemove, localData)
                            console.log('filtered data:', localData)
                            if (localData.length == 0) {
                                document.querySelector('#location-info-not-chart').innerHTML = `
                                    <h2>No Safeway locations within 10 miles</h2>`
                            }
                            displayStores(localData)
                        });
                });
        });
}

const search = (ev) => {
    const zip = document.querySelector('#search').value
    console.log('find coordinates for:', zip)
    filterAndDisplayStores(zip)
    if (ev) {
        ev.preventDefault()
    }
}

document.querySelector('#search').onkeyup = (ev) => {
    if (ev.keyCode === 13) {
        ev.preventDefault()
        search()
    }
}