import {secret} from './secret';

const clientId = secret.clientId;
const redirectURI = "http://localhost:3000/";
//const redirectURI = "http://katem-jammming.surge.sh/";
let accessToken = '';
let expires_in;
let userInfo;


let Spotify = {

  // get accesstoken from variable or url
  // if no accesstoken, refresh page
  // THIS CAN BE BETTER: Right now, if there's no accessToken, page will refresh and search term will be lost. An added feature could be to save search searchTerm then get accesstoken and resend searchterm
  // I plan to fix the above issue in the feature request project because it's super annoying
  getAccessToken() {
    // check if url contains access token
    const checkToken = window.location.href.match(/access_token=([^&]*)/);

    if (accessToken) {
      return accessToken;
    } else if (checkToken) {
      this.getTokenInfo();
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${redirectURI}`;
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
    const link = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;

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

  // Save playlist to Spotify if playlist contains tracks
  savePlaylist(playlistName, tracks) {
    if (playlistName && tracks.length > 0) {
      // get userinfo for POST link
      return this.getUserInfo()
      .then(() =>
        // send user id and playlist name to create new playlist
        this.fetchPOST(`https://api.spotify.com/v1/users/${userInfo.id}/playlists`, JSON.stringify({name: playlistName}))
        // new playlist info is returned and used as jsonResponse
        .then((jsonResponse) =>
          // save tracks to correct playlist id
          this.fetchPOST(`https://api.spotify.com/v1/users/${userInfo.id}/playlists/${jsonResponse.id}/tracks`, JSON.stringify({uris: tracks}))
        )
      );
    } else {
      return;
    }
  },

  // get user info, store object in variable
  getUserInfo() {
    const link = `https://api.spotify.com/v1/me`;
    return this.fetchGET(link).then(jsonResponse => {
      userInfo = jsonResponse;
    })
  },

  // Reusable fetch post code, returns json response
  fetchPOST(link, fetchBody) {
    const headers = this.getHeaders();
    return fetch(link, {
      method: 'POST',
      headers: headers,
      body: fetchBody
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
    })
  },

  // Reusable fetch get code, returns json response
  fetchGET(link) {
    const headers = this.getHeaders();
    return fetch(link,{ headers: headers}).then(response => {
      if (response.ok) {
        return response.json();
      }
    });
  },

  // Refactoring the fuck out of this thing, yo
  // headers for fetch get/post
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    };
  }
};

export default Spotify;
