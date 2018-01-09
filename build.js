const chalk = require( 'chalk' );
const log = console.log;
const util = require( 'util' );
const fs = require( 'fs' );

const logger = {

    title: val => {
        const prefix = '|                                ';
        const suffix = '                                 |';
        const charTotal = prefix.length + val.length + suffix.length;
        let underline = '|';
        for ( let i = 0; i < charTotal - 2; i++ ) {
            underline += '-';
        }
        underline += '|';
        log( chalk.white.bgGreen.bold( `${underline}` ) );
        log( chalk.white.bgGreen.bold( `${prefix}${val}${suffix}` ) );
        log( chalk.white.bgGreen.bold( `${underline}` ) );
        log( '\r' );
    },

    separator: () => {
        const charTotal = 84;
        let underline = '';
        for ( let i = 0; i < charTotal; i++ ) {
            underline += '-';
        }
        log( chalk.green( `${underline}` ) );
    },

    congrats: msg => {
        log( '\r' );
        log( chalk.white.bgGreen.bold( ` ☆    ${util.inspect( msg.toUpperCase(), false, null )}  ☆  ` ) );
        log( '\r' );
    },

    info: msg => log( chalk.white( ( `►  ${util.inspect( msg, false, null )}` ) ) ),

    done: msg => log( chalk.green( ( `✓  Done:\n ${util.inspect( msg, false, null )}` ) ) ),

    error: err => log( chalk.red( ( `☹  Error:\n ${util.inspect( err, false, null )}` ) ) )
};

class Build {
    constructor () {
        logger.title( 'PREPARE BUILD' );
        logger.separator();
        this.loadPackage();
        this.prepareAppInfo();
        this.writeAppInfo();
    }

    loadPackage () {
        logger.info( 'Load ./package.json' );
        this.pkg = require( './package.json' );
        logger.done( 'package.json is loaded' );
        logger.separator();
    }

    prepareAppInfo () {
        logger.info( 'Prepare AppInfo data' );
        const timestamp = Date.now();
        this.contentFile = `window.AppInfo = { name: '${this.pkg.name}', version: '${this.pkg.version}', build: '${timestamp}', dateBuild: '${new Date( timestamp ).toISOString()}' };\n`;
        logger.done( 'AppInfo ok' );
        logger.separator();
    }

    writeAppInfo () {
        logger.info( 'Writing content into file AppInfo.js' );
        fs.writeFile( './src/js/AppInfo.js', `${this.contentFile}`, err => {
            if ( err ) {
                logger.error( err );
                return false;
            }
            logger.done( 'The file is saved!' );
            logger.separator();
            logger.congrats( 'MAZEL TOV!' );
        } );
    }
}

module.exports = ( () => {
    return new Build();
} )();
