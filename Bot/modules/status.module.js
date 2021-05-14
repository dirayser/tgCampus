'use strict';

const statusChanger = () => {
  const list = {};
  const statusChanger = {
    set: (userID, status) => {
      list[userID] = status;
    },
    get: userID => list[userID],
    unset: userID => {
      delete list[userID];
    },
  };
  return statusChanger;
};

module.exports = {
  statusChanger,
  courses: {},
};
