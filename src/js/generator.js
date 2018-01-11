import { SVGLoader, defaultOptions as SVGLoaderDefaultOptions } from 'svg-loader-es6';
import '../vendors/jscolor';

export default class Generator {
    constructor ( element ) {
        console.log( 'Hello Generator', element );
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

        this.el.querySelector( '.form #fill' ).defaultValue = SVGLoaderDefaultOptions.fill.replace( '#', '' );

        console.log( this.el.querySelector( '.form #fill' ).defaultValue );

        // Trigger submit to create default loader with default values of the form
        submitBtn.click();
    }

    getOptionsFromForm ( form ) {
        const containerId = form.querySelector( '#containerId' ).value || form.querySelector( '#containerId' ).placeholder;
        const svgId = form.querySelector( '#svgId' ).value || form.querySelector( '#svgId' ).placeholder;
        const size = parseInt( form.querySelector( '#size' ).value, 10 );
        const radius = parseInt( form.querySelector( '#radius' ).value, 10 );
        const duration = parseInt( form.querySelector( '#duration' ).value, 10 );
        const minOpacity = parseFloat( form.querySelector( '#minOpacity' ).value, 10 );
        const maxOpacity = parseFloat( form.querySelector( '#maxOpacity' ).value, 10 );
        const margin = parseInt( form.querySelector( '#margin' ).value, 10 );
        const nbRects = parseInt( form.querySelector( '#nbRects' ).value, 10 );
        const fill = `#${ form.querySelector( '#fill' ).value }`;

        return {
            containerId,
            svgId,
            size,
            radius,
            duration,
            minOpacity,
            maxOpacity,
            margin,
            nbRects,
            fill
        };
    }

    createNewLoader ( options ) {
        if ( this.loader ) {
            this.loader.destroy();
            this.loader = null;
        }

        this.loader = new SVGLoader( options );

        this.setHtmlCode( `<div id="${ options.containerId }"></div>` );
        this.setJSCode( options );
    }

    setHtmlCode ( content ) {
        this.el.querySelector( '.source-html' ).innerHTML = `<pre class="language-html">${ Prism.highlight( content, Prism.languages.html ) }</pre>`;
    }

    setJSCode ( options ) {
        const optionsLines = Object.keys( options )
            .filter( key => SVGLoaderDefaultOptions[ key ] !== options[ key ] )
            .map( key => { return `${ key }: '${ options[ key ] }'`; } );
        const content = `new SVGLoader( {\n\t${ optionsLines.join( ',\n\t' ) }\n} );`;
        this.el.querySelector( '.source-js' ).innerHTML = `<pre class="language-javascript">${ Prism.highlight( content, Prism.languages.javascript ) }</pre>`;
    }
}
