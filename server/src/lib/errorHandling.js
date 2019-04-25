'use strict';

const translations = {
    en: {
        anErrorOccurred: 'An error occurred.',
        pageNotFound: 'Page not found'
    },
    de: {
        anErrorOccurred: 'Ein Fehler ist aufgetreten.',
        pageNotFound: 'Seite nicht gefunden'
    }
};

module.exports = app => {
    // 404 Page
    app.use((req, res) => {
        res.status(404).send(translations[req.preferedLanguage].pageNotFound);
    });

    // Development error handler - will print stacktrace
    if (app.get('env') !== 'production') {
        app.use((error, req, res) => {
            console.error(error.message);
            res.status(error.status || 500).send(error.message);
        });
    }
    else {
        // Production error handler - no stacktraces leaked to user
        app.use((error, req, res) => {
            console.error(error.message);
            res.status(error.status || 500).send(translations[req.preferedLanguage].anErrorOccurred);
        });
    }

    return app;
};
