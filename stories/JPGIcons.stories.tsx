import React from 'react';

import IconCompany from '../icon-library/jpg/company.jpg';
import IconEntrepreneur from '../icon-library/jpg/entrepreneur.jpg';
import IconFamily1 from '../icon-library/jpg/family-1.jpg';
import IconFamily2 from '../icon-library/jpg/family-2.jpg';
import IconMover from '../icon-library/jpg/mover.jpg';
import IconSenior from '../icon-library/jpg/senior.jpg';
import IconTraveler from '../icon-library/jpg/traveler.jpg';
import IconYouth from '../icon-library/jpg/youth.jpg';

import './icon-style.css';

import {Meta} from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const JPG = () => (
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
