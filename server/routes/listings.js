import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/listings?status=available&category=grocery
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) {
      conditions.push(`l.status = $${idx++}`);
      params.push(status);
    }
    if (category && category !== 'all') {
      conditions.push(`l.category = $${idx++}`);
      params.push(category);
    }
    if (status === 'available') {
      conditions.push(`l.expiry_time >= NOW()`);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const result = await query(
      `SELECT l.*, p.org_name AS profiles_org_name
       FROM listings l
       LEFT JOIN profiles p ON l.business_id = p.id
       ${where}
       ORDER BY l.created_at DESC`,
      params
    );

    const listings = result.rows.map(row => {
      const { profiles_org_name, ...rest } = row;
      return { ...rest, profiles: profiles_org_name ? { org_name: profiles_org_name } : null };
    });

    res.json({ data: listings });
  } catch (err) {
    console.error('[LISTINGS] Get error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/listings/count?status=available
router.get('/count', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT COUNT(*) AS count FROM listings';
    const params = [];
    if (status) { sql += ' WHERE status = $1'; params.push(status); }
    const result = await query(sql, params);
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error('[LISTINGS] Count error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/listings/mine (Retailer's own listings)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT l.*, cp.org_name AS claimer_org_name
       FROM listings l
       LEFT JOIN profiles cp ON l.claimed_by = cp.id
       WHERE l.business_id = $1
       ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    const listings = result.rows.map(row => {
      const { claimer_org_name, ...rest } = row;
      return { ...rest, claimer: claimer_org_name ? { org_name: claimer_org_name } : null, claimer_name: claimer_org_name || null };
    });
    res.json({ data: listings });
  } catch (err) {
    console.error('[LISTINGS] Mine error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/listings/claimed (NGO's claimed rescues)
router.get('/claimed', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT l.*, p.org_name AS profiles_org_name
       FROM listings l
       LEFT JOIN profiles p ON l.business_id = p.id
       WHERE l.claimed_by = $1 AND l.status = 'claimed'
       ORDER BY l.claimed_at DESC`,
      [req.user.id]
    );
    const listings = result.rows.map(row => {
      const { profiles_org_name, ...rest } = row;
      return { ...rest, profiles: profiles_org_name ? { org_name: profiles_org_name } : null };
    });
    res.json({ data: listings });
  } catch (err) {
    console.error('[LISTINGS] Claimed error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/listings
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, category, original_price, surplus_price, expiry_time, description } = req.body;
    if (!title || !category || original_price == null || surplus_price == null || !expiry_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await query(
      `INSERT INTO listings (business_id, title, category, original_price, surplus_price, expiry_time, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'available')
       RETURNING *`,
      [req.user.id, title, category, parseFloat(original_price), parseFloat(surplus_price), expiry_time, description || null]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error('[LISTINGS] Create error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/listings/:id/claim
router.patch('/:id/claim', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `UPDATE listings SET status = 'claimed', claimed_by = $1, claimed_at = NOW()
       WHERE id = $2 AND status = 'available' RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Listing not found or already claimed' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('[LISTINGS] Claim error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM listings WHERE id = $1 AND business_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or not authorized' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[LISTINGS] Delete error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
