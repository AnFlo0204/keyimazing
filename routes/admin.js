const express = require('express');
const router = express.Router();
const { Admin, Key } = require('../models');
const bcrypt = require('bcryptjs');

// Đăng nhập admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });
    req.session.admin = admin.username;
    res.json({ success: true });
});

// Kiểm tra đăng nhập admin
router.get('/check', (req, res) => {
    if (req.session.admin) return res.json({ loggedIn: true });
    res.json({ loggedIn: false });
});

// Đăng xuất
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Middleware bảo vệ route admin
function requireAdmin(req, res, next) {
    if (!req.session.admin) return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    next();
}

// Thêm key mới
router.post('/add-key', requireAdmin, async (req, res) => {
    const { key, link, note } = req.body;
    if (!key || !link) return res.json({ success: false, message: 'Thiếu key hoặc link.' });
    try {
        await Key.create({ key, link, note });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false, message: 'Key đã tồn tại hoặc lỗi.' });
    }
});

// Lấy danh sách key
router.get('/list', requireAdmin, async (req, res) => {
    const keys = await Key.findAll({ order: [['createdAt', 'DESC']] });
    res.json(keys);
});

// Xem chi tiết key
router.get('/detail/:key', requireAdmin, async (req, res) => {
    const key = await Key.findOne({ where: { key: req.params.key } });
    if (!key) return res.json({ success: false, message: 'Không tìm thấy key.' });
    res.json({ success: true, key });
});

module.exports = router; 