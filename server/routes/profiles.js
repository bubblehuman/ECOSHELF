// Need Provider Project Update v2.1
import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Create Profile ─────────────────────────────────────────
// POST /api/profiles
// Headers: Authorization: Bearer <token>
// Body: { org_name, user_type, phone?, address? }
// Replaces: supa.from('profiles').insert({ id, org_name, user_type, phone, address })
router.post('/', requireAuth, async (req, res) => {
  try {
    const { org_name, user_type, phone, address } = req.body;

    if (!org_name || !user_type) {
      return res.status(400).json({ error: 'org_name and user_type are required' });
    }
    if (!['retailer', 'ngo'].includes(user_type)) {
      return res.status(400).json({ error: 'user_type must be "retailer" or "ngo"' });
    }

    const result = await query(
      `INSERT INTO profiles (id, org_name, user_type, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, org_name, user_type, phone || null, address || null]
    );

    res.status(201).json({ profile: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      // Unique violation — profile already exists
      return res.status(409).json({ error: 'Profile already exists for this user' });
    }
    console.error('[PROFILES] Create error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ─── Get Profile by ID ──────────────────────────────────────
// GET /api/profiles/:id
// Public — no auth required (needed for org name display)
// Replaces: supa.from('profiles').select('*').eq('id', id).single()
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM profiles WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('[PROFILES] Get error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ─── Update Profile ─────────────────────────────────────────
// PATCH /api/profiles/:id
// Headers: Authorization: Bearer <token>
// Body: { org_name?, phone?, address?, latitude?, longitude? }
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    // Ownership check
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const { org_name, phone, address, latitude, longitude } = req.body;
    const result = await query(
      `UPDATE profiles
       SET org_name   = COALESCE($1, org_name),
           phone      = COALESCE($2, phone),
           address    = COALESCE($3, address),
           latitude   = COALESCE($4, latitude),
           longitude  = COALESCE($5, longitude)
       WHERE id = $6
       RETURNING *`,
      [org_name, phone, address, latitude, longitude, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('[PROFILES] Update error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
