import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;


export const selectUserId = (state) => state.auth.user?.id ?? null;
export const selectUserEmail = (state) => state.auth.user?.email ?? null;
export const selectUserFirstName = (state) => state.auth.user?.firstName ?? null;
export const selectUserLastName = (state) => state.auth.user?.lastName ?? null;
export const selectUserGroup = (state) => state.auth.user?.group ?? null;
export const selectUserRole = (state) => state.auth.user?.role ?? null;



export const selectUserFullName = createSelector(
  [selectUserFirstName, selectUserLastName],
  (firstName, lastName) => {
    if (!firstName && !lastName) return null;
    return `${firstName || ''} ${lastName || ''}`.trim();
  }
);


export const selectIsHeadman = createSelector(
  [selectUserRole],
  (role) => role === 'Headman'
);

export const selectIsStudent = createSelector(
  [selectUserRole],
  (role) => role === 'Student'
);