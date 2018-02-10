import React, {
    PureComponent,
} from 'react';

import PropTypes from 'prop-types';

import './Test.css';

export default class Test extends PureComponent {
    static propTypes = {};

    render() {
        const {  } = this.props;

        return (
            <div className={`Test`}>Test</div>
        );
    }
}
