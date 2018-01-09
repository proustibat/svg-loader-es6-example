import * as Data from '../assets/data';
import { SVGLoader } from 'svg-loader-es6';
import { modal as TingleModal } from 'tingle.js';
import 'tingle.js/src/tingle.css';
import '../vendors/prismjs/prism.css';
import '../vendors/prismjs/prism';

export default class App {
    constructor () {
        console.log( 'Hello App' );
        this.loadersOptions = Data.loadersOptions;
        this.page = document.querySelector( '.page' );
        this.loaders = this.createLoaders();
        this.listenDom();
        this.listenReset();
    }

    createLoaders () {
        return this.loadersOptions.filter( options => this.page.querySelectorAll( `#${ options.containerId }` ).length > 0 ).map( options => new SVGLoader( options ) );
    }

    prepareDom () {
        for ( let i = 1, l = this.loadersOptions.length; i <= l; i++ ) {
            const sectionEl = document.createElement( 'section' );
            const exampleEl = document.createElement( 'div' );

            exampleEl.setAttribute( 'class', 'example' );
            exampleEl.setAttribute( 'id', `example-${ i }` );
            const buttonsEl = document.createElement( 'div' );

            buttonsEl.setAttribute( 'class', 'buttons' );

            const btnToggleEl = document.createElement( 'button' );
            btnToggleEl.setAttribute( 'class', 'btn-toggle' );
            btnToggleEl.setAttribute( 'id', `btn-toggle-${ i }` );

            const btnSourceEl = document.createElement( 'button' );
            btnSourceEl.setAttribute( 'class', 'btn-source' );
            btnSourceEl.setAttribute( 'id', `btn-source-${ i }` );
            btnSourceEl.appendChild( document.createTextNode( 'Options' ) );

            const btnDestroyEl = document.createElement( 'button' );
            btnDestroyEl.setAttribute( 'class', 'btn-destroy' );
            btnDestroyEl.setAttribute( 'id', `btn-destroy-${ i }` );
            btnDestroyEl.appendChild( document.createTextNode( 'Destroy' ) );

            buttonsEl.appendChild( btnToggleEl );
            buttonsEl.appendChild( btnSourceEl );
            buttonsEl.appendChild( btnDestroyEl );
            sectionEl.appendChild( exampleEl );
            sectionEl.appendChild( buttonsEl );
            this.page.appendChild( sectionEl );
        }
    }

    listenDom () {
        document.querySelectorAll( '.btn-destroy' ).forEach( btn => {
            btn.addEventListener( 'click', e => {
                const btn = e.currentTarget;
                const parent = e.currentTarget.parentElement.parentElement;

                this.loaders[parseInt( btn.id.replace( 'btn-destroy-', '' ), 10 ) - 1].destroy();
                btn.remove();
                parent.remove();
            } );
        } );

        document.querySelectorAll( '.btn-toggle' ).forEach( btn => {
            btn.addEventListener( 'click', e => {
                const btn = e.currentTarget;
                btn.classList.toggle( 'hidden' );
                this.loaders[parseInt( btn.id.replace( 'btn-toggle-', '' ), 10 ) - 1].toggle();
            } );
        } );

        document.querySelectorAll( '.btn-source' ).forEach( btn => {
            btn.addEventListener( 'click', e => {
                const btn = e.currentTarget;

                if ( !this.modal || !( this.modal instanceof TingleModal ) ) {
                    // // instanciate new modal
                    this.modal = new TingleModal( {
                        beforeClose: () => {
                            this.modal.setContent( '' );
                            return true;
                        }
                    } );
                }

                // set content
                const indexData = parseInt( btn.id.replace( 'btn-source-', '' ), 10 ) - 1;
                const jsonOptions = Data.loadersOptions[ indexData ];
                const jsonOptionsPretty = JSON.stringify( jsonOptions, null, '\t' );
                const prismJsCode = Prism.highlight( `const loader = new SVGLoader(${ jsonOptionsPretty })`, Prism.languages.javascript );
                const codeJSHTML = `<pre class="language-javascript">${ prismJsCode }</pre>`;

                const html = `<div id="${ jsonOptions.containerId }"></div>`;
                const prismHtmlCode = Prism.highlight( html, Prism.languages.html );
                const codeHtmlHTML = `<pre class="language-html">${ prismHtmlCode }</pre>`;

                const content = `<div><p>Javascript:</p><div>${ codeJSHTML }</div><p>HTML:</p><div>${ codeHtmlHTML }</div></div>`;
                this.modal.setContent( content );

                // open modal
                this.modal.open();
            } );
        } );
    }

    listenReset () {
        document.querySelector( '.btn-reset' ).addEventListener( 'click', () => {
            this.prepareDom();
            this.loaders = this.createLoaders();
            this.listenDom();
        } );
        const observer = new MutationObserver( mutationsList => {
            for ( const mutation of mutationsList ) {
                if ( mutation.type === 'childList' ) {
                    const nbSections = this.page.querySelectorAll( 'section' ).length;

                    if ( nbSections === 0 ) {
                        this.page.classList.add( 'empty' );
                    }
                    else {
                        this.page.classList.remove( 'empty' );
                    }
                }
            }
        } );

        observer.observe( this.page, {
            attributes: true,
            childList: true,
            subtree: true
        } );
    }
}