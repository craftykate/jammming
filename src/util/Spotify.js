import {secret} from './secret';

const clientId = secret.clientId;
const redirectURI = "http://localhost:3000/";
//const redirectURI = "http://katem-jammming.surge.sh/";
const CORSlink = 'https://cors-anywhere.herokuapp.com/';
let accessToken = '';
let expires_in;
let userInfo;
let playlistID;


let Spotify = {

  // get accesstoken from variable or url
  // if no accesstoken, refresh page
  // THIS CAN BE BETTER: Right now, if there's no accessToken, page will refresh
  // and search term will be lost. An added feature could be to save search searchTerm
  // then get accesstoken and resend searchterm
  getAccessToken() {
    const checkToken = window.location.href.match(/access_token=([^&]*)/);

    if (accessToken) {
      return accessToken;
    } else if (checkToken) {
      this.getTokenInfo();
      return accessToken;
    } else {
      window.location = (`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${redirectURI}`);
    }
  },

  // Get token and epiration time
  getTokenInfo() {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
    expires_in = window.location.href.match(/expires_in=([^&]*)/)[1];
    window.setTimeout(() => accessToken = '', expires_in * 1000);
    window.history.pushState('Access Token', null, '/');
  },

  // Send searchTerm to Spotify and get tracks back
  // Format tracks into an array of formatted objects
  search(searchTerm) {
    const link = `${CORSlink}https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;

    return this.fetchGET(link).then(jsonResponse => {
      if (jsonResponse) {
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
  },

  savePlaylist(playlistName, tracks) {
    if (playlistName && tracks.length > 0) {
      const headers = {
        'Authorization': `Bearer ${this.getAccessToken()}`,
        'Content-Type': 'application/json'
      };
      return this.getUserInfo().then(() =>
        fetch(`https://api.spotify.com/v1/users/${userInfo.id}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: playlistName
          })
        }).then(response => {
          if(response.ok) {
            return response.json();
          }
        }).then(jsonResponse => {
          playlistID = jsonResponse.id;
        }).then(() =>
          fetch(`https://api.spotify.com/v1/users/${userInfo.id}/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: tracks
            })
          }).then(response => {
            if(response.ok) {
              return response.json();
            }
          }).then(jsonResponse => {
          })
        )
      );
    } else {
      return;
    }
  }, // savePlaylist()

  // get user info, store object in variable
  getUserInfo() {
    const link = `${CORSlink}https://api.spotify.com/v1/me`;

    return this.fetchGET(link).then(jsonResponse => {
      userInfo = jsonResponse;
    })
  },

  // Reusable fetch code, returns json response
  fetchGET(link) {
    const headers = {
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    };

    return fetch(link,{ headers: headers}).then(response => {
      if (response.ok) {
        return response.json();
      }
    });
  }
};

export default Spotify;
