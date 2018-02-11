import { setTestAction } from './test.actions';

import { createReducer } from '/helpers';

export default createReducer(true, {
    [setTestAction().type]: (state, { test }) => test,
});
