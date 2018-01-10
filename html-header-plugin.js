function HtmlHeaderPlugin ( pages ) {
    HtmlHeaderPlugin.prototype.pages = pages;
}

HtmlHeaderPlugin.prototype.apply = ( compiler ) => {
    compiler.plugin( 'compilation', compilation => {
        compilation.plugin( 'html-webpack-plugin-before-html-processing', ( htmlPluginData, callback ) => {
            const internalLinks = HtmlHeaderPlugin.prototype.pages.map( page => {
                const isActive = htmlPluginData.plugin.options.filename.replace( /\..+$/, '' ) === page.filename;
                return `<li class="${ isActive ? 'isActive' : '' }"><a href="${ page.filename }.html">${ page.title }</a></li>`;
            } ).join( '' );
            const header = `
            <header class="header">
                <h1 class="title">${ htmlPluginData.plugin.options.title }</h1>
                <ul class="menu">
                    ${ internalLinks }
                    <li><a href="https://github.com/proustibat/svg-loader-es6" target="_blank">Install</a></li>
                </ul>
            </header>
            `;
            htmlPluginData.html = `${ header }${ htmlPluginData.html }`;
            callback( null, htmlPluginData );
        } );
    } );
};

module.exports = HtmlHeaderPlugin;
