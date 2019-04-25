import * as http from 'http';
import { Application } from 'express';
import { AddressInfo } from 'net';

import mainApp from './App';

const port = 3010;

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

mainApp.setupApp().then(async (app: Application): Promise<void> => {
    app.set('port', port);

    const server: http.Server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', (): void => {
        const address: (string | AddressInfo) = server.address();
        const bind: string = typeof address === 'string'
            ? 'pipe ' + address
            : 'port ' + address.port;
        console.log('Listening on', bind);
    });

    console.log('Started with:');
    console.log('- Node.js', process.version);
    console.log(`- Started with NODE_ENV=${process.env.NODE_ENV}`);
}).catch((error): void => {
    console.error(error);
});
