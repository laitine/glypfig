import React from 'react';

import IconCompany from '../icon-library/react/IconCompany.jsx';
import IconEntrepreneur from '../icon-library/react/IconEntrepreneur.jsx';
import IconFamily from '../icon-library/react/IconFamily.jsx';
import IconMover from '../icon-library/react/IconMover.jsx';
import IconSenior from '../icon-library/react/IconSenior.jsx';
import IconTraveler from '../icon-library/react/IconTraveler.jsx';
import IconYouth from '../icon-library/react/IconYouth.jsx';

import './icon-style.css';

export default {
  title: 'Glypfig/Icons/React',
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object'
    },
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    ariaHidden: {
      control: 'boolean'
    },
    color: {
      control: 'text'
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl']
    }
  },
};

export const JSX = ({...args}) => (
  <div className="component-grid" data-format="jsx">
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
    <IconFamily size="xs" {...args} />
    <IconFamily size="s" {...args} />
    <IconFamily size="m" {...args} />
    <IconFamily size="l" {...args} />
    <IconFamily size="xl" {...args} />
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
