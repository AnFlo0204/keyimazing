const express = require('express');
const router = express.Router();
const { Key } = require('../models');

// Khách hàng nhập key
router.post('/use', async (req, res) => {
    const { key, customerName } = req.body;
    if (!key || !customerName) {
        return res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    const foundKey = await Key.findOne({ where: { key } });
    if (!foundKey) {
        return res.json({ success: false, message: 'Key không hợp lệ.' });
    }
    if (foundKey.used) {
        return res.json({ success: false, message: 'Key này đã được sử dụng.' });
    }
    foundKey.used = true;
    foundKey.customerName = customerName;
    foundKey.usedAt = new Date();
    await foundKey.save();
    return res.json({ success: true, link: foundKey.link });
});

module.exports = router; 