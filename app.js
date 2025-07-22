const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./models');
const { Admin } = db;
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: './' }),
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

const adminRoutes = require('./routes/admin');
const keyRoutes = require('./routes/key');
app.use('/admin', adminRoutes);
app.use('/key', keyRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

db.sequelize.sync().then(async () => {
    // Tạo admin mặc định nếu chưa có
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    if (!admin) {
        const passwordHash = await bcrypt.hash('Khanghuynh000', 10);
        await Admin.create({ username: 'admin', passwordHash });
        console.log('Admin mặc định đã được tạo: admin / Khanghuynh000');
    }
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
