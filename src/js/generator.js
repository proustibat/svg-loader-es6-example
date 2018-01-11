import { SVGLoader, defaultOptions as SVGLoaderDefaultOptions } from 'svg-loader-es6';
import '../vendors/jscolor';
import { default as Clipboard } from 'clipboard';

export default class Generator {
    constructor ( element ) {
        this.el = element;
        this.defaultLoaderOptions = {
            containerId: 'loader-example'
        };
        this.loader = null;

        this.init();
    }

    init () {
        // reset button
        const resetBtn = this.el.querySelector( 'button[type="reset"]' );
        resetBtn.addEventListener( 'click', e => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.form.reset();
            const rangeInputs = this.el.querySelectorAll( 'input[type="range"]' );
            rangeInputs.forEach( input => {
                input.nextElementSibling.innerHTML = input.defaultValue;
            } );
            this.el.querySelector( 'button[type="submit"]' ).click();
        } );

        // submit button
        const submitBtn = this.el.querySelector( 'button[type="submit"]' );
        submitBtn.addEventListener( 'click', e => {
            e.preventDefault();

            // If submitted directly by user get form values else default values
            const options = e.isTrusted ? this.getOptionsFromForm( e.currentTarget.form ) : this.defaultLoaderOptions;

            this.createNewLoader( options );
        } );

        // Inputs range changes
        const rangeInputs = this.el.querySelectorAll( 'input[type="range"]' );
        rangeInputs.forEach( input => {
            input.addEventListener( 'input', e => {
                e.currentTarget.nextElementSibling.innerHTML = e.currentTarget.value;
            } );
        } );

        // Init default values for each inputs
        const form = this.el.querySelector( '.form' );
        Object.keys( SVGLoaderDefaultOptions )
            .filter( key => key !== 'containerId' )
            .forEach( key => { form.querySelector( `#${ key }` ).defaultValue = key === 'fill' ? SVGLoaderDefaultOptions.fill.replace( '#', '' ) : SVGLoaderDefaultOptions[ key ]; } );

        // Init button to copy code
        this.initClipboardButtons();

        // Trigger submit to create default loader with default values of the form
        submitBtn.click();
    }

    getOptionsFromForm ( form ) {
        return {
            containerId: form.querySelector( '#containerId' ).value || form.querySelector( '#containerId' ).placeholder,
            svgId: form.querySelector( '#svgId' ).value || form.querySelector( '#svgId' ).placeholder,
            size: parseInt( form.querySelector( '#size' ).value, 10 ),
            radius: parseInt( form.querySelector( '#radius' ).value, 10 ),
            duration: parseInt( form.querySelector( '#duration' ).value, 10 ),
            minOpacity: parseFloat( form.querySelector( '#minOpacity' ).value, 10 ),
            maxOpacity: parseFloat( form.querySelector( '#maxOpacity' ).value, 10 ),
            margin: parseInt( form.querySelector( '#margin' ).value, 10 ),
            nbRects: parseInt( form.querySelector( '#nbRects' ).value, 10 ),
            fill: `#${ form.querySelector( '#fill' ).value }`
        };
    }

    createNewLoader ( options ) {
        if ( this.loader ) {
            this.loader.destroy();
            this.loader = null;
        }

        this.loader = new SVGLoader( options );

        this.setHtmlCode( options );
        this.setJSCode( options );
    }

    setHtmlCode ( options ) {
        // Create dom content to display using Prism.js
        const content = `<div id="${ options.containerId }"></div>`;
        this.el.querySelector( '.source-html .content' ).innerHTML = `<pre class="language-html">${ Prism.highlight( content, Prism.languages.html ) }</pre>`;
        // Source code if user wants to copy it with clipboard button
        this.el.querySelector( '.source-html .btn-copy' ).setAttribute( 'data-clipboard-text', content );
    }

    setJSCode ( options ) {
        // Create dom content to display using Prism.js
        const optionsLines = Object.keys( options )
            .filter( key => SVGLoaderDefaultOptions[ key ] !== options[ key ] )
            .map( key => { return `${ key }: '${ options[ key ] }'`; } );
        const content = `new SVGLoader( {\n\t${ optionsLines.join( ',\n\t' ) }\n} );`;
        this.el.querySelector( '.source-js .content' ).innerHTML = `<pre class="language-javascript">${ Prism.highlight( content, Prism.languages.javascript ) }</pre>`;

        // Source code if user wants to copy it with clipboard button
        this.el.querySelector( '.source-js .btn-copy' ).setAttribute( 'data-clipboard-text', content );
    }

    initClipboardButtons () {
        [ ...document.querySelectorAll( '.btn-copy' ) ]
            .forEach( btn => new Clipboard( btn )
                .on( 'success', this.onCopySuccess )
                .on( 'error', this.onCopyError ) );
    }

    onCopySuccess ( e ) {
        // Clear user selection
        e.clearSelection();

        // Create message element
        const messageEl = document.createElement( 'span' );
        messageEl.appendChild( document.createTextNode( 'Copied!' ) );
        messageEl.setAttribute( 'class', 'copied-message' );
        messageEl.classList.add( 'copied-message' );

        const animationListener = ( e ) => {
            // end of showing animation: add 'hide' class to close the message after 800ms
            e.animationName === 'showMessage' && setTimeout( () => e.target.classList.add( 'hide' ), 800 );
            // end of hiding animation: remove the element
            if ( e.animationName === 'hideMessage' ) {
                messageEl.removeEventListener( 'animationend', animationListener );
                e.target.remove();
            }
        };

        // Listen to the animation on the element
        messageEl.addEventListener( 'animationend', animationListener );

        // Add element to the dom
        e.trigger.parentElement.previousElementSibling.insertAdjacentElement( 'afterend', messageEl );
    }

    onCopyError ( e ) {
        console.error( 'Action:', e.action );
        console.error( 'Trigger:', e.trigger );
    }
}
