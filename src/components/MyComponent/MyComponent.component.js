import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import './MyComponent.css';

export default class MyComponent extends PureComponent {
    static propTypes = {};

    render() {
        const {} = this.props;

        return <div className={`MyComponent`}>MyComponent</div>;
    }
}
