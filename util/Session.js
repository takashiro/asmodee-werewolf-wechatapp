
import Role from '../game/Role';

function readSession(roomKey) {
  let sessions = wx.getStorageSync('sessions');
  if (sessions && sessions instanceof Array) {
    return sessions.find(session => session.roomKey === roomKey);
  } else {
    return null;
  }
}

function saveSession(session) {
  let sessions = wx.getStorageSync('sessions');
  if (!sessions || !(sessions instanceof Array)) {
    sessions = [];
  }

  let saved = sessions.find(saved => saved.roomKey === session.roomKey);
  if (saved) {
    saved = Object.assign(saved, session);
  } else {
    sessions.push(session);
  }

  if (sessions.length > 10) {
    sessions.splice(0, sessions.length - 10);
  }

  wx.setStorageSync('sessions', sessions);
}

class Session {

  constructor(roomKey) {
    this.roomKey = roomKey;

    let session = readSession(roomKey);
    if (session) {
      this.seatKey = session.seatKey;
      this.role = session.role;
      this.cards = session.cards || [];
    } else {
      this.seatKey = Math.floor(Math.random() * 0xFFFF) + 1;
      this.role = Role.Unknown;
      this.cards = [];
    }
  }

  save() {
    saveSession({
      roomKey: this.roomKey,
      seatKey: this.seatKey,
      role: this.role,
      cards: this.cards,
    });
  }

}

export default Session;