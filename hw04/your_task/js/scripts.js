const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

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

const getTracks = (term) => {
    console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section 
        of the DOM...`);

    const query = baseURL + `?q=${term}&type=track`;
    fetch(query)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('tracks:',data);
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
                    <section class="track-item preview" data-preview-track="${trackObject.preview_url}">
                        <img src="${trackObject.album.image_url}">
                        <i class="fas play-track fa-play" aria-hidden="true"></i>
                        <div class="label">
                            <h3>${trackObject.name}</h3>
                            <p>${trackObject.artist.name}</p>
                        </div>
                    </section>`;
            }
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
                <section class="album-card" id="${albumObject.id}">
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
                <section class="artist-card" id="${artistObject['id']}">
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


document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};