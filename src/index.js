import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { generateCode } from './utils.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Shorten URL
app.post('/shorten', async (req, res) => {
  const { url, custom } = req.body;
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  let code = custom || generateCode(6);
  try {
    const existing = await pool.query('SELECT * FROM short_urls WHERE code=$1', [code]);
    if (existing.rows.length > 0 && !custom) code = generateCode(6);
    else if (existing.rows.length > 0 && custom) return res.status(409).json({ error: 'Custom code exists' });

    await pool.query('INSERT INTO short_urls (code, target) VALUES ($1, $2)', [code, url]);
    res.status(201).json({ short_url: `${process.env.BASE_URL}/${code}`, code, target: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Redirect
app.get('/:code', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM short_urls WHERE code=$1', [req.params.code]);
    if (result.rows.length === 0) return res.status(404).send('Not found');
    await pool.query('UPDATE short_urls SET visits = visits + 1 WHERE code=$1', [req.params.code]);
    res.redirect(result.rows[0].target);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Admin list
app.get('/admin/list', async (req, res) => {
  const result = await pool.query('SELECT * FROM short_urls ORDER BY created_at DESC LIMIT 100');
  res.render('list', { items: result.rows, baseUrl: process.env.BASE_URL });
});

// Root page
app.get('/', (req, res) => {
  res.render('index', { baseUrl: process.env.BASE_URL });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));