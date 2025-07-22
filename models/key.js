module.exports = (sequelize, DataTypes) => {
    const Key = sequelize.define('Key', {
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        customerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
    return Key;
}; 