import React from 'react';

import '../icon-library/css/icons.css';
import './icon-style.css';

import {Meta} from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const CSS = () => (
  <div className="icon-grid" data-format="css">
    <span className="css-icon css-icon--icon-company css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-entrepreneur css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-family-1 css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-family-2 css-icon--size-xl" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-mover css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-senior css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-traveler css-icon--size-m" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-youth css-icon--size-m" aria-hidden="true"></span>
  </div>
);
