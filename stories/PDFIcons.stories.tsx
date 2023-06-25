import React from 'react';

import IconCompany from '../icon-library/pdf/company.pdf';
import IconEntrepreneur from '../icon-library/pdf/entrepreneur.pdf';
import IconFamily1 from '../icon-library/pdf/family-1.pdf';
import IconFamily2 from '../icon-library/pdf/family-2.pdf';
import IconMover from '../icon-library/pdf/mover.pdf';
import IconSenior from '../icon-library/pdf/senior.pdf';
import IconTraveler from '../icon-library/pdf/traveler.pdf';
import IconYouth from '../icon-library/pdf/youth.pdf';

import './icon-style.css';

import {Meta} from '@storybook/react';

export default {
  title: 'Glypfig/Icons',
} as Meta;

export const PDF = () => (
  <div className="icon-grid">
    <iframe width="24px" height="24px" src={IconCompany} />
    <iframe width="24px" height="24px" src={IconEntrepreneur} />
    <iframe width="24px" height="24px" src={IconFamily1} />
    <iframe width="24px" height="24px" src={IconFamily2} />
    <iframe width="24px" height="24px" src={IconMover} />
    <iframe width="24px" height="24px" src={IconSenior} />
    <iframe width="24px" height="24px" src={IconTraveler} />
    <iframe width="24px" height="24px" src={IconYouth} />
  </div>
);
