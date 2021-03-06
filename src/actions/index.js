import fetch from 'isomorphic-fetch'
import Settings from '../config/settings'

export const DO_LOGIN = 'DO_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const RECEIVE_SIGNOUT = 'RECEIVE_SIGNOUT'

export const CREATE_ACTIVITYLIST = 'CREATE_ACTIVITYLIST'
export const CREATE_ACTIVITY = 'CREATE_ACTIVITY'
export const RECEIVE_ATIVITY_LISTS = 'RECEIVE_ATIVITY_LISTS'
export const RECEIVE_ACTIVITIES = 'RECEIVE_ACTIVITIES'
export const DELETE_ACTIVITYLIST = 'DELETE_ACTIVITYLIST'

// TODO use apisauce
const { apiUrl } = Settings
const api = `${apiUrl}/v1`

function receiveLogin (payload) {
  return {
    type: RECEIVE_LOGIN,
    payload
  }
}

export function signOut () {
  return { type: RECEIVE_SIGNOUT }
}

export function doLogin (email, password) {
  return dispatch => {
    return fetch(`${apiUrl}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(json => dispatch(receiveLogin(json)))
  }
}

function receiveActivities (payload) {
  return {
    type: RECEIVE_ACTIVITIES,
    payload
  }
}

export function fetchActivityList (id) {
  return (dispatch, getState) => {
    const user = getState().settings.user
    if (!user) {
      console.warn('No User')
      dispatch(signOut())
      return
    }
    return fetch(`${api}/activitylist/${id}/activity`, {
      headers: {
        'authorization': user.token
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        dispatch(receiveActivities({ _id: id, ...json }))
      } else {
        dispatch(signOut())
      }
    })
  }
}

export function createActivity (id) {
  return (dispatch, getState) => {
    const user = getState().settings.user
    if (!user) {
      console.warn('No User')
      dispatch(signOut())
      return
    }

    return fetch(`${api}/activitylist/${id}/activity`, {
      headers: {
        'authorization': user.token
      },
      method: 'POST'
    })
    .then(() => { dispatch(fetchActivityList(id)) })
  }
}

export function deleteActivtyList (id) {
  return (dispatch, getState) => {
    const user = getState().settings.user
    if (!user) {
      console.warn('No user')
      dispatch(signOut())
      return
    }

    return fetch(`${api}/activitylist/${id}`, {
      headers: {
        'authorization': user.token
      },
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(json => {
      if (!json.success) {
        dispatch(signOut())
      }
    })
  }
}

export function createActivityList (name) {
  return (dispatch, getState) => {
    const user = getState().settings.user
    if (!user) {
      console.warn('No User')
      dispatch(signOut())
      return
    }

    return fetch(`${api}/activitylist`, {
      headers: {
        'authorization': user.token
      },
      method: 'POST',
      body: JSON.stringify({
        name
      })
    })
    .then(() => dispatch(fetchActivityLists()))
  }
}

function receiveActivityLists (payload) {
  return {
    type: RECEIVE_ATIVITY_LISTS,
    payload
  }
}

export function fetchActivityLists () {
  return (dispatch, getState) => {
    const user = getState().settings.user
    if (!user) {
      console.warn('No User')
      dispatch(signOut())
      return
    }
    return fetch(`${api}/activitylist`, {
      headers: {
        'authorization': user.token
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        dispatch(receiveActivityLists(json))
      } else {
        dispatch(signOut())
      }
    })
  }
}
