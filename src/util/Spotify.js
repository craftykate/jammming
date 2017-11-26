import {secret} from './secret';

const clientId = secret.clientId;
const redirectURI = "http://localhost:3000/";
const CORSlink = 'https://cors-anywhere.herokuapp.com/';
let userInfo;
let playlistID;
let accessToken = '';
let expires_in;


let Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log(`AccessToken okay`);
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expires_in = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expires_in * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log(`AccessToken retrieved`);
    } else {
      console.log(`Crap`);
      window.location = (`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${redirectURI}`);
    }
  }, // end getAccessToken()

  search(searchTerm) {
    const headers = {Authorization: `Bearer ${this.getAccessToken()}`};
    return fetch(`${CORSlink}https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
      headers: headers
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      console.log(jsonResponse);
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
  }, // end search()

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
          console.log(jsonResponse);
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
            console.log(jsonResponse);
          })
        )
      );
    } else {
      return;
    }
  }, // savePlaylist()

  getUserInfo() {
    const headers = {Authorization: `Bearer ${this.getAccessToken()}`};
    return fetch(`${CORSlink}https://api.spotify.com/v1/me`,{
      headers: headers
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      userInfo = jsonResponse;
    })
  }, // getUserInfo()
};

export default Spotify;
