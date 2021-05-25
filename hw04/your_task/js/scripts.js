const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';
const unsimplifiedBaseURL = 'https://www.apitutor.org/spotify/v1/';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const updateResultsTracksDOM = (data) => {     // data = tracks list
    console.log('tracks:', data);
    let stop;
    if (data.length > 5) stop = 5;
    else if (data.length > 0) stop = data.length;
    else {      // data.length == 0
        console.log('No matching tracks found.');
        document.querySelector('#tracks').innerHTML = '<h3 style="color:gray">No matching tracks found.</h3>';
        return
    }
    document.querySelector('#tracks').innerHTML = '';   // clear out div
    for (let i = 0; i < stop; i++) {
        const trackObject = data[i];
        console.log(trackObject);

        // *** if (!trackObject.preview_url) { // if it's not null it's true. equivalently the following.
        // maybe require ';' after onclick value? sarah does it
        document.querySelector('#tracks').innerHTML += `
            <section class="track-item preview" data-preview-track="${trackObject.preview_url}" onclick="updateFooter(event); audioPlayer.togglePlay(); showFooter()">
                <img src="${trackObject.album.image_url}">
                <i class="fas play-track fa-play" aria-hidden="true"></i>
                <div class="label">
                    <h3>${trackObject.name}</h3>
                    <p>${trackObject.artist.name}</p>
                </div>
            </section>`;

        if (trackObject.preview_url === null) {
            const tracks = document.querySelectorAll('.track-item.preview');
            console.log(tracks);
            tracks[tracks.length - 1].querySelector('p').innerHTML += ' - No preview available';
            tracks[tracks.length - 1].removeAttribute('onclick');
        }
    }
}

