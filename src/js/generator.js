import { SVGLoader } from 'svg-loader-es6';
import { default as Clipboard } from 'clipboard';
import { default as Prism } from '../vendors/prismjs/prism';
import { default as JSColor } from '../vendors/jscolor';
import { default as TinyColor } from 'tinycolor2';

export default class Generator {
    constructor ( element ) {
        this.el = element;
        this.defaultLoaderOptions = {
            containerId: 'loader-example'
        };
        this.loader = null;
        this.svgBackground = 'auto';

        this.init();
    }

    init () {
        // Color picker
        JSColor.setClassName( 'color-picker' );
        JSColor.enable();

        const isDomValid = this.addListeners();

        if( !isDomValid ) {
            console.warn( 'Oops, it seems the dom is not valid!' );
            return false;
        }

        // Svg background selection
        const radioButtons = this.el.querySelectorAll( 'input[name="background-choice"]' );
        radioButtons.forEach( radioButton => radioButton.addEventListener( 'change', this.onBackgroundSelect.bind( this ) ) );

        // Init default values for each inputs
        const form = this.el.querySelector( '.form' );
        Object.keys( SVGLoader.defaultOptions )
            .filter( key => key !== 'containerId' )
            .forEach( key => {
                const input = form.querySelector( `#${ key }` );
                // Inputs with type range need reinit min and max to update control cursor
                if ( input.id === 'size' ) {
                    input.min = 0;
                    input.max = 50;
                }
                if ( input.id === 'minOpacity' || input.id === 'maxOpacity' ) {
                    input.min = 0;
                    input.max = 1;
                }
                input.defaultValue = key === 'fill' ? SVGLoader.defaultOptions.fill.replace( '#', '' ) : SVGLoader.defaultOptions[ key ];
            } );

        // Init button to copy code
        this.initClipboardButtons();

        // Trigger submit to create default loader with default values of the form
        this.el.querySelector( 'button[type="submit"]' ).click();
    }

    addListeners () {
        // reset button
        const resetBtn = this.el.querySelector( 'button[type="reset"]' );
        resetBtn && resetBtn.addEventListener( 'click', this.onReset.bind( this ) );

        // submit button
        const submitBtn = this.el.querySelector( 'button[type="submit"]' );
        submitBtn && submitBtn.addEventListener( 'click', this.onSubmit.bind( this ) );

        // Inputs range changes
        const rangeInputs = this.el.querySelectorAll( 'input[type="range"]' );
        rangeInputs && rangeInputs.forEach( input => input.addEventListener( 'input', this.setBadgeValue ) );

        // If dom isn't compatible
        return ( rangeInputs && submitBtn );
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

        this.setSVGBackground();

        // Display source code if user wants to copy it with clipboard button
        this.setHtmlCode( options );
        this.setJSCode( options );
    }

    setSVGBackground ( ) {
        const currentSettings = this.loader.settings;
        const svgContainer = this.el.querySelector( `#${ currentSettings.containerId }` );
        let color = this.svgBackground;
        if ( this.svgBackground === 'auto' ) {
            // Set svg background depending on color of the svg shapes
            const tc = TinyColor( currentSettings.fill || SVGLoader.defaultOptions.fill );
            const opacityMax = currentSettings.maxOpacity || SVGLoader.defaultOptions.maxOpacity;
            color = tc.isLight() ? TinyColor( 'black' ).setAlpha( opacityMax ).toString() : TinyColor( 'white' ).darken( Math.round( tc.getBrightness() / 255 * 100 ) ).setAlpha( opacityMax ).toString();
        }
        svgContainer.style.backgroundColor = color;
    }

    setHtmlCode ( options ) {
        // Create dom content to display using Prism.js
        const content = `<div id="${ options.containerId }"></div>`;

        this.fillCodeContent( 'html', content );
    }

    setJSCode ( options ) {
        // Create dom content to display using Prism.js
        const optionsLines = Object.keys( options )
            .filter( key => SVGLoader.defaultOptions[ key ] !== options[ key ] )
            .map( key => { return `${ key }: '${ options[ key ] }'`; } );
        const content = `new SVGLoader( {\n\t${ optionsLines.join( ',\n\t' ) }\n} );`;

        this.fillCodeContent( 'js', content );
    }

    fillCodeContent ( language, content, ) {
        const contentEl = this.el.querySelector( `.source-${ language } .content` );
        const btn = this.el.querySelector( `.source-${ language } .btn-copy` );
        contentEl.innerHTML = `<pre class="language-${ language }">${ Prism.highlight( content, Prism.languages[ language ] ) }</pre>`;
        btn.setAttribute( 'data-clipboard-text', content );
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

    onReset ( e ) {
        e.preventDefault();
        e.stopPropagation();

        // reset form
        e.currentTarget.form.reset();

        // reset badge for range inputs
        const rangeInputs = this.el.querySelectorAll( 'input[type="range"]' );
        rangeInputs.forEach( input => {
            input.nextElementSibling.innerHTML = input.defaultValue;
        } );

        // reset color picker
        const pickerColorInput = this.el.querySelector( '#fill' );
        pickerColorInput.jscolor && pickerColorInput.jscolor.importColor();

        // trigger a submit to create a nre loader with default options
        this.el.querySelector( 'button[type="submit"]' ).click();
    }

    onSubmit ( e ) {
        e.preventDefault();

        // If submitted directly by user get form values else default values
        const options = e.isTrusted ? this.getOptionsFromForm( e.currentTarget.form ) : this.defaultLoaderOptions;

        this.createNewLoader( options );
    }

    setBadgeValue ( e ) {
        e.currentTarget.nextElementSibling.innerHTML = e.currentTarget.value;
    }

    onBackgroundSelect ( e ) {
        this.svgBackground = e.target.value;
        this.setSVGBackground();
    }
}
