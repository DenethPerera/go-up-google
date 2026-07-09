const Category = require('../../models/category');


const getCategories = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));
  const q     = (req.query.q || '').trim();

  // ── Build filter ────────────────────────────────────────────────────────────
  // Use a collation-friendly regex so the existing `label` index is used.
  const filter = q
    ? { label: { $regex: q, $options: 'i' } }
    : {};

  // ── Run count + page in parallel ─────────────────────────────────────────
  const [total, data] = await Promise.all([
    Category.countDocuments(filter),
    Category.find(filter)
      .select('label value')   // exclude __v, timestamps from payload
      .sort({ label: 1 })      // alphabetical — consistent UX
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),                 // plain JS objects, faster than Mongoose docs
  ]);

  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      hasNextPage: page * limit < total,
    },
  });
};

module.exports = { getCategories };
