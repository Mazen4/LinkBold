import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { runMigrations } from './migrate.js';
import { pool } from './db.js';
import { generateCode } from './utils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import promClient from 'prom-client';


dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Define custom metrics as per the PDF
const urlsShortenedCounter = new promClient.Counter({
  name: 'linkbold_urls_shortened_total',
  help: 'Total number of URLs successfully shortened',
});
const redirectsCounter = new promClient.Counter({
  name: 'linkbold_redirects_total',
  help: 'Total number of successful redirects',
});
const notFoundCounter = new promClient.Counter({
  name: 'linkbold_not_found_total',
  help: 'Total number of failed lookups (404 errors)',
});
const requestLatencyHistogram = new promClient.Histogram({
  name: 'linkbold_request_latency_seconds',
  help: 'Histogram for request latency in seconds',
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]
});

// Register all custom metrics
register.registerMetric(urlsShortenedCounter);
register.registerMetric(redirectsCounter);
register.registerMetric(notFoundCounter);
register.registerMetric(requestLatencyHistogram);
// --- END OF PROMETHEUS METRICS ---


// --- 3. ADD /metrics ENDPOINT ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});
// --- END OF /metrics ENDPOINT ---


// Shorten URL
app.post('/shorten', async (req, res) => {
  const end = requestLatencyHistogram.startTimer(); // <-- 4. Start latency timer
  const { url, custom } = req.body;
  if (!url || !/^https?:\/\//i.test(url)) {
    end(); // <-- 5. Stop timer on error
    return res.status(400).json({ error: 'Invalid URL' });
  }
  let code = custom || generateCode(6);
  try {
    const existing = await pool.query('SELECT * FROM short_urls WHERE code=$1', [code]);
    if (existing.rows.length > 0 && !custom) code = generateCode(6);
    else if (existing.rows.length > 0 && custom) {
      end(); // <-- 5. Stop timer on error
      return res.status(409).json({ error: 'Custom code exists' });
    }

    await pool.query('INSERT INTO short_urls (code, target) VALUES ($1, $2)', [code, url]);
    
    urlsShortenedCounter.inc(); // <-- 6. Increment counter on success
    end(); // <-- 5. Stop timer on success

    // --- 7. REPLACEMENT FOR BASE_URL ---
    // OLD: res.status(201).json({ short_url: `${process.env.BASE_URL}/${code}`, code, target: url });
    // NEW:
    res.status(201).json({ short_url: `${req.protocol}://${req.get('host')}/${code}`, code, target: url });
    // --- END OF REPLACEMENT ---

  } catch (err) {
    console.error(err);
    end(); // <-- 5. Stop timer on error
    res.status(500).json({ error: 'DB error' });
  }
});

// Redirect
app.get('/:code', async (req, res) => {
  const end = requestLatencyHistogram.startTimer(); // <-- 8. Start latency timer
  try {
    const result = await pool.query('SELECT * FROM short_urls WHERE code=$1', [req.params.code]);
    
    if (result.rows.length === 0) {
      notFoundCounter.inc(); // <-- 9. Increment 404 counter
      end(); // <-- 10. Stop timer on 404
      return res.status(404).send('Not found');
    }

    await pool.query('UPDATE short_urls SET visits = visits + 1 WHERE code=$1', [req.params.code]);
    
    redirectsCounter.inc(); // <-- 11. Increment redirect counter
    end(); // <-- 10. Stop timer on success
    
    res.redirect(result.rows[0].target);
  } catch (err) {
    console.error(err);
    end(); // <-- 10. Stop timer on error
    res.status(500).send('Error');
  }
});

// Admin list
app.get('/admin/list', async (req, res) => {
  // Dynamically get the public host
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const result = await pool.query('SELECT * FROM short_urls ORDER BY created_at DESC LIMIT 100');
  res.render('list', { items: result.rows, baseUrl: baseUrl });
});

// Root page
app.get('/', (req, res) => {
  // Dynamically get the public host
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.render('index', { baseUrl: baseUrl });
});

// Run migrations before starting the server
runMigrations().then(() => {
  app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`✅ Database ready & server running on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
