const graphqlHTTP = require('express-graphql');

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { buildSchema } = require('graphql');

const DHCPLeasesSchema = buildSchema(`
  type DHCPLeases {
    timestamp: Date,
    mac: ID,
    ip: String,
    host: String,
    id: String
  }
`);

const leases = require('dnsmasq-leases');
const fs = require('fs');
const data = fs.readFileSync('/var/lib/misc/dnsmasq.leases', 'utf8');


app.use(
    '/graphql',
    graphqlHTTP({
        schema: DHCPLeasesSchema,
        graphiql: true,
        rootValue: leases(data),
    }),
);

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/a') {
            app.render(req, res, '/a', query);
        } else if (pathname === '/b') {
            app.render(req, res, '/b', query);
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});

