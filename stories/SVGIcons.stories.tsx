import React from 'react';

import IconCompany from '../icon-library/svg/company.svg';
import IconEntrepreneur from '../icon-library/svg/entrepreneur.svg';
import IconFamily from '../icon-library/svg/family.svg';
import IconMover from '../icon-library/svg/mover.svg';
import IconSenior from '../icon-library/svg/senior.svg';
import IconTraveler from '../icon-library/svg/traveler.svg';
import IconYouth from '../icon-library/svg/youth.svg';

import './icon-style.css';

import { Meta } from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const SVG = () => (
  <div className="icon-grid">
    <img src={IconCompany} />
    <img src={IconEntrepreneur} />
    <img src={IconFamily} />
    <img src={IconMover} />
    <img src={IconSenior} />
    <img src={IconTraveler} />
    <img src={IconYouth} />
  </div>
);