const getTracks = (term) => {
    console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section 
        of the DOM...`);

    const q = baseURL + `?q=${term}&type=track`;
    fetch(q)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('getting tracks...')
            updateResultsTracksDOM(data);
        });
};

const getAlbums = (term) => {
    console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);

    const query = baseURL + `?q=${term}&type=album`;
    fetch(query)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.length == 0) {
                console.log('No matching albums found.');
                document.querySelector('#albums').innerHTML = '<h3 style="color:gray">No matching albums found</h3>';
                return
            }
            document.querySelector('#albums').innerHTML = '';   // clear out the div
            for (const albumObject of data) {
                console.log('albumObject:', albumObject);
                document.querySelector('#albums').innerHTML += `
                <section class="album-card" id="${albumObject.id}" onclick="albumTracks(event)">
                    <div>
                        <img src="${albumObject.image_url}">
                        <h3>${albumObject.name}</h3>
                        <div class="footer">
                            <a href="${albumObject.spotify_url}">view on spotify</a>
                        </div>
                    </div>
                </section>`;
            }
        });
};

const getArtist = (term) => {
    console.log(`
        get artists from spotify based on the search term
        "${term}" and load the first artist into the #artist section 
        of the DOM...`);

    const query = baseURL + `?q=${term}&type=artist`;
    fetch(query)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.length == 0) {
                console.log('No matching artist found.');
                document.querySelector('#artist').innerHTML = '<h3 style="color:gray">No matching artists found.</h3>';
                return
            }
            const artistObject = data[0];
            console.log('artistObject:', artistObject);
            document.querySelector('#artist').innerHTML = `
                <section class="artist-card" id="${artistObject['id']}" onclick="topTracks(event)">
                <div>
                    <img src="${artistObject['image_url']}">
                    <h3>${artistObject['name']}</h3>
                    <div class="footer">
                        <a href="${artistObject['spotify_url']}" target="_blank">
                            view on spotify
                        </a>
                    </div>
                </div>
                </section>`
        });
};

const updateFooter = (ev) => {
    console.log(ev.currentTarget);
    const elem = ev.currentTarget;

    // *** how to start query selecting from a spot in the dom if did not copy paste html from tracks
    // const img = elem.querySelector('img');

    // const previewURL = elem.dataset.previewTrack;   // *** dataset. camelcase the attribute. synonymous with following two
    // const previewURL = elem.data-preview-track;
    const previewURL = elem.getAttribute('data-preview-track');
    if (audioPlayer.getAudioFile() !== previewURL) {
        audioPlayer.setAudioFile(previewURL);
        // audioPlayer.play();  // audioPlayer.togglePlay() called in onclick
    }    
    // important to account for fact that not all songs have preview urls
    // update the track item preview in the page's footer    
    const footer = document.querySelector('footer .track-item').innerHTML = elem.innerHTML;
}


document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    // *** implementing enter keystroke to search
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};

const updateTopTracksDOM = (data) => {     // data = tracks list
    console.log('tracks:', data);
    let stop;
    if (data.length > 5) stop = 5;
    else if (data.length > 0) stop = data.length;
    else {      // data.length == 0
        console.log('No matching tracks found.');
        document.querySelector('#tracks').innerHTML = '<h3 style="color:gray">No matching tracks found.</h3>';
        return
    }
    document.querySelector('#tracks').innerHTML = '';   // clear out div
    for (let i = 0; i < stop; i++) {
        const trackObject = data[i];
        console.log(trackObject);

        document.querySelector('#tracks').innerHTML += `
        <section class="track-item preview" data-preview-track="${trackObject.preview_url}" onclick="updateFooter(event); audioPlayer.togglePlay(); showFooter()">
           <img src="${trackObject.album.images[0].url}">
            <i class="fas play-track fa-play" aria-hidden="true"></i>
            <div class="label">
                <h3>${trackObject.name}</h3>
                <p>${trackObject.artists[0].name}</p>
            </div>
        </section>`;

        // *** if (!trackObject.preview_url) { // if it's not null it's true. equivalently the following.
        if (trackObject.preview_url === null) { // don't attach event handler if no preview_url
            const tracks = document.querySelectorAll('.track-item.preview');
            console.log(tracks);
            tracks[tracks.length - 1].querySelector('p').innerHTML += ' - No preview available';
            tracks[tracks.length - 1].removeAttribute('onclick');
        }
    }
}

const topTracks = (ev) => {
    console.log(`
    get top tracks from spotify based on the search term
    "${document.querySelector('.artist-card h3').innerText}" and load top tracks into the #tracks section
    of the DOM...`);
    const artistID = ev.currentTarget.getAttribute('id');
    const query = unsimplifiedBaseURL + `artists/${artistID}/top-tracks?country=us`;

    console.log(query);

    fetch(query)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('getting top tracks...');
            console.log(data);
            updateTopTracksDOM(data.tracks);
        });
}

const updateAlbumTracksDOM = (data, albumImage) => {
    console.log('tracks:', data);
    const albumTracks = data.items;

    let stop;
    if (albumTracks.length > 5) stop = 5;
    else if (albumTracks.length > 0) stop = albumTracks.length;
    else {      // data.length == 0
        console.log('No matching tracks found.');
        document.querySelector('#tracks').innerHTML = '<h3 style="color:gray">No matching tracks found.</h3>';
        return
    }

    document.querySelector('#tracks').innerHTML = '';   // clear out div
    for (let i = 0; i < stop; i++) {
        const trackObject = albumTracks[i];
        console.log(trackObject);

        document.querySelector('#tracks').innerHTML += `
            <section class="track-item preview" data-preview-track="${trackObject.preview_url}" onclick="updateFooter(event); audioPlayer.togglePlay(); showFooter()">
                <img src="${albumImage}">
                <i class="fas play-track fa-play" aria-hidden="true"></i>
                <div class="label">
                    <h3>${trackObject.name}</h3>
                    <p>${trackObject.artists[0].name}</p>
                </div>
            </section>`;

        // *** if (!trackObject.preview_url) { // if it's not null it's true. equivalently the following.
        if (trackObject.preview_url === null) { // don't attach event handler if no preview_url
            const tracks = document.querySelectorAll('.track-item.preview');
            console.log(tracks);
            tracks[tracks.length - 1].querySelector('p').innerHTML += ' - No preview available';
            tracks[tracks.length - 1].removeAttribute('onclick');
        }
    }
}

const albumTracks = (ev) => {
    const elem = ev.currentTarget;
    console.log(`
        get album tracks from spotify based on the search term
        "${elem.querySelector('h3').innerText}" and load tracks into the #tracks section
        of the DOM...`);
    const albumID = elem.id;
    const albumImage = elem.querySelector('img').src;
    console.log(albumImage);
    const query = unsimplifiedBaseURL + `albums/${albumID}/tracks`;
    fetch(query)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateAlbumTracksDOM(data, albumImage);
        });
}

const showFooter = () => {
    document.querySelector('footer').style = 'display: flex';
}