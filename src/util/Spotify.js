import {secret} from './secret';

const clientId = secret.clientId;
const redirectURI = "http://localhost:3000/";
const CORSlink = 'https://cors-anywhere.herokuapp.com/';
let accessToken;
let expires_in;


let Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log(`AccessToken okay: ${accessToken}`);
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expires_in = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expires_in * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log(`AccessToken retrieved: ${accessToken}`);
    } else {
      window.location = (`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`)
      console.log(`Crap: ${accessToken}`);
    }
  }, // end getAccessToken()

  search(searchTerm) {
    this.getAccessToken();
    return fetch(`${CORSlink}https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      console.log(jsonResponse);
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      } else {
        return [];
      }
    });
  } // end search()
};

export default Spotify;
