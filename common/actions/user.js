import 'isomorphic-fetch';
import * as types from '../constants/action-types';
import address from '../lib/address';
import { userSchema, topicSchema, replySchema } from '../constants/schema';
import { normalize, arrayOf } from 'normalizr';

function receiveUsers(entities, users) {
  return {
    type: types.RECEIVE_USERS,
    entities,
    users
  }
}


export function getUserProfile(username) {

  return (dispatch) => {
    return fetch(address.user(username))
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data.user) {

          data.user.meta = data.meta;
          const normalized = normalize([data.user], arrayOf(userSchema));
          dispatch(receiveUsers(normalized.entities, normalized.result));
        }

        return { error: "fetch user error" };
      })
      .catch(e => { return { error: e.message }});
  }
}

export function getUserTopics(user_or_username, offset, limit) {

  return dispatch => {
    let username = user_or_username;
    if (typeof  user_or_username === 'object') {
      username = user_or_username.login;
    }
    return fetch(address.userTopics(username, offset, limit))
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error }
        }

        if (data && data.topics && Array.isArray(data.topics)) {

          let normalized;

          if (typeof user_or_username === 'object') {

            user_or_username.topics = Array.from(new Set([...user_or_username.topics, data.topics]));
            normalized = normalize([user_or_username], arrayOf(userSchema));

          } else {

            data.login = username;
            normalized = normalize([data], arrayOf(userSchema));

          }

          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }

        return { error: "fetch user topics error" };
      })
      .catch( e => { return { error: e.message }});
  }
}


export function getUserReplies(username) {

  return (dispatch) => {

    return fetch(address.userReplies(username))
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data && data.replies) {

          data.login = username;
          const normalized = normalize([data], arrayOf(userSchema));
          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }

        return { error: "fetch user replies error" };
      })
      .catch( e => { return { error: e.message }});
  }
}

export function getUserFollowers(username) {

  return (dispatch) => {

    return fetch(address.userFollowers(username))
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data && data.followers) {

          data.login = username;
          const normalized = normalize([data], arrayOf(userSchema));
          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }

        return { error: "fetch user followers error" };
      })
      .catch( e => { return { error: e.message }});
  }
}

export function getUserFollowing(username) {

  return dispatch => {

    return fetch(address.userFollowing(username))
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data && data.following) {
          data.login = username;
          const normalized = normalize([data], arrayOf(userSchema));
          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }

        return { error: "fetch user followers error" };
      })
      .catch( e => { return { error: e.message }});
  }
}

export function getUserProfileAndTopics(username) {

  return dispatch => {
    return Promise.all([
      dispatch(getUserProfile(username)),
      dispatch(getUserTopics(username))
    ])
      .catch( e => { return { error: e.message } });
  };

}

export function followUser(user) {

  return dispatch => {
    return fetch(address.userFollow(user.login), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data && data.ok && data.ok === 1) {
          user.meta.followed = true;
          const normalized = normalize([user], arrayOf(userSchema));
          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }


        return { error: "follow user error" };
      })
      .catch( e => { return { error: e.message }});
  }

}

export function unfollowUser(user) {

  return dispatch => {
    return fetch(address.userUnfollow(user.login), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {

        if (data && data.error) {
          return { error: data.error };
        }

        if (data && data.ok && data.ok === 1) {
          user.meta.followed = false;
          const normalized = normalize([user], arrayOf(userSchema));
          return dispatch(receiveUsers(normalized.entities, normalized.result));
        }


        return { error: "follow user error" };
      })
      .catch( e => { return { error: e.message }});
  }

}
