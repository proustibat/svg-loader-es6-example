
import 'reset-css/reset.css';
import '../styles/main.scss';

import './utils';
import App from './app';

// Generated by build workflow
import './app-info';

if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( 'Looks like we are in development mode!' );
}

document.ready().then( () => {
    if ( document.querySelector( '.js-tag-app' ) ) {
        /* eslint-disable */
        new App();
        /* eslint-enable */
    }
} );
