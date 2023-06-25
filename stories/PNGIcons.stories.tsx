import React from 'react';

import IconCompany from '../icon-library/png/company.png';
import IconEntrepreneur from '../icon-library/png/entrepreneur.png';
import IconFamily1 from '../icon-library/png/family-1.png';
import IconFamily2 from '../icon-library/png/family-2.png';
import IconMover from '../icon-library/png/mover.png';
import IconSenior from '../icon-library/png/senior.png';
import IconTraveler from '../icon-library/png/traveler.png';
import IconYouth from '../icon-library/png/youth.png';

import './icon-style.css';

import {Meta} from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const PNG = () => (
  <div className="icon-grid">
    <img src={IconCompany} />
    <img src={IconEntrepreneur} />
    <img src={IconFamily1} />
    <img src={IconFamily2} />
    <img src={IconMover} />
    <img src={IconSenior} />
    <img src={IconTraveler} />
    <img src={IconYouth} />
  </div>
);
