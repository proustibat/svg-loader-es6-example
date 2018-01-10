
import 'reset-css/reset.css';
import '../styles/main.scss';

import '../vendors/prismjs/prism.css';
import '../vendors/prismjs/prism';

import './utils';
import App from './app';
import Generator from './generator';
import Dashboard from './dashboard';

// Generated by build workflow
import './app-info';

if ( process.env.NODE_ENV !== 'production' ) {
    console.warn( 'Looks like we are in development mode!' );
}

document.ready().then( () => {
    // Find JS class to run depending on data-page-slug
    const selector = 'data-page-slug';
    const el = document.querySelector( `[${ selector }]` );
    const SlugClass = { App, Generator, Dashboard }[ el.getAttribute( selector ) ];

    // Instantiation if a class is found
    if ( SlugClass ) {
        new SlugClass( el );
    }
} );
