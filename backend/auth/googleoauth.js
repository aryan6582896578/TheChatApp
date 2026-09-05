import { google } from 'googleapis';
import crypto from 'crypto';
// const express = require('express');
// const session = require('express-session');
import express from 'express';
import session from 'express-session';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GoogleClientId,
  process.env.GoogleClientSecret,
  process.env.GoogleRedirectURL,
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
export function getGoogleAuthUrl(){
const state = crypto.randomBytes(32).toString('hex');
// req.session.state = state;

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: scopes,
  include_granted_scopes: true,
  state: state
});
    // console.log(authorizationUrl)
    return authorizationUrl
}
