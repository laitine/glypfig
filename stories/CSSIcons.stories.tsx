import React from 'react';

import '../icon-library/css/icons.css';
import './icon-style.css';

import {Meta} from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const CSS = () => (
  <div className="component-grid" data-format="css">
    <span className="css-icon css-icon--icon-company" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-entrepreneur" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-family-1" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-family-2" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-mover" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-senior" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-traveler" aria-hidden="true"></span>
    <span className="css-icon css-icon--icon-youth" aria-hidden="true"></span>
  </div>
);
