import React from 'react';

import {IconCompany} from '../icon-library/react/tsx/IconCompany.tsx';
import {IconEntrepreneur} from '../icon-library/react/tsx/IconEntrepreneur.tsx';
import {IconFamily1} from '../icon-library/react/tsx/IconFamily1.tsx';
import {IconFamily2} from '../icon-library/react/tsx/IconFamily2.tsx';
import {IconMover} from '../icon-library/react/tsx/IconMover.tsx';
import {IconSenior} from '../icon-library/react/tsx/IconSenior.tsx';
import {IconTraveler} from '../icon-library/react/tsx/IconTraveler.tsx';
import {IconYouth} from '../icon-library/react/tsx/IconYouth.tsx';

import './icon-style.css';

export default {
  title: 'Glypfig/Icons/React',
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
    ariaLabel: {
      control: 'text',
    },
    ariaLabelledby: {
      control: 'text',
    },
    ariaHidden: {
      control: 'boolean',
    },
    color: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
  },
};

export const TSX = ({...args}) => (
  <div className="component-grid" data-format="tsx">
    <IconCompany size="xs" {...args} />
    <IconCompany size="s" {...args} />
    <IconCompany size="m" {...args} />
    <IconCompany size="l" {...args} />
    <IconCompany size="xl" {...args} />
    <IconEntrepreneur size="xs" {...args} />
    <IconEntrepreneur size="s" {...args} />
    <IconEntrepreneur size="m" {...args} />
    <IconEntrepreneur size="l" {...args} />
    <IconEntrepreneur size="xl" {...args} />
    <IconFamily1 size="xs" {...args} />
    <IconFamily1 size="s" {...args} />
    <IconFamily1 size="m" {...args} />
    <IconFamily1 size="l" {...args} />
    <IconFamily1 size="xl" {...args} />
    <IconFamily2 size="xs" {...args} />
    <IconFamily2 size="s" {...args} />
    <IconFamily2 size="m" {...args} />
    <IconFamily2 size="l" {...args} />
    <IconFamily2 size="xl" {...args} />
    <IconMover size="xs" {...args} />
    <IconMover size="s" {...args} />
    <IconMover size="m" {...args} />
    <IconMover size="l" {...args} />
    <IconMover size="xl" {...args} />
    <IconSenior size="xs" {...args} />
    <IconSenior size="s" {...args} />
    <IconSenior size="m" {...args} />
    <IconSenior size="l" {...args} />
    <IconSenior size="xl" {...args} />
    <IconTraveler size="xs" {...args} />
    <IconTraveler size="s" {...args} />
    <IconTraveler size="m" {...args} />
    <IconTraveler size="l" {...args} />
    <IconTraveler size="xl" {...args} />
    <IconYouth size="xs" {...args} />
    <IconYouth size="s" {...args} />
    <IconYouth size="m" {...args} />
    <IconYouth size="l" {...args} />
    <IconYouth size="xl" {...args} />
  </div>
);
